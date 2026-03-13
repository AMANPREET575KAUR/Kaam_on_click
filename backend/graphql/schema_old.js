const { buildSchema } = require("graphql");

const schema = buildSchema(`

type User {
 id: ID
 name: String
 email: String
 role: String
 state: String
 emailNotifications: Boolean
 bidNotifications: Boolean
 marketingEmails: Boolean
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
 status: String
 UserId: ID
}

type ProviderProfile {
 id: ID
 services: String
 experienceYears: Int
 description: String
 city: String
 rating: Float
}

type ProviderInfo {
 id: ID
 name: String
 email: String
 phone: String
 state: String
 emailNotifications: Boolean
 bidNotifications: Boolean
 marketingEmails: Boolean
 isPublic: Boolean
 language: String
 timezone: String
 profile: ProviderProfile
}

type CustomerInfo {
 id: ID
 name: String
 email: String
 phone: String
 state: String
 role: String
 emailNotifications: Boolean
 bidNotifications: Boolean
 marketingEmails: Boolean
 isPublic: Boolean
 language: String
 timezone: String
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

 createJob(
  serviceType: String
  description: String
  address: String
  city: String
  state: String
  budgetMin: Int
  budgetMax: Int
 ): Job
  placeBid(
 jobId:ID
 bidPrice:Int
 message:String
):Bid

selectBid(
 bidId: ID
): Job
 updateCustomerProfile(
  name: String
  phone: String
  state: String
 ): User

 updateProviderProfile(
  name: String
  phone: String
  state: String
  city: String
  services: String
  experienceYears: Int
  description: String
 ): User

 updateNotificationSettings(
  emailNotifications: Boolean
  bidNotifications: Boolean
  marketingEmails: Boolean
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
 UserId: ID
}

type BidWithProvider {
 id: ID
 jobId: ID
 bidPrice: Int
 message: String
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