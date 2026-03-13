const sequelize = require("../config/db");

const User = require("./User");
const ProviderProfile = require("./ProviderProfile");
const Job = require("./Job");
const Bid = require("./Bid");
const Review = require("./Review");

User.hasOne(ProviderProfile);
ProviderProfile.belongsTo(User);

User.hasMany(Job);
Job.belongsTo(User);

Job.hasMany(Bid);
Bid.belongsTo(Job);

User.hasMany(Bid);
Bid.belongsTo(User);

// Review associations
Review.belongsTo(Job);
Job.hasOne(Review);
Review.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewerId' });
Review.belongsTo(User, { as: 'provider', foreignKey: 'providerId' });

module.exports = {
 sequelize,
 User,
 ProviderProfile,
 Job,
 Bid,
 Review
};