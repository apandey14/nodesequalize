const db = require("../../models");
const CandidateDetails = db.candidateRecords;

const isEmpty = require("is-empty");
const readXlsxFile = require("read-excel-file/node");
var validator = require("email-validator");
const excel = require("exceljs");

const validatedat = function validateDatatype(data) {
  let errors = {};

  data.Email_ID = !isEmpty(data.Email_ID) ? data.Email_ID : "";
 
 if(isEmpty(data.Email_ID)){
   errors.Email_ID ="Email is required";
 }else if(!validator.isEmailValid(data.Email_ID)){
  errors.Email_ID ="Email is invalid";
 }

 if(isEmpty(data.Name)){
  errors.Name ="Name is required";
}
if(isEmpty(data.Contact_Number)){
  errors.Contact_Number ="Contact number is required";
}

 return {
  errors,
  isValid: isEmpty(errors),
};
};


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

        if(ListData[i]['CTC_currency']=='INR' && ListData[i]['CTC_Type'] == 'Thousands' || ListData[i]['CTC_Type'] == 'Millions')
        {
            res.json({ message: "Currency Type should be LAKHS or CRORES for INR" });
    
        }
      else if(ListData[i]['CTC_currency']=='USD' && ListData[i]['CTC_Type'] == 'LAKHS' || ListData[i]['CTC_Type'] == 'CRORES')
        {
            res.json({ message: "Currency Type should be Thousand or Millions for USD" });
    
        }
      else if(ListData[i]['CTC_currency']=='EUR' && ListData[i]['CTC_Type'] == 'LAKHS' || ListData[i]['CTC_Type'] == 'CRORES')
        {
            res.json({ message: "Currency Type should be Thousand or Millions for EUR" });
    
        }else{
     

        const {valid} = validator.validate(ListData[i].Email_ID);
          if(!valid) {
            invalidRow.push(ListData[i]);
          } else {
          let isValid = validateDatatype(ListData[i]);
          if(!isValid){
            invalidRow.push(ListData[i]);
          } else {
              let dbData = CandidateDetails.getRecords(ListData[i].Name, ListData[i].Email_ID, ListData[i].Contact_Number);
              if(dbData && dbData.length > 0) {
                getDuplicateRow.push(ListData[i]);
              } else {


                let rowdata = {                  
                  Name: ListData[i].Name,
                  Designation: ListData[i].Designation,
                  Company_Name:ListData[i].Company_Name,
                  Experience: ListData[i].Experience,
                  CTC_currency: ListData[i].CTC_currency,
                  CTC: ListData[i].CTC,
                  CTC_Type: ListData[i].CTC_Type,
                  Email_ID: ListData[i].Email_ID,
                  Contact_Number: ListData[i].Contact_Number,
                  LinkedIn_Link: ListData[i].Contact_Number,
                  Location: ListData[i].Location
                };
        
                let insertedResult = CandidateDetails.push(rowdata);
                SuccessRow.push(insertedResult);

              }
          }      
          }        
  
      }  
      var getResponse = {
          //"invalidRow": invalidRow,
          "SuccessRow": SuccessRow,
          //"getDuplicateRow": getDuplicateRow
      }
         res.status(200).send({
        message: "successfully Uploaded Candidate List: " + req.file.originalname
      });
    }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
  
};

module.exports = {
  validatedat,
  upload
};
