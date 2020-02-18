import {insertNewAccount, updateAccount, devare_db, get_account} from './schema/dbSchema'

/**
 * Fetches all organization from api
 * Fetches organizations,assetGroups,checklists and questions
 */

const url = 'https://beta.builtspace.com'
var account = {}
const api_organization = []
const header = {
    method: 'get',
    headers: {
      Authorization: '',
    }
}

export const trigger_new_account = async (accountData) => {
    account = accountData
    header.headers = {Authorization: accountData.key}
    await fetchAPI()
    return api_organization
}

fetchAPI = async () => {
    /**
     * Initial api call to fetch account's oragnizations
     */
    var currentDate = new Date()
    var formatDate = JSON.stringify(currentDate)
    try{
        await fetch(`${url}/_vti_bin/wcf/userdata.svc/MyOrganizations`, header,
        )
          .then(response => response.json())
          .then(result => {
            // this.setState({api_organization: results});
            for (var i = 0; i < result.length; i++) {
             api_organization.push({
                absoluteurl: result[i].absoluteurl,
                brandingurl: result[i].brandingurl,
                id: result[i].id,
                logourl: result[i].logourl,
                name: result[i].name,
                primaryEmail: result[i].primaryemail,
                lastLoaded: formatDate,
                buildings: [],
                assetGroup: [],
                checklists: [],
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
    }catch(e) {
        console.log(e)
    }
  };

  export const get_org_data = async (org_info) => {
    var org_name = await org_info.name.replace(' ', '');
    var org_data = org_info
    var buildings = await get_buildings(org_name)
    var assetGroups = await get_assetGroup(org_name)
    var checklists = await get_checklists(org_name)
    org_data.buildings = buildings
    org_data.assetGroup = assetGroups
    org_data.checklists = checklists
    return org_data
  }

  get_buildings = async (org_name) => {
    // gets building data from an organization api
    var buildings = []
    await fetch(
      `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/buildings`, header
    )
      .then(response => response.json())
      .then(result => {
        buildings = result
            })
      .catch(e => console.log(e));
    return buildings
  };

  get_assetGroup = async (org_name) => {
    // gets assetGroups from organization api
    var assetGroup = []
      await fetch(
        `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/assetgroups`, header
      )
        .then(response => response.json())
        .then(result => {
          assetGroup = result
        });
    return assetGroup
  };

  get_checklists = async (org_name) => {
    // Gets checklists and question from an organization
    var checklists = []
      await fetch(
        `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/procedures`, header
      )
        .then(response => response.json())
        .then(result => {
          for (var b = 0; b < result.length; b++) { 
            var checklist = result[b];
            checklist['questions'] = [];
            checklists.push(checklist);
          }
        });
    var questions = await get_questions(checklists, org_name)

    return questions
  };

  get_questions = async (checklist,org_name) => {
    // gets questions from organization
    var checklists = checklist
      await fetch(
        `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/procedures/questions`, header
      )
        .then(response => response.json())
        .then(result => {
          for (var b = 0; b < result.length; b++) { //loop 1
            // loops over the list of questions
            for (var index = 0;index < checklists.length;index++) { // loop 2
              /**
               * Loops over each organizations checklist
              **/ 
              if (result[b].checklistid == checklists[index].id) { //if statment
              /**
               * compares the results question.checklistid to organization checklist id 
               * if the id's match, the question is added into a questions list for the checklist id
               **/
                checklists[index].questions.push(result[b]);
              }
            }
          }
        });
        return checklists
  };

  export const get_building_data = async(org_info, building) => {
    // gets building data from api's 
    var org_name = await org_info.name.replace(' ', '');
    var buildingInfo = await building
    var assetGroupList = await org_info.assetGroup
    var assets = await get_assets(org_name, assetGroupList, buildingInfo)
    var spaces = await get_spaces(org_name,buildingInfo)
    org_info.buildings['assets'] = assets
    org_info.buildings['spaces'] = spaces
    console.log(JSON.stringify(org_info,null,1))
  }

  get_assets = async(org_name, assetGroupList, buildingInfo) => {
    /**  
     * loop each assetGroup then checks 
     * if asset.buildingid matches the building.id, 
     * adds the asset into building.assets[]
     */
    var building = buildingInfo
    var Buildingid = buildingInfo.id
    var assets = []
    for (var assetGroup_index = 0; assetGroup_index < assetGroupList.length; assetGroup_index++){ //loop 2
      var assetgroupid = assetGroupList[assetGroup_index].id
      await fetch(
        `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/Assets?AssetGroupId=${assetgroupid}&BuildingId=${Buildingid}`, header
      )
        .then(response => response.json())
        .then(result => {
          result.forEach(asset => { // loop 4
            if (asset.buildingid == building.id){ // if statement
              assets.push(asset)
            }
          })
        })
        .catch(e => console.log(e));
    }
    return assets
  };

  get_spaces = async(org_name, buildingInfo) =>{
    // takes organization name and building info as arguments
    // gets all spaces from a building id
    var building = buildingInfo
    var Buildingid = building.id
    var spaces = []
    await fetch(
      `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/v2/spaces?buildingId=${Buildingid}`, header
    )
      .then(response => response.json())
      .then(result => {
        spaces = result
      })
      .catch(e => console.log(e));
      return spaces
  }