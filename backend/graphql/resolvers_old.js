const authController = require("../controllers/authController");
const { Job, Bid, User, ProviderProfile } = require("../models");

const resolvers = {

 hello: () => {
  return "KaamOnClick GraphQL running";
 },

 registerCustomer: async (args) => {
  return await authController.registerCustomer(args);
 },

 registerProvider: async (args) => {
  return await authController.registerProvider(args);
 },

 login: async (args) => {
  return await authController.login(args);
 },

 createJob: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  if (context.user.role !== "CUSTOMER") {
   throw new Error("Only customers can create jobs");
  }

  const job = await Job.create({
   serviceType: args.serviceType,
   description: args.description,
   address: args.address,
   city: args.city,
   state: args.state,
   budgetMin: args.budgetMin,
   budgetMax: args.budgetMax,
   UserId: context.user.id
  });

  return job;
 },

 jobs: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  if (context.user.role !== "PROVIDER") {
   throw new Error("Only providers can browse jobs");
  }

  // Fetch user from DB to get state (JWT only has id & role)
  const currentUser = await User.findByPk(context.user.id);
  if (!currentUser) {
   throw new Error("User not found");
  }

  const whereClause = { status: "OPEN", state: currentUser.state };
  
  if (args.serviceType) {
   whereClause.serviceType = args.serviceType;
  }

  const jobs = await Job.findAll({
   where: whereClause
  });

  return jobs;
 },

 myJobs: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  if (context.user.role !== "CUSTOMER") {
   throw new Error("Only customers can view their jobs");
  }

  const jobs = await Job.findAll({
   where: { UserId: context.user.id }
  });

  return jobs;
 },

 placeBid: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  if (context.user.role !== "PROVIDER") {
   throw new Error("Only providers can place bids");
  }

  const job = await Job.findByPk(args.jobId);
  
  if (!job) {
   throw new Error("Job not found");
  }

  if (job.status !== "OPEN") {
   throw new Error("This job is no longer accepting bids");
  }

  // Prevent duplicate bids
  const existingBid = await Bid.findOne({
   where: { JobId: args.jobId, UserId: context.user.id }
  });
  if (existingBid) {
   throw new Error("You have already placed a bid on this job");
  }

  if (args.bidPrice < job.budgetMin || args.bidPrice > job.budgetMax) {
   throw new Error(`Bid must be between ₹${job.budgetMin} and ₹${job.budgetMax}`);
  }

  const bid = await Bid.create({
   JobId: args.jobId,
   bidPrice: args.bidPrice,
   message: args.message,
   UserId: context.user.id
  });

  return bid;
 },

 bids: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  const bids = await Bid.findAll({
   where: { JobId: args.jobId },
   include: [
    {
     model: User,
     include: [ProviderProfile]
    }
   ]
  });

  return bids.map(bid => ({
   id: bid.id,
   jobId: bid.JobId,
   bidPrice: bid.bidPrice,
   message: bid.message,
   provider: {
    id: bid.User.id,
    name: bid.User.name,
    email: bid.User.email,
    phone: bid.User.phone,
    state: bid.User.state,
    profile: bid.User.ProviderProfile
   }
  }));
 },

 providerProfile: async (args, context) => {
  const user = await User.findByPk(args.userId, {
   include: [ProviderProfile]
  });

  if (!user || user.role !== "PROVIDER") {
   throw new Error("Provider not found");
  }

  // Enforce privacy: if profile is private and viewer is someone else, block access
  const isOwnProfile = context.user && String(context.user.id) === String(args.userId);
  if (!user.isPublic && !isOwnProfile) {
   throw new Error("This profile is private");
  }

  return {
   id: user.id,
   name: user.name,
   email: user.email,
   phone: user.phone,
   state: user.state,
   emailNotifications: user.emailNotifications,
   bidNotifications: user.bidNotifications,
   marketingEmails: user.marketingEmails,
   isPublic: user.isPublic,
   language: user.language,
   timezone: user.timezone,
   profile: user.ProviderProfile
  };
 },

 customerProfile: async (args, context) => {
  const user = await User.findByPk(args.userId);

  if (!user || user.role !== "CUSTOMER") {
   throw new Error("Customer not found");
  }

  // Enforce privacy: if profile is private and viewer is someone else, block access
  const isOwnProfile = context.user && String(context.user.id) === String(args.userId);
  if (!user.isPublic && !isOwnProfile) {
   throw new Error("This profile is private");
  }

  return {
   id: user.id,
   name: user.name,
   email: user.email,
   phone: user.phone,
   state: user.state,
   role: user.role,
   emailNotifications: user.emailNotifications,
   bidNotifications: user.bidNotifications,
   marketingEmails: user.marketingEmails,
   isPublic: user.isPublic,
   language: user.language,
   timezone: user.timezone
  };
 },

 selectBid: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  if (context.user.role !== "CUSTOMER") {
   throw new Error("Only customers can select bids");
  }

  const bid = await Bid.findByPk(args.bidId);

  if (!bid) {
   throw new Error("Bid not found");
  }

  const job = await Job.findByPk(bid.JobId);

  if (!job) {
   throw new Error("Job not found");
  }

  if (job.UserId !== context.user.id) {
   throw new Error("You can only select bids for your own jobs");
  }

  if (job.status !== "OPEN") {
   throw new Error("A provider has already been selected for this job");
  }

  job.status = "ASSIGNED";
  await job.save();

  bid.status = "ACCEPTED";
  await bid.save();

  // Reject all other bids for this job
  await Bid.update(
   { status: "REJECTED" },
   { where: { JobId: job.id, id: { [require('sequelize').Op.ne]: bid.id } } }
  );

  return job;
 },

 updateCustomerProfile: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  if (context.user.role !== "CUSTOMER") {
   throw new Error("Only customers can update customer profile");
  }

  const user = await User.findByPk(context.user.id);

  if (!user) {
   throw new Error("User not found");
  }

  if (args.name) user.name = args.name;
  if (args.phone) user.phone = args.phone;
  if (args.state) user.state = args.state;

  await user.save();

  return user;
 },

 updateProviderProfile: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  if (context.user.role !== "PROVIDER") {
   throw new Error("Only providers can update provider profile");
  }

  const user = await User.findByPk(context.user.id, {
   include: ["ProviderProfile"]
  });

  if (!user) {
   throw new Error("User not found");
  }

  // Update user fields
  if (args.name) user.name = args.name;
  if (args.phone) user.phone = args.phone;
  if (args.state) user.state = args.state;

  await user.save();

  // Update provider profile
  if (user.ProviderProfile) {
   if (args.city) user.ProviderProfile.city = args.city;
   if (args.services) user.ProviderProfile.services = args.services;
   if (args.experienceYears !== undefined) user.ProviderProfile.experienceYears = args.experienceYears;
   if (args.description) user.ProviderProfile.description = args.description;

   await user.ProviderProfile.save();
  }

  return user;
 },

 updateNotificationSettings: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  const user = await User.findByPk(context.user.id);

  if (!user) {
   throw new Error("User not found");
  }

  if (args.emailNotifications !== undefined) user.emailNotifications = args.emailNotifications;
  if (args.bidNotifications !== undefined) user.bidNotifications = args.bidNotifications;
  if (args.marketingEmails !== undefined) user.marketingEmails = args.marketingEmails;

  await user.save();

  return user;
 },

 updatePrivacySettings: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  const user = await User.findByPk(context.user.id);

  if (!user) {
   throw new Error("User not found");
  }

  if (args.isPublic !== undefined) user.isPublic = args.isPublic;

  await user.save();

  return user;
 },

 updatePreferences: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  const user = await User.findByPk(context.user.id);

  if (!user) {
   throw new Error("User not found");
  }

  if (args.language) user.language = args.language;
  if (args.timezone) user.timezone = args.timezone;

  await user.save();

  return user;
 },

 changePassword: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  const bcrypt = require("bcrypt");
  const user = await User.findByPk(context.user.id);

  if (!user) {
   throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await bcrypt.compare(args.currentPassword, user.password);
  
  if (!isMatch) {
   throw new Error("Current password is incorrect");
  }

  // Hash and save new password
  const hashedPassword = await bcrypt.hash(args.newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  return user;
 },

 myBids: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  if (context.user.role !== "PROVIDER") {
   throw new Error("Only providers can view their bids");
  }

  const bids = await Bid.findAll({
   where: { UserId: context.user.id },
   include: [{ model: Job }],
   order: [["createdAt", "DESC"]]
  });

  return bids.map(bid => ({
   id: bid.id,
   jobId: bid.JobId,
   bidPrice: bid.bidPrice,
   message: bid.message,
   status: bid.status,
   job: bid.Job
  }));
 },

 dashboardStats: async (args, context) => {
  if (!context.user) {
   throw new Error("Authentication required");
  }

  if (context.user.role === "CUSTOMER") {
   const jobs = await Job.findAll({ where: { UserId: context.user.id } });
   const jobIds = jobs.map(j => j.id);

   const totalBids = jobIds.length > 0
    ? await Bid.count({ where: { JobId: jobIds } })
    : 0;
   const pendingBids = jobIds.length > 0
    ? await Bid.count({ where: { JobId: jobIds, status: "PENDING" } })
    : 0;

   return {
    totalJobs: jobs.length,
    openJobs: jobs.filter(j => j.status === "OPEN").length,
    assignedJobs: jobs.filter(j => j.status === "ASSIGNED" || j.status === "IN_PROGRESS").length,
    completedJobs: jobs.filter(j => j.status === "COMPLETED").length,
    totalBids,
    pendingBids,
    acceptedBids: 0,
    recentJobs: jobs.slice(0, 5),
    recentBids: []
   };
  } else {
   // PROVIDER
   const bids = await Bid.findAll({
    where: { UserId: context.user.id },
    include: [{ model: Job }],
    order: [["createdAt", "DESC"]]
   });

   return {
    totalJobs: 0,
    openJobs: 0,
    assignedJobs: bids.filter(b => b.status === "ACCEPTED").length,
    completedJobs: 0,
    totalBids: bids.length,
    pendingBids: bids.filter(b => b.status === "PENDING").length,
    acceptedBids: bids.filter(b => b.status === "ACCEPTED").length,
    recentJobs: [],
    recentBids: bids.slice(0, 5).map(bid => ({
     id: bid.id,
     jobId: bid.JobId,
     bidPrice: bid.bidPrice,
     message: bid.message,
     status: bid.status,
     job: bid.Job
    }))
   };
  }
 }

};

module.exports = resolvers;