import {insertNewAccount, updateAccount, delete_db, get_account} from './schema/dbSchema'

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
    const currentDate = new Date()
    const year = await currentDate.getFullYear()
    const month = await currentDate.getMonth()
    const day = await currentDate.getDay()
    const hour = await currentDate.getHours()
    const min = await currentDate.getMinutes()
    const formatDate = `${year}/${month}/${day}, ${hour}:${min}`
    try{
        await fetch(`${url}/_vti_bin/wcf/userdata.svc/MyOrganizations`, header,
        )
          .then(response => response.json())
          .then(results => {
            // this.setState({api_organization: results});
            for (var i = 0; i < results.length; i++) {
             api_organization.push({
                absoluteurl: results[i].absoluteurl,
                brandingurl: results[i].brandingurl,
                id: results[i].id,
                logourl: results[i].logourl,
                name: results[i].name,
                primaryEmail: results[i].primaryemail,
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
        await get_buildings();
        await get_assetGroup();
        await get_checklists();
        await get_questions();
        await get_assets();
        // await get_spaces();
        // await get_qrcodes();
    }catch(e) {
        console.log(e)
    }
  };

  get_buildings = async () => {
    for (var i = 0; i < api_organization.length; i++) { // loop 1
      let org = await api_organization[i].name.replace(' ', '');
      await fetch(
        `${url}/sites/${org}/_vti_bin/wcf/orgdata.svc/buildings`, header
      )
        .then(response => response.json())
        .then(results => {
          for (var b = 0; b < results.length; b++) { //loop 2
            api_organization[i].buildings.push(results[b]);
          }
        })
        .catch(e => console.log(e));
    }
  };

  get_assetGroup = async () => {
    for (var i = 0; i < api_organization.length; i++) { //loop 1
      let org = await api_organization[i].name.replace(' ', '');
      await fetch(
        `${url}/sites/${org}/_vti_bin/wcf/orgdata.svc/assetgroups`, header
      )
        .then(response => response.json())
        .then(results => {
          for (var b = 0; b < results.length; b++) { // loop 2
            api_organization[i].assetGroup.push(results[b]);
          }
        });
    }
  };

  get_checklists = async () => {
    for (var i = 0; i < api_organization.length; i++) { // loop 1
      let org = await api_organization[i].name.replace(' ', '');
      await fetch(
        `${url}/sites/${org}/_vti_bin/wcf/orgdata.svc/procedures`, header
      )
        .then(response => response.json())
        .then(results => {
          for (var b = 0; b < results.length; b++) { //loop 2
            let checklist = results[b];
            checklist['questions'] = [];
            api_organization[i].checklists.push(checklist);
          }
        });
    }
  };

  get_questions = async () => {
    for (var i = 0; i < api_organization.length; i++) { //loop 1
      let org = await api_organization[i].name.replace(' ', '');
      await fetch(
        `${url}/sites/${org}/_vti_bin/wcf/orgdata.svc/procedures/questions`, header
      )
        .then(response => response.json())
        .then(results => {
          for (var b = 0; b < results.length; b++) { //loop 2
            // loops over the list of questions
            for (var index = 0;index < api_organization[i].checklists.length;index++) { // loop 3
              /**
               * Loops over each organizations checklist
              **/ 
              if (results[b].checklistid == api_organization[i].checklists[index].id) { //if statment
              /**
               * compares the results question.checklistid to organization checklist id 
               * if the id's match, the question is added into a questions list for the checklist id
               **/
                api_organization[i].checklists[index].questions.push(results[b]);
              }
            }

          }
        });
    }
  };

  get_assets = async() => {

    /**  
     * loop each organizations, assetGroup and each building
     * if asset.buildingid matches the building.id, 
     * add the asset into building.assets[]
     */
    for (var i = 0; i < api_organization.length; i++) { //loop 1
      // Loops each organizations
      let org_name = api_organization[i].name.replace(' ', '');
      let org = api_organization[i]
      for (var assetGroup_index = 0; assetGroup_index < org.assetGroup.length; assetGroup_index++){ //loop 2
        let assetgroupid = org.assetGroup[assetGroup_index].id
        for (var build_index = 0 ; build_index < org.buildings.length; build_index++){ // loop 3
          let Buildingid = org.buildings[build_index].id
          org.buildings[build_index]['assets'] = [] //create the assets[] list in each building
          await fetch(
            `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/Assets?AssetGroupId=${assetgroupid}&BuildingId=${Buildingid}`, header
          )
            .then(response => response.json())
            .then(results => {
              results.forEach(asset => { // loop 4
                if (asset.buildingid == org.buildings[build_index].id){ // if statement
                  org.buildings[build_index].assets.push(asset)
                }
              })
            })
            .catch(e => console.log(e));
        }
      }
      
    }
  };