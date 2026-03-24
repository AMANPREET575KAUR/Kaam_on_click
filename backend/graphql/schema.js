const { buildSchema } = require("graphql");

const schema = buildSchema(`

type User {
 id: ID
 name: String
 email: String
 role: String
 state: String
 phone: String
 address: String
 houseNumber: String
 city: String
 profileCompleted: Boolean
 emailNotifications: Boolean
 bidNotifications: Boolean
 marketingEmails: Boolean
 newJobAlerts: Boolean
 isPublic: Boolean
 language: String
 timezone: String
}

type AuthPayload {
 token: String
 user: User
}

type Job {
 id: ID
 serviceType: String
 description: String
 address: String
 city: String
 state: String
 budgetMin: Int
 budgetMax: Int
 date: String
 status: String
 UserId: ID
 assignedTo: ID
 assignedProvider: ProviderInfo
 review: ReviewInfo
 createdAt: String
}

type ProviderProfile {
 id: ID
 services: String
 experienceYears: Int
 description: String
 city: String
 rating: Float
 totalReviews: Int
 profilePicture: String
}

type ProviderInfo {
 id: ID
 name: String
 email: String
 phone: String
 state: String
 isPublic: Boolean
 language: String
 profile: ProviderProfile
}

type CustomerInfo {
 id: ID
 name: String
 email: String
 phone: String
 state: String
 city: String
 address: String
 houseNumber: String
 role: String
 isPublic: Boolean
 profileCompleted: Boolean
}

type ReviewInfo {
 id: ID
 rating: Int
 comment: String
 createdAt: String
}

type Query {
 hello: String
 jobs(serviceType: String): [Job]
 myJobs: [Job]
 bids(jobId: ID): [BidWithProvider]
 myBids: [BidWithJob]
 dashboardStats: DashboardStats
 providerProfile(userId: ID): ProviderInfo
 customerProfile(userId: ID): CustomerInfo
 newJobsForProvider: [Job]
 providerReviews(providerId: ID): [ProviderReview]
}

type Mutation {
 registerCustomer(
  name: String
  email: String
  password: String
  phone: String
  state: String
 ): User

 registerProvider(
  name: String
  email: String
  password: String
  phone: String
  state: String
  city: String
  services: String
  experienceYears: Int
  description: String
 ): User

 login(
  email: String
  password: String
  role: String
 ): AuthPayload

 resetPassword(
  email: String
  role: String
  newPassword: String
 ): User

 completeCustomerProfile(
  phone: String
  address: String
  houseNumber: String
  city: String
  state: String
 ): User

 completeProviderProfile(
  phone: String
  profilePicture: String
  experienceYears: Int
  services: String
  city: String
  state: String
  description: String
 ): User

 createJob(
  serviceType: String
  description: String
  address: String
  city: String
  state: String
  budgetMin: Int
  budgetMax: Int
  date: String
 ): Job

 placeBid(
  jobId: ID
  bidPrice: Int
  message: String
 ): Bid

 cancelBid(
  bidId: ID
 ): Bid

 selectBid(
  bidId: ID
 ): Job

 markJobCompleted(
  jobId: ID
  rating: Int
  comment: String
 ): Job

 updateCustomerProfile(
  name: String
  phone: String
  state: String
  city: String
  address: String
  houseNumber: String
 ): User

 updateProviderProfile(
  name: String
  phone: String
  state: String
  city: String
  services: String
  experienceYears: Int
  description: String
  profilePicture: String
 ): User

 updateNotificationSettings(
  emailNotifications: Boolean
  bidNotifications: Boolean
  marketingEmails: Boolean
  newJobAlerts: Boolean
 ): User

 updatePrivacySettings(
  isPublic: Boolean
 ): User

 updatePreferences(
  language: String
  timezone: String
 ): User

 changePassword(
  currentPassword: String
  newPassword: String
 ): User
}

type Bid {
 id: ID
 jobId: ID
 bidPrice: Int
 message: String
 status: String
 UserId: ID
}

type BidWithProvider {
 id: ID
 jobId: ID
 bidPrice: Int
 message: String
 status: String
 provider: ProviderInfo
}

type BidWithJob {
 id: ID
 jobId: ID
 bidPrice: Int
 message: String
 status: String
 job: Job
}

type ProviderReview {
 id: ID
 rating: Int
 comment: String
 jobServiceType: String
 createdAt: String
}

type DashboardStats {
 totalJobs: Int
 openJobs: Int
 assignedJobs: Int
 completedJobs: Int
 totalBids: Int
 pendingBids: Int
 acceptedBids: Int
 recentJobs: [Job]
 recentBids: [BidWithJob]
}

`);

module.exports = schema;
