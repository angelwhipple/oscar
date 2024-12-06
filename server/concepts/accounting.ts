import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

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
    const id = await this.accounts.createOne({ group, depositFrequency, depositAmount, value: 0 });
    return { msg: `Opened a new group bank account`, account: await this.accounts.readOne({ id }) };
  }

  async deposit(group: ObjectId, user: ObjectId, amount: number) {
    const account = await this.getAccountByGroup(group);
    const _id = await this.transactions.createOne({ account: account._id, user, amount });
    await this.accounts.partialUpdateOne({ group }, { value: account.value + amount });
    return { msg: `Added $${amount} to the pot`, transaction: await this.transactions.readOne({ _id }) };
  }

  async withdraw(group: ObjectId, user: ObjectId, amount: number) {
    const account = await this.getAccountByGroup(group);
    if (account.value < amount) {
      throw new NotAllowedError(`Cannot withdraw more than current pot value!`);
    }
    const _id = await this.transactions.createOne({ account: account._id, user, amount: -1 * amount });
    await this.accounts.partialUpdateOne({ group }, { value: account.value - amount });
    return { msg: `Withdrew $${amount} from the pot`, transaction: await this.transactions.readOne({ _id }) };
  }

  async getAccount(_id: ObjectId) {
    return await this.assertAccountExists(_id);
  }

  async getAccountByGroup(group: ObjectId) {
    const account = await this.accounts.readOne({ group });
    if (!account) {
      throw new NotFoundError(`Shared account for group ${group} not found.`);
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
      throw new NotFoundError(`Shared account ${_id} not found.`);
    }
    return account;
  }

  async getAccountBalance(group: ObjectId) {
    const account = await this.getAccountByGroup(group);
    return { balance: account.value };
    // const transactions = await this.transactions.readMany({ account: account._id });
    // const balance = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    // return { balance };
  }
}
