module.exports = (sequelize, Sequelize) => {
    const CandidateDetails = sequelize.define("candidateRecords", {
          candidate_id :{
          type:Sequelize.BIGINT,
          field:'candidate_id',
          primaryKey: true,
          autoIncrement: true,
          unique:true
          },
      Name: {
        type: Sequelize.STRING       
      },
      Designation: {
        type: Sequelize.STRING
      },
      Company_Name: {
        type: Sequelize.STRING
      },
      Experience: {
        type: Sequelize.BIGINT
      },  
      CTC_currency: {
        type: Sequelize.STRING
      },
      CTC: {
        type: Sequelize.FLOAT
      }, 
      CTC_Type: {
        type: Sequelize.STRING
      },
      Email_ID: {
        type: Sequelize.STRING
      },
      Contact_Number: {
        type: Sequelize.BIGINT
      },
      LinkedIn_Link: {
        type: Sequelize.STRING
      },
      Location: {
        type: Sequelize.STRING
      }
    });
  
    return CandidateDetails;
  };