const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProviderProfile = sequelize.define("ProviderProfile", {

 services: {
  type: DataTypes.STRING
 },

 experienceYears: {
  type: DataTypes.INTEGER
 },

 description: {
  type: DataTypes.TEXT
 },

 city: {
  type: DataTypes.STRING
 },

 rating: {
  type: DataTypes.FLOAT,
  defaultValue: 0
 },

 totalReviews: {
  type: DataTypes.INTEGER,
  defaultValue: 0
 },

 profilePicture: {
  type: DataTypes.TEXT("long")
 }

});

module.exports = ProviderProfile;