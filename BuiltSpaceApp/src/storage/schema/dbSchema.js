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

export const inspectionSchema = {
  name: 'inspection',
  properties: {
    id: 'date?',
    name: 'string?',
    content: {type: 'list', objectType: 'checklist'},
    buildingid: 'int?',
    orgid: 'int?',
    assetid: 'int?'
  }
}

export const inspectionChecklistSchema = {
  name: 'inspectionChecklist',
  properties: {
    demoUsername: 'string?',
    demoUserEmail: 'string?',
    date: 'date?',
    startime: 'date?',
    duratgion: 'string?',
    time: 'date?',
    fileName: 'string?',
    address: 'string?',
    generalComments: 'string?',
    flagEdit: 'string?',
    assetName: 'string?',
    category: 'string?',
    spaceId: 'string?',
    spaceName: 'string?',
    floor: 'string?',
    spaceUsage: 'string?',
    description: 'string?',
    make: 'string?',
    model: 'string?',
    serial: 'string?',
    building: 'int?', //id?
    workOrderNumber: 'string',
    checklistCategory: 'string?',
    qrcodeURL: 'string?',
    assetLocations: 'list?',
    newSpaces: 'list?',
    questions: {type: 'list', objectType: 'inspectionQuestions'},
    parentTaskId: 'int?',  
    task: 'string?', // Because there is no data in your app , leave it empty
    checklistId: 'int?',
    checklistTitle: 'string?',
    emailReport: 'string?',
    deviceGeolocation: {
        Longitude: 'string?',
        Latitude: 'string?',
        Altitude: 'string?',
        Accuracy: 'string?',
        AltitudeAccuracy: 'string?',
        Heading: 'string?',
        Speed: 'string',
        Timestamp: 'date?'
    }
  }
}

// export const inspectionQuestionSchema = {
//   name: 'inspectionQuestions',
//   properties: {
//     questionId: 'int?',
//     questionNumber: 'string?',
//     TaskTitle: questionTitle,  
//     TaskDetails: questionDetails,
//     QuestionFormat: Allformats,
//     Photos: photos, // an array of photo
//     InspectionResult: questionResponse,
//     MeasurementLabel: Measurementlabel,
//     Measurement: measurement,
//     MeasurementUnit: Measurementunit,
//     tool: 'string?',
//     supplier:,
//     unitCost:,
//     questionType:,
//     salesTax:,
//     markup:,
//     allowMultiple: 'bool?',
//     choices:,
//     textOnly:
//   }
// }

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
    spaces: {type: 'list', objectType: 'spaces'},
    // qrcodes: {type: 'list', objecType: 'qrcodes'}
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
    title: 'string?',
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
    markupformat: 'string?',
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
    showmeasurement:'bool?',
    textonly: 'bool',
    updateproperty: 'bool',
    updatepropertyfromcurrent:'bool',
    validationpattern: 'string?'
  }
}

export const qrCodeSchema = {
  name: 'qrcodes',
  properties: {
    id: 'int',
    assetid: 'int?',
    buildingid: 'int?',
    spaceid: 'int?',
    contactperson: 'string?',
    url: 'string?'
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
export const insertNewAccount = async (accountDetails, accountOrganizations, currentDate) => {
    try{
      await Realm.open(databaseOptions).then(realm => {
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


export const updateOrgs = (accountDetails, orgs, currentDate) => {
  // updates organizations after 1 hr or refreshed

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

export const updateAccount = (accountDetails, orgs, currentDate) => {
    // updates organizations after 1 hr or refreshed
  
    Realm.open(databaseOptions).then(realm => {
      realm.beginTransaction()
        var account = realm.objectForPrimaryKey(`Accounts`, accountDetails.id)
        var orgsObj = account.organizations
        var orgList = Array.from(orgsObj)
        account.lastUpdated = currentDate
        orgList.find(orgList => {
          orgs.forEach(orgs => {
            if (orgList.id == orgs.id){
              orgList.name = orgs.name
              orgList.logourl = orgs.logourl
              orgList.primaryEmail = orgs.primaryEmail
              orgList.brandingurl = orgs.brandingurl
              orgList.absoluteurl = orgs.absoluteurl
            }else{
              account.organization.push(orgs)
            }
          })
        })
        realm.commitTransaction()      
        realm.close()
  
      console.log('updated Account')
    }).catch(e => {console.log('updateOrgs: ', e)}) 
}

export const updateBuilding = async (accountDetails, organization_id, buildingAPI, currentDate) => {
  try{
    await Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        var account = realm.objectForPrimaryKey('Accounts', accountDetails.id) //account query
        var org = account.organizations.filtered(`id = ${organization_id}`)
        var building = org[0].buildings.filtered(`id = ${buildingAPI.id}`)
        // delete building data and pushes the new building into the organization
        realm.delete(building[0].assets)
        realm.delete(building[0].spaces)
        // realm.delete(building[0].qrcodes)
        
        building[0]['assets'] = buildingAPI.assets
        building[0]['spaces'] = buildingAPI.spaces
        building[0].lastUpdated = currentDate

        console.log("updatebuilding end.")  
      })
    })

  }catch(e){
    console.log('updateBuilding error: ', e)
  }
}

/**
 * 
 * check if database exists if not, create it.
 * then check if logged in account exists, if not 
 * inserts a new account with insertNewAccount()
 */
export const checkAccountExists = async (accountDetails) => {
  try{
    if (Realm.exists(databaseOptions)) {
      var realm = await Realm.open(databaseOptions).catch(e => {console.log("realm cannot open")}) //open realm to query
      var account = await realm.objectForPrimaryKey('Accounts', accountDetails.id) //account query
      realm.close()
      console.log(realm.path)
      if (account !== undefined){
        console.log('account exists fetching account orgs')
        return Promise.resolve(true)
      }

      if (account == undefined){
        console.log("no account found: ", account)
        return Promise.resolve(false)
      }
      

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
    var realm = await Realm.open(databaseOptions).catch(e => {console.log("realm cannot open")}) //open realm to query
    var account = realm.objectForPrimaryKey('Accounts', accountDetails.id) //account query
    var org = account.organizations.filtered(`id = ${organization.id}`)
    
    if (!org[0].buildings.isEmpty()){
      orgArray.push(org[0])
      return orgArray
    
      // return Promise.resolve(orgArray)
    } else {
      return Promise.resolve(false)
    }

    console.log('DBCHECKORGDATA done ')
  }catch(e){console.log('dbcheckorg: ', e)}

}

export const DBcheckBuildingData = async(accountDetails, organization, building) => {
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

// export const DBgetOrgData = async (accountDetails, organization) => {
//   var currentDate = new Date()

//   var realm = await Realm.open(databaseOptions).catch(e => {console.log('failed to open realm in getBuilding()')})
//   var account = realm.objectForPrimaryKey('Accounts', accountDetails.id) //account query
//   var org = account.organizations.filtered(`id = ${organization.id}`)
//   realm.write(() => {
//     org[0].lastLoaded = currentDate
//   })
//   return Array.from(org)
// }

// delete db for testing
// export const delete_db = async () => {
//   if (Realm.exists(databaseOptions)) {
//     try{
//       Realm.deleteFile(databaseOptions)
//       console.log("db deleted.")
//     }catch(e) {console.log('delete db',e)} 
//   }else{
//     console.log("Does not exist")
//   }
// }

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

export const checkDBExists = () => {
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
export const insertOrgData = async (accountDetails, orgData, currentDate) => {
  // inserts organization data into the account, excluding assets, qrcode, spaces
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


// export const saveToDevice = async (inspection) => {

// }