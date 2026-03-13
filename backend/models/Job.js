const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Job = sequelize.define("Job", {

 serviceType: DataTypes.STRING,

 description: DataTypes.TEXT,

 address: DataTypes.STRING,

 city: DataTypes.STRING,

 state: DataTypes.STRING,

 date: DataTypes.DATE,

 budgetMin: DataTypes.INTEGER,

 budgetMax: DataTypes.INTEGER,

 assignedTo: DataTypes.INTEGER,

 status: {
  type: DataTypes.ENUM(
   "OPEN",
   "ASSIGNED",
   "IN_PROGRESS",
   "COMPLETED"
  ),
  defaultValue: "OPEN"
 }

});

module.exports = Job;