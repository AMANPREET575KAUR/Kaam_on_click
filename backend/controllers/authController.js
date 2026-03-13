const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User, ProviderProfile } = require("../models");

exports.registerCustomer = async ({ name, email, password, phone, state }) => {

 const existingUser = await User.findOne({ where: { email, role: "CUSTOMER" } });

 if (existingUser) {
  throw new Error("User already exists");
 }

 const hashedPassword = await bcrypt.hash(password, 10);

 const user = await User.create({
  name,
  email,
  password: hashedPassword,
  phone,
  state,
  role: "CUSTOMER"
 });

 return user;

};


exports.registerProvider = async ({
 name,
 email,
 password,
 phone,
 state,
 city,
 services,
 experienceYears,
 description
}) => {

 const existingUser = await User.findOne({ where: { email, role: "PROVIDER" } });

 if (existingUser) {
  throw new Error("User already exists");
 }

 const hashedPassword = await bcrypt.hash(password, 10);

 const user = await User.create({
  name,
  email,
  password: hashedPassword,
  phone,
  state,
  role: "PROVIDER"
 });

 await ProviderProfile.create({
  UserId: user.id,
  services,
  experienceYears,
  description,
  city
 });

 return user;

};


exports.login = async ({ email, password, role }) => {

 const normalizedRole = (role || "").trim().toUpperCase();

 if (!normalizedRole) {
  throw new Error("Please choose login type (CUSTOMER or PROVIDER)");
 }

 if (!["CUSTOMER", "PROVIDER"].includes(normalizedRole)) {
  throw new Error("Invalid login type. Use CUSTOMER or PROVIDER");
 }

 const user = await User.findOne({ where: { email, role: normalizedRole } });

 if (!user) {
  throw new Error("User not found for selected role. Register this role first.");
 }

 const validPassword = await bcrypt.compare(password, user.password);

 if (!validPassword) {
  throw new Error("Invalid password");
 }

 const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
 );

 return {
  token,
  user
 };

};