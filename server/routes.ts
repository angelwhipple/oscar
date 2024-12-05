import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Friending, Grouping, Notifying, Permissioning, Posting, Scheduling, Sessioning } from "./app";
import { ActionItem } from "./concepts/notifying";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  /**
   * USERS/AUTHENTICATION
   */

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.get("/users/:id")
  @Router.validate(z.object({ id: z.string().min(1) }))
  async getUserById(id: string) {
    const oid = new ObjectId(id);
    return await Authing.getUserById(oid);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    return await Authing.create(username, password);
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  /**
   * PERMISSIONING
   */

  @Router.get("/permissions")
  async getUserRole(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Permissioning.getPrivileges(user);
  }

  @Router.get("/permissions/new")
  async checkNewMember(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Permissioning.checkUserIsNewMember(user);
  }

  @Router.post("/permissions/member")
  async createMember(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Permissioning.addMember(user);
  }

  @Router.post("/permissions/organizer")
  async createOrganizer(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    await Permissioning.addMember(user);
    return await Permissioning.addOrganizer(user);
  }
  /**
   * NOTIFYING
   */

  @Router.post("/notifying")
  async createNotif(session: SessionDoc, recepients: ObjectId[], message: string, action: ActionItem) {
    const user = Sessioning.getUser(session);
    return await Notifying.createNotification(user, recepients, message, action);
  }

  @Router.get("/notifying/display")
  async displayNotif(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Notifying.getNotifications(user);
  }

  /**
   * POSTS
   */

  @Router.get("/posts")
  @Router.validate(z.object({ author: z.string().optional() }))
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else {
      posts = await Posting.getPosts();
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, content: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, content?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return await Posting.update(oid, content, options);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return Posting.delete(oid);
  }

  /**
   * FRIENDS
   */

  @Router.get("/friends")
  async getFriends(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.idsToUsernames(await Friending.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: SessionDoc, friend: string) {
    const user = Sessioning.getUser(session);
    const friendOid = (await Authing.getUserByUsername(friend))._id;
    return await Friending.removeFriend(user, friendOid);
  }

  @Router.get("/friend/requests")
  async getRequests(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Responses.friendRequests(await Friending.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.sendRequest(user, toOid);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.removeRequest(user, toOid);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.acceptRequest(fromOid, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.rejectRequest(fromOid, user);
  }

  /**
   * GROUPS
   */
  @Router.get("/groups")
  async getAllGroups() {
    return await Grouping.getAllGroups();
  }

  @Router.get("/groups/organizer/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getGroupsByOrganizer(username: string) {
    const organizer = (await Authing.getUserByUsername(username))._id;
    return await Grouping.getGroupsByOrganizer(organizer);
  }

  @Router.patch("/groups/rename/:id")
  async renameGroup(session: SessionDoc, id: string, name: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await Grouping.rename(oid, user, name);
  }

  @Router.patch("/groups/members/add/:id")
  async addMember(session: SessionDoc, id: string, username: string) {
    const user = (await Authing.getUserByUsername(username))._id;
    const oid = new ObjectId(id);
    return await Grouping.addMember(oid, user);
  }

  @Router.patch("/groups/members/remove/:id")
  async removeMember(session: SessionDoc, id: string, username: string) {
    const user = (await Authing.getUserByUsername(username))._id;
    const oid = new ObjectId(id);
    return await Grouping.removeMember(oid, user);
  }

  @Router.post("/groups")
  async createGroup(session: SessionDoc, name: string, rules: string, frequency: string, contribution: string) {
    const user = Sessioning.getUser(session);
    const response = await Grouping.create(name, rules, user);
    // TODO: include duration/endDate
    await Accounting.openAccount(response.group?._id!, Number(frequency), Number(contribution));
    return response;
  }

  @Router.get("/groups/:id")
  async fetchGroup(session: SessionDoc, id: string) {
    const oid = new ObjectId(id);
    return await Grouping.getGroupById(oid);
  }

  @Router.get("/groups/transactions/:id")
  async getGroupTransactions(session: SessionDoc, id: string) {
    const oid = new ObjectId(id);
    return await Grouping.getGroupTransactions(oid);
  }

  @Router.get("/users/transactions/:id")
  async getUserTransactions(session: SessionDoc, id: string) {
    const oid = new ObjectId(id);
    return await Grouping.getGroupTransactions(oid);
  }

  @Router.patch("/groups/transactions/contribute/:id")
  async makeContribution(session: SessionDoc, id: string, amount: string) {
    const user = Sessioning.getUser(session);
    const group = new ObjectId(id);
    await Grouping.assertUserIsMember(group, user);
    return await Accounting.deposit(group, user, Number(amount));
  }

  @Router.patch("/groups/transactions/withdraw/:id")
  async makeWithdrawal(session: SessionDoc, id: string, amount: string) {
    const user = Sessioning.getUser(session);
    const group = new ObjectId(id);
    await Grouping.assertUserIsMember(group, user);
    return await Accounting.withdraw(group, user, Number(amount));
  }

  @Router.patch("/groups/reset/:id")
  async resetCycle(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
  }

  @Router.delete("/groups/:id")
  async disbandGroup(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await Grouping.disband(oid, user);
  }

  /**
   * TRANSACTIONS
   */
  @Router.get("/groups/balance/:id")
  async getGroupBalance(session: SessionDoc, id: string) {
    const group = new ObjectId(id);
    return await Accounting.getAccountBalance(group);
  }
  /**
   * MEETINGS
   */

  @Router.post("/meetings")
  async createMeetingScheduler(session: SessionDoc, group: string, dateFrom: string, dateTo: string) {
    const user = Sessioning.getUser(session);
    const groupId = new ObjectId(group);
    const groupMembers = await Grouping.getMembers(groupId);
    return await Scheduling.create(user, new Date(dateFrom), new Date(dateTo), groupMembers);
  }

  @Router.get("/meetings/:id")
  async fetchScheduler(session: SessionDoc, id: string) {
    const oid = new ObjectId(id);
    return await Scheduling.getSchedule(oid);
  }

  @Router.put("/meetings/available/:id")
  async addMeetingAvailability(session: SessionDoc, id: string, date: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await Scheduling.addUserAvailability(oid, user, [new Date(date)]);
  }

  @Router.put("/meetings/unavailable/:id")
  async removeMeetingAvailability(session: SessionDoc, id: string, date: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await Scheduling.removeUserAvailability(oid, user, [new Date(date)]);
  }

  @Router.get("/meetings/schedule/:id")
  async scheduleMeeting(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await Scheduling.chooseMeetingDate(oid, user);
  }

  @Router.delete("/meetings/:id")
  async deleteMeetingScheduler(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await Scheduling.delete(oid, user);
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
