/**
 * This file contains the database schemas, and db functions
 * Creating new accounts, updating existing accounts
 */

import Realm from 'realm';
import {trigger_new_account, fetchOrgs} from '../fetchAPI'
import { acc } from 'react-native-reanimated';
// name variables
export const DB_NAME = "BuiltSpaceDB"


// database schema
export const DBSchema = {
  name: DB_NAME,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
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
    api_key: 'string',
    lastUpdated: 'date?',
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
    absoluteurl: 'string?',
    lastLoaded: 'date',
    lastUpdated: 'date?',
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
    lastLoaded: 'date',
    lastUpdated: 'date?',
    assets: {type: 'list', objectType: 'asset'},
    spaces: {type: 'list', objectType: 'spaces'}
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

export const spaceSchema = {
  name: 'spaces',
  properties: {
    floor: 'string?',
    grossspace: 'int?',
    id: 'int',
    netspace: 'int?',
    spaceunit: 'string?',
    suitenumber: 'string?',
    usage: 'string?'
  }
}

export const assetGroupSchema = {
  name: 'assetGroup',
  properties: {
    id: 'string',
    assetcategoryid: 'string',
    buildinggroupid: 'string',
    bulidingid: 'string?',
    assetGroupId: 'int?',
    name:'string',
    assetids: 'string?[]'
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


/**
 * Database Service/Functions
 */

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
    assetSchema,
    spaceSchema
  ],
}

// create a new account in the db
const insertNewAccount = (accountDetails, accountOrganizations) => {
  var currentDate = new Date()
    try{
      Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
          var db = realm.objectForPrimaryKey(DB_NAME, 1) //account query
          const account = {
            id: accountDetails.id,
            email: accountDetails.email,
            api_key: accountDetails.api_key,
            lastUpdated: currentDate,
            organizations: []
          }
          for (var org = 0; org < accountOrganizations.length; org++){
            account.organizations.push(accountOrganizations[org])
          }
          db.accounts.push(account)
        })
        realm.close()
      }).catch(e => {console.log(e)})
    }catch(err) { console.log(err)}
}


export const updateOrgs = (accountDetails, orgs) => {
  // updates organizations after 1 hr or refreshed
  var currentDate = new Date()

  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      var account = realm.objectForPrimaryKey(`Accounts`, accountDetails.id)
      orgs.lastUpdated = currentDate
      realm.create('Accounts',{
        id: accountDetails.id, 
        lastUpdated: currentDate, 
        organizations: [orgs]
      } ,'modified')
    })
    console.log('updated orgs')
  }).catch(e => {console.log('updateOrgs: ', e)})
  
}

// export const updateBuildings = (accountDetails, building) => {
  
// }

/**
 * 
 * check if database exists if not, create it.
 * then check if logged in account exists, if not 
 * inserts a new account with insertNewAccount()
 */
export const checkAccountExists = async (accountDetails) => {
  try{
    if (Realm.exists(databaseOptions)) {
      Realm.open(databaseOptions).then(realm => {
      console.log(realm.path)
      var valid = realm.objectForPrimaryKey(`Accounts`, accountDetails.id)
      if (valid !== undefined){
        console.log('account exists')
      }

      if (valid == undefined){
        console.log("no account found: ", valid)
        fetchOrgs(accountDetails).then(orgs =>{
          insertNewAccount(accountDetails, orgs)
        })
      }
      
      })
    }else{
      await create_db()
    }
  }catch(e) { console.log('checkAccountExists: ',e)} 
}

/**
 * Gets account details and orgs from database
 */
export const getAccountOrgs = async (accountDetails) => {
  // Fetches account info from realm
  try{
    var realm = await Realm.open(databaseOptions).catch(e => {console.log("realm cannot open")}) //open realm to query
    var account = realm.objectForPrimaryKey('Accounts', accountDetails.id) //account query
    return Promise.resolve(account)

  }catch(e){console.log('getAccountOrgs error: ', e)}
}

export const DBcheckOrgData = async (accountDetails, organization) => {
  console.log('DBCHECKORGDATA')
  var orgArray = []
  try{
    await Realm.open(databaseOptions).then(realm => {
      realm.write(()=> {
        var account = realm.objectForPrimaryKey('Accounts', accountDetails.id) //account query
        var org = account.organizations.filtered(`id = ${organization.id}`)
        
        if (!org[0].buildings.isEmpty()){
          orgArray.push(org[0])
          // return Promise.resolve(orgArray)
        } else {
          return Promise.resolve(false)
        }
      })
      console.log("realm done")
    }).catch(e => {console.log('failed to open realm in DBcheckOrgData()')})
    return orgArray
  }catch(e){console.log('dbcheckorg: ', e)}

}

export const DBcheckBuildingData = async(accountDetails, organization ,building) => {
  var realm = await Realm.open(databaseOptions).catch(e => {console.log('failed to open realm in DBcheckOrgData()')})
  var account = realm.objectForPrimaryKey('Accounts', accountDetails.id) //account query
  var org = account.organizations.filtered(`id = ${organization.id}`)
  var building = org[0].buildings.filtered(`id = ${building.id}`)

  if (!building[0].assets.isEmpty()){
    return Promise.resolve(Array.from(building))
  } else {
    return Promise.resolve(false)
  }
}

