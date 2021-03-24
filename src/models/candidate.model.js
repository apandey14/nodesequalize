module.exports = (sequelize, Sequelize) => {
    const Summary = sequelize.define("candidate_summary", {
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            min: 4,
        },
        unique: {
          args: 'Name',
          msg: 'The Name is already taken!'
       }
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
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
            isEmail: true
        },
        unique: {
           args: 'email',
           msg: 'The email is already taken!'
        }

      },
      Contact_Number: {
        type: Sequelize.BIGINT,
        allowNull: false,
        notEmpty: true,
        unique: {
          args: 'phone',
          msg: 'The phone is already taken!'
       }

      },
      LinkedIn_Link: {
        type: Sequelize.STRING
      },
      Location: {
        type: Sequelize.STRING
      }
    });
  
    return Summary;
  };