import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface ActionItem {
  action: "Payment" | "Reminder" | "SOS" | "Invitation";
}

export interface NotifyingDoc extends BaseDoc {
  message: string;
  sender: ObjectId;
  recipients: ObjectId[];
  action: ActionItem;
}

export default class NotifyingConcept {
  public readonly notifications: DocCollection<NotifyingDoc>;

  constructor(collectionName: string) {
    this.notifications = new DocCollection<NotifyingDoc>(collectionName);
  }

  async createNotification(s: ObjectId, r: ObjectId[], content: string, type: ActionItem) {
    const _id = await this.notifications.createOne({ message: content, sender: s, recipients: r, action: type });
    return { msg: "Successfully sent notification!", member: await this.notifications.readOne({ _id }) };
  }

  async getNotifications(user: ObjectId) {
    const _id = await this.notifications.readMany({
      recipients: { user },
    });
    if (!_id) {
      throw new NotFoundError(`Notification ${_id} does not exist!`);
    }
    return { msg: "Notification successfully found!", notif: await this.notifications.readOne({ _id }) };
  }
}