export const DBgetOrgData = async (accountDetails, organization) => {
  var currentDate = new Date()

  var realm = await Realm.open(databaseOptions).catch(e => {console.log('failed to open realm in getBuilding()')})
  var account = realm.objectForPrimaryKey('Accounts', accountDetails.id) //account query
  var org = account.organizations.filtered(`id = ${organization.id}`)
  realm.write(() => {
    org[0].lastLoaded = currentDate
  })
  return Array.from(org)
}

// delete db for testing
export const delete_db = async () => {
  if (Realm.exists(databaseOptions)) {
    try{
      Realm.deleteFile(databaseOptions)
      console.log("db deleted.")
    }catch(e) {console.log('delete db',e)} 
  }else{
    console.log("Does not exist")
  }
}

// export const delete_acc = async (accountInfo) => {

//   try{

//     Realm.open(databaseOptions).then(realm => {
//       realm.write(()=> {
//         var account = realm.objects('Accounts').filtered(`id == ${accountInfo.id} && email == '${accountInfo.email}'`)
  
//         // delete bottom arrays
//         account.forEach(account => { 
//           account.organizations.forEach( async org => {
//             org.assetGroup.forEach(assetGroup => {
//               realm.delete(assetGroup)
//             })
//             org.checklists.forEach(checklist => {
//               realm.delete(checklist.questions)
//             })
//             org.buildings.forEach(building => {
//               realm.delete(building.assets)
//               })
//             })
//           })
  
//           //delete secondary arrays
//           account.forEach(account => {
//             account.organizations.forEach(org => {
//               realm.delete(org.buildings)
//               realm.delete(org.checklists)
//             })
//             realm.delete(account) // delete account
//           })
//       })
//     })
//   }catch(e){
//     console.log('delete account error: ', e)
//   }
// }

export const dbGetInfo = async(accountInfo) => {
  var organizations = []
  try{
    Realm.open(databaseOptions).then( realm => {
      realm.write(()=> {
        var acc = realm.objects('Accounts').filtered('id == $0', accountInfo.id)
        var orgs = acc[0].organizations.filtered('id = 560')
        orgs.forEach(org => organizations.push(org))
      })
      
    }).catch((e) => console.log(e))
    return organizations

  }catch(e){
    console.log('dbGetInfo error: ', e)
  }
}

export const checkDBExists = () => {
  console.log(Realm.exists(databaseOptions))
  if (Realm.exists(databaseOptions)) {
    console.log('db exists')
    return true
  }else {
    create_db()
  }
}

/**
 * create db if db does not exist 
 * usually when app is first started
 */

create_db =  () => {
   Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      realm.create(DB_NAME, {
        id: 1,
        name: "BuiltSpaceApp",
        accounts: []
      })
    })
    realm.close()
  }).catch((e)=> {console.log('create db error: ', e)})
}

/**
 * 
 * inserts an organizations data into the account
 */
export const insertOrgData = async (accountDetails, orgData) => {
  console.log("What")
  var currentDate = new Date()
  try{
    await Realm.open(databaseOptions).then(realm => {
      realm.write(()=>{
        var account = realm.objectForPrimaryKey('Accounts', accountDetails.id) //account query

        account.organizations.forEach(org => {
          if (account.organizations.filtered(`id = ${org.id}`).isEmpty()){
            // if organization is empty/does not exist, add the organization
            orgData['lastUpdated'] = currentDate
            account.organizations.push(orgData)
          } 

          if (!account.organizations.filtered(`id = ${org.id}`).isEmpty()){
            // if organization exists 
            if (org.lastUpdated == null){
              orgData['lastUpdated'] = currentDate
              realm.create('Accounts', 
              {id: accountDetails.id, organizations: [orgData]} //replaces organizations
              ,'modified') 
              // console.log('not empty: ',JSON.stringify(org,null,1))

            }else if (lastUpdated !== ''){
              var lastUpdated = new Date(org.lastUpdated)
              var addHours = lastUpdated.getHours() + 1 
              if (currentDate > lastUpdated.setHours(addHours) ){
                orgData['lastUpdated'] = currentDate
                realm.delete(account.organizations.filtered(`id = ${org.id}`))
                account.organizations.push(orgData)
                console.log('deleted and updated')
                }
            }
          } 

        })  
        return account
      })
    }).catch((e)=>{console.log('insertOrgData Error: ',e)})

  }catch(e){
    console.log('insertOrgData: ', e)
  }
}

export const insertBuildingData = async (accountDetails, organization) => {
  console.log("insertbulidingData")
  var currentDate = new Date()
  try{
    await Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        var account = realm.objectForPrimaryKey('Accounts', accountDetails.id) //account query
        var org = account.organizations.filtered(`id = ${organization.id}`)
        var building = org[0].buildings.filtered(`id = ${organization.buildings[0].id}`)
        building['lastUpdated'] = currentDate // set lastUpdated to building

        // delete building data and pushes the new building into the organization
        realm.delete(building[0].assets)
        realm.delete(building[0].spaces)
        realm.delete(building[0])
        organization.buildings[0]['lastUpdated'] = currentDate
        org[0].buildings.push(organization.buildings[0])

        console.log("insertbuildingdata end.")
      })
    })

  }catch(e){
    console.log('insertBuildingData error: ', e)
  }
}