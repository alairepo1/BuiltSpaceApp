/**
 * This file contains the database schemas, and db functions
 * Creating new accounts, updating existing accounts
 */

import Realm from 'realm';
import {trigger_new_account} from '../fetchAPI'
import { acc } from 'react-native-reanimated';
// name variables
export const DB_NAME = "BuiltSpaceDB"


// database schema
export const DBSchema = {
  name: DB_NAME,
  primaryKey: 'id',
  properties: {
    id: 'int',
    accounts: {type: 'list', objectType: 'Accounts'}
  }
}

// account schema nested into DBSchema
export const accountSchema = {
  name: 'Accounts',
  primaryKey: 'id',
  properties: {
    id: 'int',
    email: 'string',
    key: 'string',
    organizations: {type: 'list', objectType: 'organizations'},
  },
};

// organization schema, nested into accountSchema
export const organizationSchema = {
  name: 'organizations',
  properties: {
    name: 'string',
    id: 'int',
    primaryEmail: 'string?',
    logourl: 'string?',
    brandingurl: 'string?',
    lastLoaded: 'date',
    checklists: {type: 'list', objectType: 'checklists'},
    assetGroup: {type: 'list', objectType: 'assetGroup'},
    buildings: {type: 'list', objectType: 'building'}
  },
};

// building schema nested into organizationSchema
export const buildingSchema = {
  name: 'building',
  properties: {
    id: 'int',
    name: 'string',
    address: 'string',
    city: 'string',
    postal_code: 'string?',
    description: 'string?',
    buildingnotes: 'string?',
    contacts: 'string?',
    customer: 'string?',
    customerid: 'int',
    privateid: 'int',
    status: 'string?',
    url: "string?",
    assets: {type: 'list', objectType: 'asset'}
    
  }
}

export const assetSchema = {
  name: 'asset',
  properties: {
    id: 'int',
    buildingid: 'int',
    categoryabbr: 'string?',
    expectedlifetime: 'float?',
    expectedlifetimeunit: 'string?',
    make: 'string?',
    model: 'string?',
    parentasset: 'string?',
    serial: 'string?',
    status: 'string?',
    quantity: 'float?',
    installationdate: 'string?',
    description: 'string?',
    servicespaces: 'string?',
    spaces: 'string?',
    name: 'string',
    parrentassetid: 'int?',
    warrentydescription: 'string?',
    repalcementcost: 'int?',
    pmrequency: 'float?',
    pmrequencyunit: 'string?',

  }
}

export const assetGroupSchema = {
  name: 'assetGroup',
  properties: {
    assetcategoryid: 'string',
    buildinggroupid: 'string',
    bulidingid: 'string?',
    assetGroupId: 'int?',
    name:'string',
    assetids: 'string?'
    // assetids: {type: 'list', objectType: 'assetSchema'}

  }
}

export const checklistsSchema = {
  name: 'checklists',
  properties: {
    id: 'string',
    workCategory: 'string',
    assetCategory: 'string',
    questions: {type: 'list', objectType: 'questions'}
  }
}

export const questionsSchema = {
  name: 'questions',
  properties: {
    id: 'int',
    checklistid: 'int',
    checklistname: 'string?',
    allowmultiplechoices: 'bool',
    colorformat: 'string',
    displayproperty:'bool',
    format:'string',
    measurementlabel: 'string',
    measurementonly: 'bool',
    measurementunit: 'string',
    number: 'string',
    propertygroup: 'string?',
    propertyname: 'string?',
    question:'string',
    questiontype:'string?',
    remarks: 'string?',
    salestaxformat:'string?',
    showmeasurements:'bool?',
    textonly: 'bool',
    updateproperty: 'bool',
    updatepropertyfromcurrent:'bool',
    validationpattern: 'string?'
  }
}




// default db options when opening a realm instance
const databaseOptions = {
  path: 'realmdbtest.realm',
  schema: [
    DBSchema,
    accountSchema,
    organizationSchema, 
    buildingSchema,
    checklistsSchema,
    assetGroupSchema,
    questionsSchema,
    assetSchema
  ],
}

