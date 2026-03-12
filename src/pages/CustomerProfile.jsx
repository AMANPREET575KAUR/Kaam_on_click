//my prfile page,customer profile page, edit profile, view reviews, ratings, experience, services offered
import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";
import { User, Mail, Phone, MapPin, Briefcase } from "lucide-react";

function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
  });

  const fetchProfile = async () => { // get data from backend
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");// for authentication

    const query = `
    {
      customerProfile(userId: ${userId}) {
        id
        name
        email
        phone
        state
        role
      }
    }
    `;

    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        {
          headers: {
            authorization: token,
          },
        }
      );

      setProfile(res.data.data.customerProfile); // store profile data in profile state
      setFormData(res.data.data.customerProfile);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); //stops loading
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => { //function updates profile in db
    const token = localStorage.getItem("token");
    
    const query = `
    mutation {
      updateCustomerProfile(
        name:"${formData.name}"
        phone:"${formData.phone}"
        state:"${formData.state}"
      ){
        id
        name
        email
        phone
        state
      }
    }
    `;

    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        {
          headers: {
            authorization: token,
          },
        }
      );

      setProfile(res.data.data.updateCustomerProfile);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.errors?.[0]?.message;
      alert(errorMsg || "Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center p-12">
          <p className="text-zinc-600">Profile not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">My Profile</h1>
          <p className="text-zinc-600">Manage your customer information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-white">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <User size={36} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={14} />
                    Customer
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {profile.state}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Name */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-50">
                  <User className="text-zinc-400" size={20} strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-500">Full Name</p>
                    <p className="text-sm font-medium text-zinc-900 mt-0.5">
                      {profile.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-50">
                  <Mail className="text-zinc-400" size={20} strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-500">Email</p>
                    <p className="text-sm font-medium text-zinc-900 mt-0.5">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-50">
                  <Phone className="text-zinc-400" size={20} strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-500">Phone</p>
                    <p className="text-sm font-medium text-zinc-900 mt-0.5">
                      {profile.phone}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-50">
                  <MapPin className="text-zinc-400" size={20} strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-500">State</p>
                    <p className="text-sm font-medium text-zinc-900 mt-0.5">
                      {profile.state}
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-zinc-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-zinc-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-zinc-900 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                  />
                </div>

                {/* State Input */}
                <div>
                  <label className="block text-sm font-medium text-zinc-900 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(profile);
                    }}
                    className="flex-1 px-4 py-2.5 border border-zinc-200 text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="flex-1 px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CustomerProfile;
