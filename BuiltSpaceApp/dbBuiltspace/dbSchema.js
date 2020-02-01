import Realm from 'realm';
export const db_schema = 'db';
export const db_account = 'org';

export const DbSchema = {
  name: db_schema,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    accounts: 'list',
  },
};

export const DbAccount = {
  name: db_account,
  primaryKey: 'id',
  properties: {
    id: 'int',
    email: 'string',
    organizations: 'list',
  },
};

export const insertAccountInfo = newAccountInfo => async () => {};