// create a new account in the db
export const insertNewAccount = async (accountDetails, accountOrganizations) => {
  if (Realm.exists(databaseOptions)) {
    try{
      Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
          const account = realm.create('Accounts', {
            id: accountDetails.id,
            email: accountDetails.email,
            key: accountDetails.key,
            organizations: []
          })
          
          for (var org = 0; org < accountOrganizations.length; org++){
            account.organizations.push(accountOrganizations[org])
          }
        })
        realm.close()
      })
    }catch(err) { console.log(err)}
  }else {
    await create_db()
    insertNewAccount(accountDetails, accountOrganizations)
  }
  

}

// update an existing account in the db, the function queries the account id
export const updateAccount = async (newAccountDetails) => {
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let updateAccount = realm.objectForPrimaryKey(DB_NAME, newAccountDetails.id)

      // update account below
      new_organizations = []
      newAccountDetails.organizations.forEach(org => {new_organizations.push(org)})

      updateAccount.organizations = new_organizations

        })
  })
}

/**
 * 
 * @param {object} account account details to check if account exists
 */
export const checkAccountExists = async (account) => {
  try{
    if (Realm.exists(databaseOptions)) {
      await Realm.open(databaseOptions).then(realm => {
        if (realm.objects('Accounts').filtered(`id == '${account.id}' && email == '${account.email}'`).isValid()) {
          return true// check if account exists
        }else{
          return false
        }
      })
    }else{
      await create_db()
      trigger_new_account(account)
    }
  }catch(e) { console.log(e)} 
  
}

/**
 * @param {object} accountDetails passed in by Home Screen
 */
export const get_account = async (accountDetails) => {
  // Fetches account info from realm
  if (Realm.exists(databaseOptions)) {

  }
}

// delete db for testing
export const delete_db = async () => {
  if (Realm.exists(databaseOptions)) {
    try{
      Realm.deleteFile(databaseOptions)
      console.log("db deleted.")
    }catch(e) {console.log(e)} 
  }else{
    console.log("Does not exist")
  }
}

export const delete_acc = async (accountInfo) => {
  Realm.open(databaseOptions).then(realm => {
    realm.write(()=> {
      var theaccount =realm.objects('Accounts')

      var account = realm.objects('Accounts').filtered(`id == ${accountInfo.id} && email == '${accountInfo.email}'`)

      // delete bottom arrays
      account.forEach(account => { 
        account.organizations.forEach( async org => {
          org.assetGroup.forEach(assetGroup => {
            realm.delete(assetGroup)
          })
          org.checklists.forEach(checklist => {
            realm.delete(checklist.questions)
          })
          org.buildings.forEach(building => {
            realm.delete(building.assets)
            })
          })
        })

        //delete secondary arrays
        account.forEach(account => {
          account.organizations.forEach(org => {
            realm.delete(org.buildings)
            realm.delete(org.checklists)
          })
          realm.delete(account) // delete account
        })
    })
  })

}

export const dbGetInfo = async(accountInfo) => {
  Realm.open(databaseOptions).then(realm => {
    var account = realm.objects('Accounts').filtered(`id == ${accountInfo.id}`)    
    return account
  }).catch((e) => console.log(e))
}

export const checklists = async(accountInfo) => {
  Realm.open(databaseOptions).then(realm => {
    var account = realm.objects('Accounts').filtered(`id == ${accountInfo.id}`)    
    // should be filtering an organizations checklist
    return 
  }).catch((e) => console.log(e))
}

export const buildings = async(accountInfo) => {
  Realm.open(databaseOptions).then(realm => {
    var account = realm.objects('Accounts').filtered(`id == ${accountInfo.id}`)    
    // should be filtering an organizations buildings
    // console.log(Array.from(account[0].organizations[0].buildings))
    var data = Array.from(account[0].organizations[0].buildings)
    // console.log(data)
    return "lakjfs;lekfja;slkejf"
  }).catch((e) => console.log(e))
}

export const checkDBExists = async() => {
  if (Realm.exists(databaseOptions)) {
    return true
  }else {return false}
}

/**
 * create db if db does not exist 
 * usually when app is first started
 */

create_db =  async() => {
  await Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      realm.create(DB_NAME, {
        id: 1,
        accounts: []
      })
    })
    realm.close()
  }).catch((e)=> {console.log(e)})
}