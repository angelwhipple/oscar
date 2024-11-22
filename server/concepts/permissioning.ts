import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

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
    const _id = await this.members.createOne({ user: u });
    return { msg: "Member successfully created!", member: await this.members.readOne({ _id }) };
  }

  async addOrganizer(u: ObjectId) {
    const _id = await this.organizers.createOne({ user: u }); //adding to organizers

    const _id2 = await this.members.readOne({ user: u });

    if (!_id2) {
      //if not already in members, add as a member too
      await this.members.createOne({ user: u });
    }

    return { msg: "Member successfully created!", organizer: await this.organizers.readOne({ _id }) };
  }

  async removeOrganizerPrivileges(u: ObjectId) {
    await this.organizers.deleteOne({ user: u }); //not removing from member, cause they can still be a member!
    return { msg: "Successfully removed organizer privileges!" };
  }

  async assertUserIsOrganizer(u: ObjectId) {
    const _id = await this.organizers.readOne({ user: u });

    if (!_id) {
      //if users is not an organizer,
      throw new NotFoundError(`User ${_id} is not an organizer!`);
    }
  }
}
