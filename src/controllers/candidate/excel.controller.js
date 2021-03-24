const db = require("../../models");
const CandidateDetails = db.candidateRecords;
const validator = require("email-validator");
const isvalid = require('isvalid');
const readXlsxFile = require("read-excel-file/node");
const { check, validationResult } = require('express-validator/check');
const excel = require("exceljs");

function validateDatatype(data) {
  let curList = ["INR", "USD", "EUR"];
  let inrUnits = ["LAKHS","CRORES"];
  let usdUnits = ["THOUSANDS", "MILLIONS"];

  let isValid = true;
  if(data.Name == null || data.Name == undefined) {
      isValid = false;
  } else if(data.Email_ID == null || data.Email_ID == undefined) {
      isValid = false;
  } else if(data.Contact_Number == null || data.Contact_Number == undefined) {
      isValid = false;
  } else if(data.created_by == null || data.created_by == undefined) {
      isValid = false;
  } else if(isNaN(data.candidates_data.ctc.value) || isNaN(data.candidates_data.candidateExperience)) {
      isValid = false;
  } else if(!curList.includes(data.candidates_data.ctc.ctcCurrency)) {
      isValid = false;
  } else if((data.candidates_data.ctc.ctcCurrency == 'INR' && !inrUnits.includes(data.candidates_data.ctc.ctcUnit))) {
      isValid = false;
  } else if(((data.candidates_data.ctc.ctcCurrency == 'USD' || data.candidates_data.ctc.ctcCurrency == 'EUR') && !usdUnits.includes(data.candidates_data.ctc.ctcUnit))) {
      isValid = false;
  }
  return isValid;
}


const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir + "/uploads/" + req.file.filename;
      readXlsxFile(path).then((rows) => {

 // skip header
        rows.shift();

      var ListData = rows;
      var getDuplicateRow = [];
      var invalidRow = [];
      var SuccessRow = [];

      for(let i=0; i<ListData.length; i++){


        const {valid, reason, validators} = isEmailValid(ListData[i].Email_ID);
          if(!valid) {
            invalidRow.push(ListData[i]);
          } else {
          let isValid = validateDatatype(ListData[i]);
          if(!isValid){
            invalidRow.push(ListData[i]);
          } else {
              let dbData = candidateRecords.getRecords(ListData[i].Name, ListData[i].Email_ID, ListData[i].Contact_Number);
              if(dbData && dbData.length > 0) {
                getDuplicateRow.push(ListData[i]);
              } else {
              let insertedResult = candidateRecords.insertData(ListData[i]);
              SuccessRow.findAll(insertedResult);
              }
          }      
          }
      }  
      var getResponse = {
          "invalidRow": invalidRow,
          "SuccessRow": SuccessRow,
          "getDuplicateRow": getDuplicateRow
      }
      //util.setSuccess(200, 'Candidate list is uploaded successfully.', responseData);
      //return util.send(res);

      res.status(200).send({
        message: "successfully Uploaded Candidate List: " + req.file.originalname,
        data:getResponse
      });

    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
  
};



module.exports = {
  upload
};
