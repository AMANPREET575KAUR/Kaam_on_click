const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Bid = sequelize.define("Bid", {

 bidPrice: DataTypes.INTEGER,

 message: DataTypes.TEXT,

 estimatedTime: DataTypes.STRING,

 status: {
  type: DataTypes.ENUM(
   "PENDING",
   "ACCEPTED",
   "REJECTED",
   "CANCELLED"
  ),
  defaultValue: "PENDING"
 }

});

module.exports = Bid;