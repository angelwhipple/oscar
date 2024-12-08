import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { AlreadyExistsError, NotAllowedError, NotFoundError } from "./errors";

export interface GroupDoc extends BaseDoc {
  name: string;
  rules: string;
  organizer: ObjectId;
  members: ObjectId[];
}

export interface RequestDoc extends BaseDoc {
  group: ObjectId;
  sender: ObjectId;
  recipient: ObjectId;
  status: "pending" | "declined" | "accepted"
}

/**
 * concept: Grouping [Organizer]
 */
export default class GroupingConcept {
  public readonly groups: DocCollection<GroupDoc>;
  public readonly requests: DocCollection<RequestDoc>;

  constructor(collectionName: string) {
    this.groups = new DocCollection<GroupDoc>(collectionName);
    this.requests = new DocCollection<RequestDoc>(collectionName + "_requests");
  }

  async sendGroupRequest(group: ObjectId, sender: ObjectId, recipient: ObjectId, type: string) {
    await this.assertUserNotMember(group, (type === "invite" ? recipient : sender));
    await this.assertNewRequest(group, sender, recipient);
    const model = await this.groups.readOne({ _id: group });
    const _id = await this.requests.createOne({ group, sender, recipient, status: "pending" });
    return { msg: `Successfully sent request`, request: await this.requests.readOne({ _id }) };
  }

  async acceptGroupRequest(_id: ObjectId, recipient: ObjectId, type: string) {
    await this.assertUserIsRequestRecipient(_id, recipient);
    await this.requests.partialUpdateOne({ _id }, { status: "accepted" });
    const invitation = await this.requests.readOne({ _id });
    const group = await this.groups.readOne({ _id: invitation!.group });
    return await this.addMember(group!._id, (type === "invite" ? invitation!.recipient : invitation!.sender));
  }

  async declineGroupRequest(_id: ObjectId, recipient: ObjectId) {
    await this.assertUserIsRequestRecipient(_id, recipient);
    await this.requests.partialUpdateOne({ _id }, { status: "declined" });
    return { msg: `Declined group request`, request: await this.requests.readOne({ _id }) }
  }

  async getRequestById(_id: ObjectId) {
   return await this.assertRequestExists(_id);
  }

  async getRequestsByRecipient(recipient: ObjectId) {
    return await this.requests.readMany({ recipient });
  }

  async getRequestsByGroup(group: ObjectId) {
    return await this.requests.readMany({ group });
  }

  async create(name: string, rules: string, organizer: ObjectId) {
    await this.assertNewName(name);
    const _id = await this.groups.createOne({ name, rules, organizer, members: [organizer] });
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
    // return await this.transactions.readMany({ group }, { sort: { dateCreated: -1 } });
  }

  async rename(_id: ObjectId, organizer: ObjectId, name: string) {
    await this.assertUserIsOrganizer(_id, organizer);
    await this.assertNewName(name);
    await this.groups.partialUpdateOne({ _id }, { name });
    return { msg: `Renamed group: ${name}`, group: await this.groups.readOne({ _id }) };
  }

  async addMember(_id: ObjectId, user: ObjectId) {
    await this.assertUserNotMember(_id, user);
    await this.groups.extendArray({ _id }, { members: user });
    return { msg: `Added user to group!` };
  }

  async addManyMembers(_id: ObjectId, owner: ObjectId, users: ObjectId[]) {
    await this.assertUserIsOrganizer(_id, owner); // Only group owners can bulk add members
    await Promise.all(users.map((user) => this.assertUserNotMember(_id, user)));
    await this.groups.extendArray({ _id }, { members: { $each: users } });
    return { msg: `Added new users to group ${_id}` };
  }

  async removeMember(_id: ObjectId, user: ObjectId) {
    await this.assertUserIsMember(_id, user); // Anyone can leave a group, no ownership check
    await this.groups.pullFromArray({ _id }, { members: user });
    return { msg: `Removed user ${user} from group` };
  }

  async removeManyMembers(_id: ObjectId, owner: ObjectId, members: ObjectId[]) {
    await this.assertUserIsOrganizer(_id, owner); // Only group owners can bulk remove members
    await Promise.all(members.map((member) => this.assertUserIsMember(_id, member)));
    await Promise.all(members.map((member) => this.groups.pullFromArray({ _id }, { members: member })));
    return { msg: `Removed multiple users from group` };
  }

  async disband(_id: ObjectId, user: ObjectId) {
    await this.assertUserIsOrganizer(_id, user);
    await this.groups.deleteOne({ _id });
    return { msg: "Group disbanded successfully!" };
  }

  async assertUserIsOrganizer(_id: ObjectId, user: ObjectId) {
    const group = await this.assertGroupExists(_id);
    if (group.organizer.toString() !== user.toString()) {
      throw new NotAllowedError(`User does not own the group!`);
    }
  }

  async assertUserIsMember(_id: ObjectId, user: ObjectId) {
    const group = await this.assertGroupExists(_id);
    if (group.members.every((member) => member.toString() !== user.toString())) {
      throw new NotAllowedError(`User is not a member of this group!`);
    }
  }

  async assertUserNotMember(_id: ObjectId, user: ObjectId) {
    const group = await this.assertGroupExists(_id);
    if (group.members.some((member) => member.toString() === user.toString())) {
      throw new NotAllowedError(`User is already a group member!`);
    }
  }

  async assertGroupExists(_id: ObjectId) {
    const group = await this.groups.readOne({ _id });
    if (!group) {
      throw new NotFoundError(`Group ${_id} does not exist!`);
    }
    return group;
  }

  async assertNewName(name: string) {
    const group = await this.groups.readOne({ name });
    if (group) {
      throw new AlreadyExistsError(`A group named ${name} already exists!`);
    }
  }

  async assertRequestExists(_id: ObjectId) {
    const request = await this.requests.readOne({ _id });
    if (!request) {
      throw new NotAllowedError(`Request doesn't exist!`);
    }
    return request;
  }

  async assertNewRequest(group: ObjectId, sender: ObjectId, recipient: ObjectId) {
    const request = await this.requests.readOne({ group, sender, recipient, status: "pending" });
    if (request) {
      throw new AlreadyExistsError(`Request has already been made!`);
    }
  }

  async assertUserIsRequestRecipient(_id: ObjectId, user: ObjectId) {
    const request = await this.assertRequestExists(_id)
    if (request.recipient.toString() !== user.toString()) {
      throw new NotAllowedError(`User ${user} is not the recipient of request ${_id}!`);
    }
  }
}
