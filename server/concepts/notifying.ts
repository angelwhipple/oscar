import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface NotifyingDoc extends BaseDoc {
  message: string;
  sender: ObjectId;
  recipients: ObjectId;
  action: "Payment" | "Reminder" | "SOS";
}

export default class NotifyingConcept {
  public readonly notifications: DocCollection<NotifyingDoc>;

  constructor(collectionName: string) {
    this.notifications = new DocCollection<NotifyingDoc>(collectionName);
  }

  async createNotification(s: ObjectId, r: ObjectId, content: string) {
    const _id = await this.notifications.createOne({ message: content, sender: s, recipients: r });
    return { msg: "Member successfully created!", member: await this.notifications.readOne({ _id }) };
  }
}
