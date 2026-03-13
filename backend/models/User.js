const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {

 name: {
  type: DataTypes.STRING,
  allowNull: false
 },

 email: {
  type: DataTypes.STRING,
    allowNull: false
 },

 password: {
  type: DataTypes.STRING
 },

 role: {
  type: DataTypes.ENUM("CUSTOMER", "PROVIDER")
 },

 state: {
  type: DataTypes.STRING
 },

 phone: {
  type: DataTypes.STRING
 },

 // Customer-specific address fields
 address: {
  type: DataTypes.STRING
 },

 houseNumber: {
  type: DataTypes.STRING
 },

 city: {
  type: DataTypes.STRING
 },

 // Profile completion flag
 profileCompleted: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
 },

 // Notification preferences
 emailNotifications: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
 },

 bidNotifications: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
 },

 marketingEmails: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
 },

 // Provider-specific: new job alerts
 newJobAlerts: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
 },

 // Privacy settings
 isPublic: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
 },

 // Preferences
 language: {
  type: DataTypes.STRING,
  defaultValue: 'English'
 },

 timezone: {
  type: DataTypes.STRING,
  defaultValue: 'UTC+5:30 (India Standard Time)'
 }
}, {
 indexes: [
  {
   unique: true,
   fields: ["email", "role"]
  }
 ]
});

module.exports = User;