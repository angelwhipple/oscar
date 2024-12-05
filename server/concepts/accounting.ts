import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface AccountDoc extends BaseDoc {
  value: number;
  depositFrequency: number; // in weeks
  depositAmount: number;
  group: ObjectId; // a Group ID
  expirationDate: Date;
}

export interface TransactionDoc extends BaseDoc {
  account: ObjectId;
  user: ObjectId;
  amount: number; // can be + or -
}

/**
 * concept: Accounting [Owner]
 */
export default class AccountingConcept {
  public readonly accounts: DocCollection<AccountDoc>;
  public readonly transactions: DocCollection<TransactionDoc>;

  constructor(collectionName: string) {
    this.accounts = new DocCollection<AccountDoc>(collectionName);
    this.transactions = new DocCollection<TransactionDoc>(collectionName + "_transactions");
  }

  async openAccount(group: ObjectId, depositFrequency: number, depositAmount: number) {
    const id = await this.accounts.createOne({ group, depositFrequency, depositAmount });
    return { msg: `Opened new shared bank account`, account: await this.accounts.readOne({ id }) };
  }

  async deposit(group: ObjectId, user: ObjectId, amount: number) {
    const account = await this.getAccountByGroup(group);
    const _id = await this.transactions.createOne({ account: account._id, user, amount });
    return { msg: `${user} paid $${amount} to account ${account._id}`, transaction: await this.transactions.readOne({ _id }) };
  }

  async withdraw(group: ObjectId, user: ObjectId, amount: number) {
    const account = await this.getAccountByGroup(group);
    const _id = await this.transactions.createOne({ account: account._id, user, amount: -1 * amount });
    return { msg: `${user} withdrew $${amount} from account ${account._id}`, transaction: await this.transactions.readOne({ _id }) };
  }

  async getAccount(_id: ObjectId) {
    return await this.assertAccountExists(_id);
  }

  async getAccountByGroup(group: ObjectId) {
    const account = await this.accounts.readOne({ group });
    if (!account) {
      throw new NotFoundError(`Account for ROSCA group ${group} doesn't exist!`);
    }
    return account;
  }

  async getAccountTransactions(account: ObjectId) {
    await this.assertAccountExists(account);
    return await this.transactions.readMany({ account });
  }

  async getAccountTransactionsByUser(account: ObjectId, user: ObjectId) {
    await this.assertAccountExists(account);
    return await this.transactions.readMany({ account, user });
  }

  async getTransactionsByUser(user: ObjectId) {
    return await this.transactions.readMany({ user });
  }

  async assertAccountExists(_id: ObjectId) {
    const account = await this.accounts.readOne({ _id });
    if (!account) {
      throw new NotFoundError(`Account ${_id} doesn't exist!`);
    }
    return account;
  }
  //Get Account Balance
  async getAccountBalance(group: ObjectId) {
    const account = await this.getAccountByGroup(group);
    const transactions = await this.transactions.readMany({ account: account._id });
    const balance = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    return { balance };
  }
}
