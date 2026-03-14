import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";
import { User, Briefcase, MapPin, Star, Award, Edit2, MessageSquare } from "lucide-react";

function ProviderProfile() {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "",
    city: "",
    services: "",
    experienceYears: 0,
    description: "",
  });

  const formatReviewDate = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
  };

  const fetchProfile = async () => {
    const userId = Number(localStorage.getItem("userId"));
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("Missing userId or token");
      setIsLoading(false);
      return;
    }

    const query = `
    {
      providerProfile(userId: ${userId}) {
        id
        name
        email
        phone
        state
        profile {
          services
          experienceYears
          description
          city
          rating
          totalReviews
          profilePicture
        }
      }
      providerReviews(providerId: ${userId}) {
        id
        rating
        comment
        jobServiceType
        createdAt
      }
    }
    `;

    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        { headers: { authorization: token } }
      );

      const providerProfile = res.data?.data?.providerProfile;
      const providerReviews = res.data?.data?.providerReviews || [];

      if (!providerProfile) {
        console.warn("Provider profile not found");
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setProfile(providerProfile);
      setReviews(providerReviews);

      setFormData({
        name: providerProfile.name || "",
        phone: providerProfile.phone || "",
        state: providerProfile.state || "",
        city: providerProfile.profile?.city || "",
        services: providerProfile.profile?.services || "",
        experienceYears: providerProfile.profile?.experienceYears || 0,
        description: providerProfile.profile?.description || "",
      });

    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "experienceYears" ? Number(value) : value,
    });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    const query = `
    mutation {
      updateProviderProfile(
        name: "${formData.name}"
        phone: "${formData.phone}"
        state: "${formData.state}"
        city: "${formData.city}"
        services: "${formData.services}"
        experienceYears: ${formData.experienceYears}
        description: "${formData.description}"
      ){
        id
        name
        phone
        state
      }
    }
    `;

    try {
      await axios.post(
        "http://localhost:4000/graphql",
        { query },
        { headers: { authorization: token } }
      );

      setProfile({
        ...profile,
        name: formData.name,
        phone: formData.phone,
        state: formData.state,
        profile: {
          ...profile.profile,
          city: formData.city,
          services: formData.services,
          experienceYears: formData.experienceYears,
          description: formData.description,
        },
      });

      setIsEditing(false);
      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Update error:", error);
      const errorMsg = error.response?.data?.errors?.[0]?.message;
      alert(errorMsg || "Failed to update profile.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
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

  const services = profile.profile?.services?.split(",") || [];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">My Profile</h1>
            <p className="text-zinc-600">Your professional information</p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800"
            >
              <Edit2 size={16}/>
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">

          {/* Top Banner */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-white">
            <div className="flex items-start gap-6">

              {profile.profile?.profilePicture ? (
                <img
                  src={profile.profile.profilePicture}
                  alt="profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                  <User size={36}/>
                </div>
              )}

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>

                <div className="flex items-center gap-4 text-sm text-white/80">

                  <span className="flex items-center gap-1">
                    <Briefcase size={14}/>
                    Service Provider
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={14}/>
                    {profile.profile?.city}, {profile.state}
                  </span>

                  <span className="flex items-center gap-1">
                    <Star size={14}/>
                    {profile.profile?.rating || "New"} ({profile.profile?.totalReviews || 0})
                  </span>

                </div>
              </div>

            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p>Email: {profile.email}</p>
              <p>Phone: {profile.phone}</p>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-2">Services</h3>

              <div className="flex flex-wrap gap-2">
                {services.map((service, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-zinc-900 text-white text-xs rounded-full"
                  >
                    {service.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              <p>{profile.profile?.experienceYears || 0} years</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p>{profile.profile?.description || "No description provided"}</p>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="font-semibold mb-3">
                Customer Reviews ({reviews.length})
              </h3>

              {reviews.length === 0 ? (
                <p className="text-zinc-500">No reviews yet</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 mb-3">

                    <div className="flex justify-between mb-2">
                      <span className="text-xs">{review.jobServiceType}</span>
                      <span className="text-xs">{formatReviewDate(review.createdAt)}</span>
                    </div>

                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>

                    {review.comment && (
                      <p className="text-sm italic">"{review.comment}"</p>
                    )}

                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProviderProfile;