const db = require("../../models");
const Tutorial = db.candidate_summary;

const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");

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
//console.log(rows);

for (let i = 0; i < rows.length; i++) {
    
        if(rows[i]['CTC_currency']=='INR' && rows[i]['CTC_Type'] == 'Thousands' || rows[i]['CTC_Type'] == 'Millions')
        {
            res.json({ message: "Currency Type should be LAKHS or CRORES for INR" });

        }
        else if(rows[i]['CTC_currency']=='USD' && rows[i]['CTC_Type'] == 'LAKHS' || rows[i]['CTC_Type'] == 'CRORES')
        {
            res.json({ message: "Currency Type should be Thousand or Millions for USD" });

        }
        else if(rows[i]['CTC_currency']=='EUR' && rows[i]['CTC_Type'] == 'LAKHS' || rows[i]['CTC_Type'] == 'CRORES')
        {
            res.json({ message: "Currency Type should be Thousand or Millions for EUR" });

        }else{
      


      let candidate_summary = [];

      rows.forEach((row) => {
       /* let tutorial = {         
          Name: row[0],
          Designation: row[1],
          WorkExperience: {ctc: {value:row[5], ctcUnit:row[6], ctcCurrency: row[4]}, candidateExperience:row[3], company: {name: row[2]}, Location: {City: row[10]}, linkedIn: row[9]},     
          Email_ID: row[7],
          Contact_Number: row[8]
         
         
        };*/

        let tutorial = {         
          Name: row[0],
          Designation: row[1],
          Company_Name: row[2],
          Experience: row[3],
          CTC_currency: row[4],
          CTC: row[5],
          CTC_Type: row[6],
          Email_ID: row[7],
          Contact_Number: row[8],
          LinkedIn_Link: row[9],
          Location: row[10]
        };

        candidate_summary.push(tutorial);
      });

      Tutorial.bulkCreate(candidate_summary)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
            data:rows
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
        });
    }
    }
});
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
  
};

const getSummarry = (req, res) => {
  Tutorial.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Summarry.",
      });
    });
};

const download = (req, res) => {
  Tutorial.findAll().then((objs) => {
    let candidate_summary = [];

    objs.forEach((obj) => {
        candidate_summary.push({       
        Name: obj.Name,
        Designation: obj.Designation,
        Company_Name: obj.Company_Name,
        Experience: obj.Experience,
        CTC_currency: obj.CTC_currency,
        CTC: obj.CTC,
        CTC_Type: obj.CTC_Type,
        Email_ID: obj.Email_ID,
        Contact_Number: obj.Contact_Number,
        LinkedIn_Link: obj.LinkedIn_Link,
        Location: obj.Location,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");

    worksheet.columns = [
      { header: "Name", key: "Name", width: 25 },
      { header: "Designation", key: "Designation", width: 25 },
      { header: "Company Name", key: "Company_Name", width: 10 },
      { header: "Experience(Years)", key: "Experience", width: 10 },
      { header: "CTC currency", key: "CTC_currency", width: 10 },
      { header: "CTC", key: "CTC", width: 10 },
      { header: "CTC Type", key: "CTC_Type", width: 10 },
      { header: "Email ID", key: "Email_ID", width: 10 },
      { header: "Contact Number", key: "Contact_Number", width: 10 },
      { header: "LinkedIn Link", key: "LinkedIn_Link", width: 10 },
      { header: "Location", key: "Location", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(candidate_summary);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "candidate-upload-template.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

module.exports = {
  upload,
  getSummarry,
  download,
};
