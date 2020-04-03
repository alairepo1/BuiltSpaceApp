import {findQR} from '../storage/schema/dbSchema'

function getStartTime() {
  console.log('start');
  var date = new Date();
  var timeOffset = date.getTimezoneOffset() / 60;
  var localDate = new Date(date.getTime() - timeOffset * 3600 * 1000);
  return localDate.toISOString();
}

function calculateDurationInspection(starttime, endtime) {
  var duration = (
    (Date.parse(endtime) - Date.parse(starttime)) /
    (1000 * 60)
  ).toFixed(2);
  return duration;
}

function formatInspectionObject(building, asset, orgData, startDate, generalComments,checklistId,checklistTitle, questions, spaceSelected = false, selectedSpaceId, spaces = []) {
  const date = new Date();
  const dateString = date.toISOString().split('T')[0];
  const time = date.getTime();
  const duration = calculateDurationInspection(startDate, date);
  const _filename =
    dateString + '-' + building.name.split(' ').join('-') + '-' + asset.name;
  //inspection for a space
  // _filename = isoDateString + "-" + buildingname + "-" + assetProperty.spacename;
  //inspection for an asset
  try {
    var checklist = {
      MyFields: {
        DemoUserName: 'demousername', // if the user comes fropm the button "try it out"
        DemoUserEmail: 'demouseremail', // if the user comes fropm the button "try it out"
        Date: dateString,
        StartTime: startDate,
        Duration: duration, //convert to string?
        Time: time,
        FileName: _filename,
        Address: building.address,
        GeneralComments: generalComments || '',
        flagedit: 'fl_edit', // flagedit not implemented
        Assetname: asset.name,
        Category: asset.categoryabbr,
        SpaceId: null, // if space is selected, space.id
        SpaceName: '', //if space is selected, space.suitenumber
        Floor: '', // if space is selected, space.floor
        SpaceUsage: '', //if space selected, space.usage
        Description: asset.description,
        Make: asset.make,
        Model: asset.model,
        Serial: asset.serial,
        Building: asset.buildingId,
        WorkOrderNumber: 'WorkOrderNumber', // WorOrderNumber not implemented
        ChecklistCategory: 'ChecklistCategory',
        QRcodeURL: 'qrcodeMapping',
        AssetLocations: {
          AssetLocation: 'allspaces',
        },
        NewSpaces: {
          Spaces: [],
        },
        Questions: {
          Question: [], // an array of questions
        },
        ParentTaskId: '', // Because there is no data in your app , leave it empty
        Task: '', // Because there is no data in your app , leave it empty
        ChecklistId: checklistId, //checklist.id
        ChecklistTitle: checklistTitle,
        EmailReport: '', // email report not implemented
        DeviceGeolocation: {
          // Geolocation not implemented
          Longitude: '',
          Latitude: '',
          Altitude: '',
          Accuracy: '',
          AltitudeAccuracy: '',
          Heading: '',
          Speed: '',
          Timestamp: dateString,
        },
      },
    };

    if (spaceSelected) {
      const space = spaces.filter(
        space => space.id == selectedSpaceId,
      );
      checklist.MyFields.SpaceId = space[0].id;
      checklist.MyFields.SpaceName = space[0].suitenumber; //if space is selected, space.name
      checklist.MyFields.Floor = space[0].floor; // if space is selected, space.floor
      checklist.MyFields.SpaceUsage = space[0].usage; //if space selected, space.usage
    }

    questions.forEach(question => {
      var formatQuestion = {
        QuestionId: question.id,
        QuestionNumber: question.number,
        TaskTitle: question.question,
        TaskDetails: question.TaskDetails || '',
        QuestionFormat: question.format,
        Photos: 'photos', // an array of photo
        InspectionResult: question.InspectionResults || '',
        MeasurementLabel: question.Measurementlabel || '',
        Measurement: question.measurement || '',
        MeasurementUnit: question.Measurementunit || '',
        Tool: '', // not implemented yet
        Supplier: '', // not implemented yet
        UnitCost: question.UnitCost || '',
        QuestionType: question.questiontype || '',
        SalesTax: question.salexaxformat || '',
        Markup: '', // not implemented yet
        AllowMultiple: question.allowmultiplechoices,
        Choices: '', // not implemented yet
        TextOnly: question.TextOnlyForm || '',
      };
      checklist.MyFields.Questions.Question.push(formatQuestion);
    });

    var checklistObject = {
      Id: dateString,
      Name: _filename,
      Content: checklist,
      buildingId: building.id,
      orgId: orgData.id,
      AssetId: asset.id,
    };

    return checklistObject

  } catch (e) {
    console.log(e);
  }
}

function formatAddQuestion(type,questions,checklistTitle,checklistId) {
    try{

        if (type == "labour"){
            let labourQuestion = {
              "allowmultiplechoices": false,
              "checklistid": checklistId,
              "checklisttitle": checklistTitle,
              "colorformat": "#98d9ea|#00a2e8|#3366cc|#232b85",
              "displayproperty": false,
              "format": "Regular|Overtime|Double Time|Other",
              "id": 0,
              "markupformat": "",
              "measurementlabel": "Labour",
              "measurementonly": false,
              "measurementunit": "Hours",
              "number": "",
              "propertygroup": "",
              "propertyname": "",
              "question": "Enter hours",
              "questiontype": "Labour",
              "remarks": "",
              "salestaxformat": "",
              "showmeasurement": true,
              "textonly": false,
              "updateproperty": false,
              "updatepropertyfromcurrent": false,
              "validationpattern": ""
          }
            questions.push(labourQuestion)
          }
        if (type == "materials"){
    
          let materialQuestion = {
              "allowmultiplechoices": false,
              "checklistid": checklistId,
              "checklisttitle": checklistTitle,
              "colorformat": "#98d9ea|#00a2e8|#3366cc|#232b85|#151a51",
              "displayproperty": false,
              "format": "PO|Tools|Truck Stock|3rd Party|Other",
              "id": 0,
              "markupformat": "||||",
              "measurementlabel": "Quantity",
              "measurementonly": false,
              "measurementunit": "",
              "number": "",
              "propertygroup": "",
              "propertyname": "",
              "question": "Enter Materials",
              "questiontype": "Materials",
              "remarks": "",
              "salestaxformat": "||||",
              "showmeasurement": true,
              "textonly": false,
              "updateproperty": false,
              "updatepropertyfromcurrent": false,
              "validationpattern": ""
          }
          questions.push(materialQuestion)
        }
        if (type == "issue"){
          let issueQuestion = {
            "allowmultiplechoices": false,
            "checklistid": checklistId,
            "checklisttitle": checklistTitle,
            "colorformat": "#00cc66|#00a2e8|#ff0000|#FFD700",
            "displayproperty": false,
            "format": "Good|Reparied|Quote|Monitor",
            "id": 0,
            "markupformat": "",
            "measurementlabel": "",
            "measurementonly": false,
            "measurementunit": "",
            "number": "",
            "propertygroup": "",
            "propertyname": "",
            "question": "Issue found",
            "questiontype": "",
            "remarks": "",
            "salestaxformat": "",
            "showmeasurement": false,
            "textonly": false,
            "updateproperty": false,
            "updatepropertyfromcurrent": false,
            "validationpattern": ""
          }
          questions.push(issueQuestion)
        }
        return questions
    }catch(e){console.log(e)}
}

function loadQRMapping(qrcodes, _qrcodeurl) { 
  var index = _qrcodeurl.lastIndexOf("/");
  var qrcodeurl = _qrcodeurl.substring(index + 1);  
  for (var i = 0; i < qrcodes.length; i += 1) {
    const qr = qrcodes[i];
    if (qr.url == qrcodeurl) {
      return qr
    }else{
      return false
    }
  }
}

export {
    getStartTime, 
    calculateDurationInspection, 
    formatInspectionObject, 
    formatAddQuestion,
    loadQRMapping
};
