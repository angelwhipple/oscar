import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ScheduleDoc extends BaseDoc {
  organizer: ObjectId;
  availability: Record<string, ObjectId[]>; // Dates : [users available that day]
  invitees: ObjectId[];
}

/**
 * concept: Scheduling [Organizer]
 */
export default class SchedulingConcept {
  public readonly schedules: DocCollection<ScheduleDoc>;

  /**
   * Make an instance of Scheduling.
   */
  constructor(collectionName: string) {
    this.schedules = new DocCollection<ScheduleDoc>(collectionName);
  }

  async create(organizer: ObjectId, startDate: Date, endDate: Date, invitees: ObjectId[]) {
    const _id = await this.schedules.createOne({ organizer, invitees });
    const availability: Record<string, ObjectId[]> = {};
    for (let i = new Date(startDate); i <= endDate; i.setDate(i.getDate() + 1)) {
      const day = i.toLocaleDateString();
      availability[day] = [];
    }
    await this.schedules.partialUpdateOne({ _id }, { availability });
    return { msg: "Meeting scheduler created", scheduler: await this.schedules.readOne({ _id }) };
  }

  async getSchedule(_id: ObjectId) {
    return await this.schedules.readOne({ _id });
  }

  /**
   * Add ONE user's meeting availability for a set of Dates
   * @param _id Meeting scheduler ID
   * @param user User ID
   * @param dates The dates a user is available
   */
  async addUserAvailability(_id: ObjectId, user: ObjectId, dates: Date[]) {
    await this.assertUserIsInvitee(_id, user);
    const schedule = await this.getSchedule(_id);
    const updated = schedule?.availability!;
    for (const date of dates) {
      const dateKey = date.toLocaleDateString();
      updated[dateKey].push(user);
    }
    await this.schedules.partialUpdateOne({ _id }, { availability: updated });
    return { msg: "Added meeting availability", schedule: await this.schedules.readOne({ _id }) };
  }

  /**
   * Remove ONE user's meeting availability for a set of Dates
   * @param _id Meeting scheduler ID
   * @param user User ID
   * @param dates The dates a user is no longer available
   */
  async removeUserAvailability(_id: ObjectId, user: ObjectId, dates: Date[]) {
    await this.assertUserIsInvitee(_id, user);
    const scheduler = await this.getSchedule(_id);
    const updated = scheduler?.availability!;
    for (const date of dates) {
      const dateKey = date.toLocaleDateString();
      updated[dateKey] = updated[dateKey].filter((invitee) => invitee.toString() !== user.toString());
    }
    await this.schedules.partialUpdateOne({ _id }, { availability: updated });
    return { msg: "Removed meeting availability", scheduler: await this.schedules.readOne({ _id }) };
  }

  /**
   *
   * @param _id
   * @param organizer
   * @returns
   * @throws
   */
  async chooseMeetingDate(_id: ObjectId, organizer: ObjectId) {
    await this.assertUserIsOrganizer(_id, organizer);
    let date;
    let attendees: ObjectId[] = [];
    const schedule = await this.getSchedule(_id);
    for (const key of Object.keys(schedule?.availability!)) {
      if (schedule?.availability[key].length! > attendees.length) {
        attendees = schedule?.availability[key]!;
        date = key;
      }
    }
    return { msg: "Selected meeting time", date, attendees };
  }

  async delete(_id: ObjectId, organizer: ObjectId) {
    await this.assertUserIsOrganizer(_id, organizer);
    await this.schedules.deleteOne({ _id });
    return { msg: "Meeting schedule deleted" };
  }

  async assertScheduleExists(_id: ObjectId) {
    const schedule = await this.schedules.readOne({ _id });
    if (!schedule) {
      throw new NotFoundError(`Meeting schedule with id ${_id} does not exist!`);
    }
    return schedule;
  }

  async assertUserIsOrganizer(_id: ObjectId, user: ObjectId) {
    const schedule = await this.assertScheduleExists(_id);
    if (schedule.organizer.toString() !== user.toString()) {
      throw new NotAllowedError(`User ${user} is not the organizer of meeting ${_id}!`);
    }
  }

  async assertUserIsInvitee(_id: ObjectId, user: ObjectId) {
    const schedule = await this.assertScheduleExists(_id);
    if (!schedule.invitees.some((invitee) => invitee.toString() === user.toString())) {
      throw new NotAllowedError(`User ${user} was not invited to meeting ${_id}!`);
    }
  }
}
