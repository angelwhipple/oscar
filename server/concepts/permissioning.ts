import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface PermissionDoc extends BaseDoc {
  user: ObjectId;
}

export default class PermissioningConcept {
  public readonly organizers: DocCollection<PermissionDoc>;
  public readonly members: DocCollection<PermissionDoc>;

  constructor(collectionName1: string, collectionName2: string) {
    this.organizers = new DocCollection<PermissionDoc>(collectionName1);
    this.members = new DocCollection<PermissionDoc>(collectionName2);
  }

  async addMember(u: ObjectId) {
    await this.assertNewMember(u);
    const _id = await this.members.createOne({ user: u });
    return { msg: "Member successfully created!", member: await this.members.readOne({ _id }) };
  }

  async addOrganizer(u: ObjectId) {
    await this.assertUserIsMember(u);
    await this.assertNewOrganizer(u);
    const _id = await this.organizers.createOne({ user: u });
    return { msg: "Member successfully created!", organizer: await this.organizers.readOne({ _id }) };
  }

  async removeOrganizerPrivileges(u: ObjectId) {
    await this.assertUserIsOrganizer(u);
    await this.organizers.deleteOne({ user: u });
    return { msg: "Successfully removed organizer privileges!" };
  }

  async removeMember(u: ObjectId) {
    await this.assertUserIsMember(u);
    await this.members.deleteOne({ user: u });
    return { msg: "Successfully removed member!" };
  }

  async getPrivileges(user: ObjectId) {
    const _id = await this.organizers.readOne({ user });
    return _id ? "organizer" : "member";
  }

  async assertUserIsOrganizer(u: ObjectId) {
    const _id = await this.organizers.readOne({ user: u });
    if (!_id) {
      throw new NotFoundError(`User ${_id} is not an organizer!`);
    }
  }

  async assertUserIsMember(u: ObjectId) {
    const _id = await this.members.readOne({ user: u });
    if (!_id) {
      throw new NotFoundError(`User ${_id} is not a member!`);
    }
  }

  async assertNewOrganizer(u: ObjectId) {
    const _id = await this.organizers.readOne({ user: u });
    if (_id) {
      throw new NotAllowedError(`User ${_id} is already an organizer!`);
    }
  }

  async assertNewMember(u: ObjectId) {
    const _id = await this.members.readOne({ user: u });
    if (_id) {
      throw new NotAllowedError(`User ${_id} is already a member!`);
    }
  }
}
