const authController = require("../controllers/authController");
const { Job, Bid, User, ProviderProfile, Review } = require("../models");
const { Op } = require("sequelize");

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

 resetPassword: async (args) => {
  const bcrypt = require("bcrypt");
  const email = (args.email || "").trim().toLowerCase();
  const role = (args.role || "").trim().toUpperCase();
  const newPassword = args.newPassword || "";

  if (!email || !role || !newPassword) {
   throw new Error("Email, role, and new password are required");
  }

  if (!["CUSTOMER", "PROVIDER"].includes(role)) {
   throw new Error("Invalid role. Use CUSTOMER or PROVIDER");
  }

  if (newPassword.length < 6) {
   throw new Error("Password must be at least 6 characters long");
  }

  const user = await User.findOne({ where: { email, role } });
  if (!user) {
   throw new Error("No account found with this email and role");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return user;
 },

 // ─── Profile Completion ──────────────────────────────────────

 completeCustomerProfile: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "CUSTOMER") throw new Error("Only customers can complete customer profile");

  const user = await User.findByPk(context.user.id);
  if (!user) throw new Error("User not found");

  if (args.phone) user.phone = args.phone;
  if (args.address) user.address = args.address;
  if (args.houseNumber) user.houseNumber = args.houseNumber;
  if (args.city) user.city = args.city;
  if (args.state) user.state = args.state;
  user.profileCompleted = true;

  await user.save();
  return user;
 },

 completeProviderProfile: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "PROVIDER") throw new Error("Only providers can complete provider profile");

  const user = await User.findByPk(context.user.id, { include: [ProviderProfile] });
  if (!user) throw new Error("User not found");

  // Mandatory fields
  if (!args.phone) throw new Error("Phone number is required");
  if (!args.profilePicture) throw new Error("Profile picture is required");
  if (args.experienceYears === undefined || args.experienceYears === null) throw new Error("Experience years is required");

  user.phone = args.phone;
  if (args.state) user.state = args.state;
  user.profileCompleted = true;
  await user.save();

  // Update provider profile
  if (user.ProviderProfile) {
   user.ProviderProfile.profilePicture = args.profilePicture;
   user.ProviderProfile.experienceYears = args.experienceYears;
   if (args.services) user.ProviderProfile.services = args.services;
   if (args.city) user.ProviderProfile.city = args.city;
   if (args.description) user.ProviderProfile.description = args.description;
   await user.ProviderProfile.save();
  } else {
   await ProviderProfile.create({
    UserId: user.id,
    profilePicture: args.profilePicture,
    experienceYears: args.experienceYears,
    services: args.services || "",
    city: args.city || "",
    description: args.description || ""
   });
  }

  return user;
 },

 // ─── Jobs ────────────────────────────────────────────────────

 createJob: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "CUSTOMER") throw new Error("Only customers can create jobs");

  const job = await Job.create({
   serviceType: args.serviceType,
   description: args.description,
   address: args.address,
   city: args.city,
   state: args.state,
   budgetMin: args.budgetMin,
   budgetMax: args.budgetMax,
   date: args.date ? new Date(args.date) : null,
   UserId: context.user.id
  });

  const result = job.toJSON();
  result.date = job.date ? job.date.toISOString() : null;
  result.createdAt = job.createdAt ? job.createdAt.toISOString() : null;
  return result;
 },

 jobs: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "PROVIDER") throw new Error("Only providers can browse jobs");

  const currentUser = await User.findByPk(context.user.id);
  if (!currentUser) throw new Error("User not found");

  const whereClause = { status: "OPEN", state: currentUser.state };
  if (args.serviceType) {
   whereClause.serviceType = args.serviceType;
  }

  const jobs = await Job.findAll({ where: whereClause, order: [["createdAt", "DESC"]] });
  return jobs.map(j => {
   const result = j.toJSON();
   result.date = j.date ? j.date.toISOString() : null;
   result.createdAt = j.createdAt ? j.createdAt.toISOString() : null;
   return result;
  });
 },

 myJobs: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "CUSTOMER") throw new Error("Only customers can view their jobs");

  const jobs = await Job.findAll({
   where: { UserId: context.user.id },
   include: [
    { model: Review },
    {
     model: Bid,
     where: { status: "ACCEPTED" },
     required: false,
     include: [{ model: User, include: [ProviderProfile] }]
    }
   ],
   order: [["createdAt", "DESC"]]
  });

  return jobs.map(job => {
   const acceptedBid = job.Bids && job.Bids[0];
   return {
    id: job.id,
    serviceType: job.serviceType,
    description: job.description,
    address: job.address,
    city: job.city,
    state: job.state,
    budgetMin: job.budgetMin,
    budgetMax: job.budgetMax,
    date: job.date ? job.date.toISOString() : null,
    status: job.status,
    UserId: job.UserId,
    assignedTo: job.assignedTo,
    createdAt: job.createdAt ? job.createdAt.toISOString() : null,
    assignedProvider: acceptedBid ? {
     id: acceptedBid.User.id,
     name: acceptedBid.User.name,
     email: acceptedBid.User.email,
     phone: acceptedBid.User.phone,
     state: acceptedBid.User.state,
     isPublic: acceptedBid.User.isPublic,
     language: acceptedBid.User.language,
     profile: acceptedBid.User.ProviderProfile
    } : null,
    review: job.Review ? {
     id: job.Review.id,
     rating: job.Review.rating,
     comment: job.Review.comment,
     createdAt: job.Review.createdAt ? job.Review.createdAt.toISOString() : null
    } : null
   };
  });
 },

 newJobsForProvider: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "PROVIDER") throw new Error("Only providers can view new jobs");

  const currentUser = await User.findByPk(context.user.id);
  if (!currentUser) throw new Error("User not found");

  // Jobs posted in the last 24 hours in provider's state
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const jobs = await Job.findAll({
   where: {
    status: "OPEN",
    state: currentUser.state,
    createdAt: { [Op.gte]: oneDayAgo }
   },
   order: [["createdAt", "DESC"]],
   limit: 10
  });

  return jobs.map(j => {
   const result = j.toJSON();
   result.date = j.date ? j.date.toISOString() : null;
   result.createdAt = j.createdAt ? j.createdAt.toISOString() : null;
   return result;
  });
 },

 // ─── Bids ────────────────────────────────────────────────────

 placeBid: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "PROVIDER") throw new Error("Only providers can place bids");

  const job = await Job.findByPk(args.jobId);
  if (!job) throw new Error("Job not found");
  if (job.status !== "OPEN") throw new Error("This job is no longer accepting bids");

  const existingBid = await Bid.findOne({
   where: { JobId: args.jobId, UserId: context.user.id, status: { [Op.ne]: "CANCELLED" } }
  });
  if (existingBid) throw new Error("You have already placed a bid on this job");

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

 cancelBid: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "PROVIDER") throw new Error("Only providers can cancel bids");

  const bid = await Bid.findByPk(args.bidId);
  if (!bid) throw new Error("Bid not found");
  if (bid.UserId !== context.user.id) throw new Error("You can only cancel your own bids");

  const job = await Job.findByPk(bid.JobId);
  if (!job) throw new Error("Job not found");
  if (job.status !== "OPEN") throw new Error("Cannot cancel bid after job has been assigned");

  // 24-hour cancellation rule
  if (job.date) {
   const jobDate = new Date(job.date);
   const now = new Date();
   const hoursUntilJob = (jobDate - now) / (1000 * 60 * 60);
   if (hoursUntilJob <= 24) {
    throw new Error("Cannot cancel bid — the job is scheduled within the next 24 hours");
   }
  }

  bid.status = "CANCELLED";
  await bid.save();

  return { id: bid.id, jobId: bid.JobId, bidPrice: bid.bidPrice, message: bid.message, status: "CANCELLED", UserId: bid.UserId };
 },

 bids: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");

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
   status: bid.status,
   provider: {
    id: bid.User.id,
    name: bid.User.name,
    email: bid.User.email,
    phone: bid.User.phone,
    state: bid.User.state,
    isPublic: bid.User.isPublic,
    language: bid.User.language,
    profile: bid.User.ProviderProfile
   }
  }));
 },

 selectBid: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "CUSTOMER") throw new Error("Only customers can select bids");

  const bid = await Bid.findByPk(args.bidId);
  if (!bid) throw new Error("Bid not found");

  const job = await Job.findByPk(bid.JobId);
  if (!job) throw new Error("Job not found");
  if (job.UserId !== context.user.id) throw new Error("You can only select bids for your own jobs");
  if (job.status !== "OPEN") throw new Error("A provider has already been selected for this job");

  // Assign the job
  job.status = "ASSIGNED";
  job.assignedTo = bid.UserId;
  await job.save();

  // Accept selected bid, reject all others
  bid.status = "ACCEPTED";
  await bid.save();

  await Bid.update(
   { status: "REJECTED" },
   { where: { JobId: job.id, id: { [Op.ne]: bid.id }, status: { [Op.ne]: "CANCELLED" } } }
  );

  return job;
 },

 // ─── Mark Job Completed + Review ─────────────────────────────

 markJobCompleted: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "CUSTOMER") throw new Error("Only customers can mark jobs as completed");

  const job = await Job.findByPk(args.jobId);
  if (!job) throw new Error("Job not found");
  if (job.UserId !== context.user.id) throw new Error("You can only complete your own jobs");
  if (job.status !== "ASSIGNED" && job.status !== "IN_PROGRESS") {
   throw new Error("Job must be assigned before it can be marked complete");
  }
  if (!args.rating || args.rating < 1 || args.rating > 5) {
   throw new Error("Rating must be between 1 and 5");
  }

  // Mark job completed
  job.status = "COMPLETED";
  await job.save();

  // Create review
  await Review.create({
   rating: args.rating,
   comment: args.comment || "",
   JobId: job.id,
   reviewerId: context.user.id,
   providerId: job.assignedTo
  });

  // Update provider's average rating
  const providerProfile = await ProviderProfile.findOne({
   include: [{ model: User, where: { id: job.assignedTo } }]
  });

  if (providerProfile) {
   const allReviews = await Review.findAll({ where: { providerId: job.assignedTo } });
   const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
   providerProfile.rating = Math.round(avgRating * 10) / 10;
   providerProfile.totalReviews = allReviews.length;
   await providerProfile.save();
  }

  return job;
 },

 // ─── Reviews ─────────────────────────────────────────────────

 providerReviews: async (args) => {
  const reviews = await Review.findAll({
   where: { providerId: args.providerId },
   include: [{ model: Job, attributes: ["serviceType"] }],
   order: [["createdAt", "DESC"]]
  });

  return reviews.map(r => ({
   id: r.id,
   rating: r.rating,
   comment: r.comment,
   jobServiceType: r.Job ? r.Job.serviceType : null,
   createdAt: r.createdAt ? r.createdAt.toISOString() : null
  }));
 },

 // ─── Profiles ────────────────────────────────────────────────

 providerProfile: async (args, context) => {
  const user = await User.findByPk(args.userId, {
   include: [ProviderProfile]
  });

  if (!user || user.role !== "PROVIDER") throw new Error("Provider not found");

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
   isPublic: user.isPublic,
   language: user.language,
   profile: user.ProviderProfile
  };
 },

 customerProfile: async (args, context) => {
  const user = await User.findByPk(args.userId);

  if (!user || user.role !== "CUSTOMER") throw new Error("Customer not found");

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
   city: user.city,
   address: user.address,
   houseNumber: user.houseNumber,
   role: user.role,
   isPublic: user.isPublic,
   profileCompleted: user.profileCompleted
  };
 },

 // ─── Profile Updates (Settings) ──────────────────────────────

 updateCustomerProfile: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "CUSTOMER") throw new Error("Only customers can update customer profile");

  const user = await User.findByPk(context.user.id);
  if (!user) throw new Error("User not found");

  if (args.name) user.name = args.name;
  if (args.phone) user.phone = args.phone;
  if (args.state) user.state = args.state;
  if (args.city) user.city = args.city;
  if (args.address) user.address = args.address;
  if (args.houseNumber) user.houseNumber = args.houseNumber;

  await user.save();
  return user;
 },

 updateProviderProfile: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "PROVIDER") throw new Error("Only providers can update provider profile");

  const user = await User.findByPk(context.user.id, { include: [ProviderProfile] });
  if (!user) throw new Error("User not found");

  if (args.name) user.name = args.name;
  if (args.phone) user.phone = args.phone;
  if (args.state) user.state = args.state;
  await user.save();

  if (user.ProviderProfile) {
   if (args.city) user.ProviderProfile.city = args.city;
   if (args.services) user.ProviderProfile.services = args.services;
   if (args.experienceYears !== undefined) user.ProviderProfile.experienceYears = args.experienceYears;
   if (args.description) user.ProviderProfile.description = args.description;
   if (args.profilePicture) user.ProviderProfile.profilePicture = args.profilePicture;
   await user.ProviderProfile.save();
  }

  return user;
 },

 updateNotificationSettings: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");

  const user = await User.findByPk(context.user.id);
  if (!user) throw new Error("User not found");

  if (args.emailNotifications !== undefined) user.emailNotifications = args.emailNotifications;
  if (args.bidNotifications !== undefined) user.bidNotifications = args.bidNotifications;
  if (args.marketingEmails !== undefined) user.marketingEmails = args.marketingEmails;
  if (args.newJobAlerts !== undefined) user.newJobAlerts = args.newJobAlerts;

  await user.save();
  return user;
 },

 updatePrivacySettings: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");

  const user = await User.findByPk(context.user.id);
  if (!user) throw new Error("User not found");

  if (args.isPublic !== undefined) user.isPublic = args.isPublic;
  await user.save();
  return user;
 },

 updatePreferences: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");

  const user = await User.findByPk(context.user.id);
  if (!user) throw new Error("User not found");

  if (args.language) user.language = args.language;
  if (args.timezone) user.timezone = args.timezone;
  await user.save();
  return user;
 },

 changePassword: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");

  const bcrypt = require("bcrypt");
  const user = await User.findByPk(context.user.id);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(args.currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  const hashedPassword = await bcrypt.hash(args.newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return user;
 },

 // ─── My Bids (Provider) ─────────────────────────────────────

 myBids: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");
  if (context.user.role !== "PROVIDER") throw new Error("Only providers can view their bids");

  const bids = await Bid.findAll({
   where: { UserId: context.user.id },
   include: [{
    model: Job,
    include: [{ model: Review, where: { providerId: context.user.id }, required: false }]
   }],
   order: [["createdAt", "DESC"]]
  });

  return bids.map(bid => ({
   id: bid.id,
   jobId: bid.JobId,
   bidPrice: bid.bidPrice,
   message: bid.message,
   status: bid.status,
   job: bid.Job ? {
    id: bid.Job.id,
    serviceType: bid.Job.serviceType,
    description: bid.Job.description,
    address: bid.Job.address,
    city: bid.Job.city,
    state: bid.Job.state,
    budgetMin: bid.Job.budgetMin,
    budgetMax: bid.Job.budgetMax,
    date: bid.Job.date ? bid.Job.date.toISOString() : null,
    status: bid.Job.status,
    UserId: bid.Job.UserId,
    assignedTo: bid.Job.assignedTo,
    createdAt: bid.Job.createdAt ? bid.Job.createdAt.toISOString() : null,
    review: bid.Job.Review ? {
     id: bid.Job.Review.id,
     rating: bid.Job.Review.rating,
     comment: bid.Job.Review.comment,
     createdAt: bid.Job.Review.createdAt ? bid.Job.Review.createdAt.toISOString() : null
    } : null
   } : null
  }));
 },

 // ─── Dashboard Stats ─────────────────────────────────────────

 dashboardStats: async (args, context) => {
  if (!context.user) throw new Error("Authentication required");

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

   const completedJobs = bids.filter(b => b.status === "ACCEPTED" && b.Job && b.Job.status === "COMPLETED").length;

   return {
    totalJobs: 0,
    openJobs: 0,
    assignedJobs: bids.filter(b => b.status === "ACCEPTED" && b.Job && b.Job.status !== "COMPLETED").length,
    completedJobs,
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
