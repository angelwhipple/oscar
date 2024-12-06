import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface MessageDoc extends BaseDoc {
  content: string;
  sender: ObjectId;
  group: ObjectId;
}

/**
 * concept: Messaging
 */
export default class MessagingConcept {
  public readonly messages: DocCollection<MessageDoc>;

  constructor(collectionName: string) {
    this.messages = new DocCollection<MessageDoc>(collectionName);
  }

  async sendMessage(group: ObjectId, content: string, sender: ObjectId) {
    const _id = await this.messages.createOne({ group, sender, content });
    return { msg: `Sent new message to ${group}`, message: await this.messages.readOne({ _id }) }
  }

  async editMessage(_id: ObjectId, content: string, sender: ObjectId) {
    await this.assertUserIsSender(_id, sender);
    await this.messages.partialUpdateOne({ _id }, { content });
    return { msg: `Edited message ${_id}`, message: await this.messages.readOne({ _id }) };
  }

  async unsendMessage(_id: ObjectId, sender: ObjectId) {
    await this.assertUserIsSender(_id, sender);
    await this.messages.deleteOne({ _id });
    return { msg: `Unsent message ${_id}` };
  }

  async assertUserIsSender(_id: ObjectId, user: ObjectId) {
    const message = await this.assertMessageExists(_id);
    if (message.sender.toString() !== user.toString()) {
      throw new NotAllowedError(`User ${user} is not the sender of message ${_id}!`);
    }
  }

  async assertMessageExists(_id: ObjectId) {
    const message = await this.messages.readOne({ _id });
    if (!message) {
      throw new NotFoundError(`Message ${_id} does not exist!`);
    }
    return message;
  }

  async getMessageHistory(group: ObjectId) {
    // Sort messages from oldest -> most recent
    return await this.messages.readMany({ group }, { sort: { dateCreated: 1 } });
  }
}