import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { AlreadyExistsError, BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface TransactionDoc extends BaseDoc {
  user: ObjectId,
  group: ObjectId,  // a Group ID
  amount: number  // can be + or -
}

export interface GroupDoc extends BaseDoc {
  name: string;
  rules: string;
  organizer: ObjectId;
  members: ObjectId[];
  value: number;
  cycleStart: Date;
  cycleDuration: number;  // in weeks
  contributionFrequency: number; // in weeks
  contributionAmount: number;
}

/**
 * concept: Grouping [Organizer]
 */
export default class GroupingConcept {
  public readonly groups: DocCollection<GroupDoc>;
  public readonly transactions: DocCollection<TransactionDoc>;

  constructor(collectionName: string) {
    this.groups = new DocCollection<GroupDoc>(collectionName);
    this.transactions = new DocCollection<TransactionDoc>(collectionName);
  }

  async create(name: string, rules: string, organizer: ObjectId, duration: number, frequency: number, contribution: number) {
    await this.assertNewGroup(name);
    const _id = await this.groups.createOne({
      name,
      rules,
      organizer,
      members: [organizer],
      value: 0,
      cycleStart: new Date(),
      cycleDuration: duration,
      contributionFrequency: frequency,
      contributionAmount: contribution
    });
    return { msg: `Created new ROSCA group: ${name}`, group: await this.groups.readOne({ _id }) };
  }

  async getOrganizer(_id: ObjectId) {
    const group = await this.assertGroupExists(_id);
    return group.organizer;
  }

  async getMembers(_id: ObjectId) {
    const group = await this.assertGroupExists(_id);
    return group.members;
  }

  async getGroupById(_id: ObjectId) {
    return await this.groups.readOne({ _id });
  }

  async getAllGroups() {
    return await this.groups.readMany({}, { sort: { _id: -1 } });
  }

  async getGroupsByOrganizer(organizer: ObjectId) {
    return await this.groups.readMany({ organizer });
  }

  async getGroupsByName(name: string) {
    return await this.groups.readMany({ name: { $regex: name, $options: "i" } });
  }

  async getGroupTransactions(group: ObjectId) {
    await this.assertGroupExists(group);
    // Sort from most recent -> oldest transaction
    return await this.transactions.readMany({ group }, { sort: { dateCreated: -1 } });
  }

  async rename(_id: ObjectId, organizer: ObjectId, name: string) {
    await this.assertUserIsOrganizer(_id, organizer);
    await this.groups.partialUpdateOne({ _id }, { name })
    return { msg: `Renamed group: ${name}`, group: await this.groups.readOne({ _id }) };
  }

  async contribute(_id: ObjectId, user: ObjectId, amount: number) {
    await this.assertUserIsMember(_id, user);
    const group = await this.groups.readOne({ _id });
    await this.groups.partialUpdateOne({ _id }, { value: group?.value! + amount })
    const id = await this.transactions.createOne({ user, group: _id, amount: amount })
    return { msg: `Contributed $${amount} to ${group?.name}`, transaction: await this.transactions.readOne({ _id: id }) };
  }

  async withdraw(_id: ObjectId, user: ObjectId, amount: number) {
    await this.assertUserIsMember(_id, user);
    const group = await this.groups.readOne({ _id });
    await this.groups.partialUpdateOne({ _id }, { value: group?.value! - amount })
    const id = await this.transactions.createOne({ user, group: _id, amount: -1 * amount })
    return { msg: `Withdrew $${amount} from ${group?.name}`, transaction: await this.transactions.readOne({ _id: id }) };
  }

  async addMember(_id: ObjectId, user: ObjectId) {
    await this.assertUserNotMember(_id, user);
    await this.groups.extendArray({ _id }, { members: user });
    return { msg: `Added user ${user} to group ${_id}` };
  }

  async addManyMembers(_id: ObjectId, owner: ObjectId, users: ObjectId[]) {
    await this.assertUserIsOrganizer(_id, owner); // Only group owners can bulk add members
    await Promise.all(users.map(user => this.assertUserNotMember(_id, user)));
    await this.groups.extendArray({ _id }, { members: { $each: users } });
    return { msg: `Added new users to group ${_id}` };
  }

  async removeMember(_id: ObjectId, user: ObjectId) {
    await this.assertUserIsMember(_id, user); // Anyone can leave a group, no ownership check
    await this.groups.pullFromArray({ _id }, { members: user });
    return { msg: `Removed user ${user} from group ${_id}` };
  }

  async removeManyMembers(_id: ObjectId, owner: ObjectId, members: ObjectId[]) {
    await this.assertUserIsOrganizer(_id, owner); // Only group owners can bulk remove members
    await Promise.all(members.map(member => this.assertUserIsMember(_id, member)));
    await Promise.all(members.map(member => this.groups.pullFromArray({ _id }, { members: member })));
    return { msg: `Removed multiple users from group ${_id}` };
  }

  async resetCycle(_id: ObjectId, organizer: ObjectId) {
    await this.assertUserNotMember(_id, organizer);
    await this.groups.partialUpdateOne({ _id }, { cycleStart: new Date(), value: 0 })
    return { msg: `Reset ROSCA cycle for group: ${_id}`, group: await this.groups.readOne({ _id }) };
  }

  async disband(_id: ObjectId, user: ObjectId) {
    await this.assertUserIsOrganizer(_id, user)
    await this.groups.deleteOne({ _id });
    return { msg: "Group disbanded successfully!" };
  }

  async assertUserIsOrganizer(_id: ObjectId, user: ObjectId) {
    const group = await this.assertGroupExists(_id);
    if (group.organizer.toString() !== user.toString()) {
      throw new NotAllowedError(`User ${user} is not the owner of group ${_id}!`);
    }
  }

  async assertUserIsMember(_id: ObjectId, user: ObjectId) {
    const group = await this.assertGroupExists(_id);
    if (group.members.every(member => member.toString() !== user.toString())) {
      throw new NotAllowedError(`User ${user} is a member of group ${_id}!`);
    }
  }

  async assertUserNotMember(_id: ObjectId, user: ObjectId) {
    const group = await this.assertGroupExists(_id);
    if (group.members.some(member => member.toString() === user.toString())) {
      throw new NotAllowedError(`User ${user} is already a member of group ${_id}!`);
    }
  }

  async assertGroupExists(_id: ObjectId) {
    const group = await this.groups.readOne({ _id });
    if (!group) {
      throw new NotFoundError(`Group with id ${_id} does not exist!`);
    }
    return group;
  }

  async assertNewGroup(name: string) {
    const group = await this.groups.readOne({ name });
    if (group) {
      throw new AlreadyExistsError(`Group with name ${name} already exists!`);
    }
  }
}