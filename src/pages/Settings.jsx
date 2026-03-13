//provider and customer both can access settings page, but provider will have more options like notification preferences, language preferences, privacy settings, while customer will have basic options like edit details, change password, logout, delete account
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Bell,
  Lock,
  Globe,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  UserCog,
} from "lucide-react";

function Settings() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");
  const [activeSection, setActiveSection] = useState("editDetails");
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    bidNotifications: true,
    newJobAlerts: true,
    isPublic: true,
    language: "English",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const query = `
        query {
          ${userRole === "CUSTOMER" ? "customerProfile" : "providerProfile"}(userId: ${localStorage.getItem("userId")}) {
            id
            bidNotifications
            newJobAlerts
            isPublic
            language
          }
        }
      `;

      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        { headers: { authorization: token } }
      );

      const profile = res.data.data[userRole === "CUSTOMER" ? "customerProfile" : "providerProfile"];
      
      setSettings({
        bidNotifications: profile.bidNotifications ?? true,
        newJobAlerts: profile.newJobAlerts ?? true,
        isPublic: profile.isPublic ?? true,
        language: profile.language || "English",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleNotificationToggle = async (key) => {
    const newValue = !settings[key];
    
    setSettings({ ...settings, [key]: newValue });

    try {
      setLoading(true);
      const mutation = `
        mutation {
          updateNotificationSettings(
            bidNotifications: ${key === "bidNotifications" ? newValue : settings.bidNotifications}
            newJobAlerts: ${key === "newJobAlerts" ? newValue : settings.newJobAlerts}
          ) {
            id
          }
        }
      `;

      await axios.post(
        "http://localhost:4000/graphql",
        { query: mutation },
        { headers: { authorization: token } }
      );
    } catch (error) {
      console.error("Error updating notification settings:", error);
      alert("Failed to update notification settings");
      setSettings({ ...settings, [key]: !newValue });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyToggle = async () => {
    const newValue = !settings.isPublic;
    
    setSettings({ ...settings, isPublic: newValue });

    try {
      setLoading(true);
      const mutation = `
        mutation {
          updatePrivacySettings(isPublic: ${newValue}) {
            id
          }
        }
      `;

      await axios.post(
        "http://localhost:4000/graphql",
        { query: mutation },
        { headers: { authorization: token } }
      );
      
      alert(`Your profile is now ${newValue ? 'public' : 'private'}`);
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      alert("Failed to update privacy settings");
      setSettings({ ...settings, isPublic: !newValue });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      const mutation = `
        mutation {
          updatePreferences(
            language: "${settings.language}"
          ) {
            id
          }
        }
      `;

      await axios.post(
        "http://localhost:4000/graphql",
        { query: mutation },
        { headers: { authorization: token } }
      );
      
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleUpdatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const mutation = `
        mutation {
          changePassword(
            currentPassword: "${passwordForm.currentPassword}"
            newPassword: "${passwordForm.newPassword}"
          ) {
            id
          }
        }
      `;

      await axios.post(
        "http://localhost:4000/graphql",
        { query: mutation },
        { headers: { authorization: token } }
      );

      alert("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMsg = error.response?.data?.errors?.[0]?.message || "Failed to update password";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      navigate("/");
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deletion feature will be available soon. Please contact support for assistance.");
    }
  };

  // Build nav items based on role
  const navItems = [
    { key: "editDetails", icon: UserCog, label: "Edit Details" },
    { key: "notifications", icon: Bell, label: "Notifications" },
    { key: "security", icon: Lock, label: "Security" },
    ...(userRole === "PROVIDER" ? [
      { key: "preferences", icon: Globe, label: "Preferences" },
      { key: "privacy", icon: Shield, label: "Privacy" },
    ] : []),
    { key: "account", icon: Trash2, label: "Account" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Settings</h1>
          <p className="text-zinc-600">Manage your account preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden sticky top-24">
              <nav className="divide-y divide-zinc-200">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                      activeSection === item.key
                        ? `bg-zinc-50 text-zinc-900 border-l-4 ${item.key === "account" ? "border-red-600" : "border-zinc-900"}`
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={18} strokeWidth={1.5} />
                      {item.label}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-zinc-200 p-8">

              {/* Edit Details Section */}
              {activeSection === "editDetails" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-2">Edit Details</h2>
                    <p className="text-sm text-zinc-600">Update your profile information</p>
                  </div>

                  <div className="p-6 border border-zinc-200 rounded-lg bg-zinc-50 text-center">
                    <UserCog className="mx-auto mb-3 text-zinc-400" size={40} strokeWidth={1.5} />
                    <p className="text-sm text-zinc-600 mb-4">
                      {userRole === "CUSTOMER"
                        ? "Edit your name, phone, address, and other personal details"
                        : "Edit your name, phone, services, experience, and other professional details"}
                    </p>
                    <button
                      onClick={() => navigate(userRole === "CUSTOMER" ? "/customer-profile" : "/my-profile")}
                      className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                    >
                      Go to My Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">
                      Notification Settings
                    </h2>
                  </div>

                  {userRole === "CUSTOMER" ? (
                    <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                      <div>
                        <p className="font-medium text-zinc-900">Bid Notifications</p>
                        <p className="text-sm text-zinc-600">
                          Get notified when a provider applies to your job
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.bidNotifications}
                          onChange={() => handleNotificationToggle("bidNotifications")}
                          disabled={loading}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 peer-disabled:opacity-50"/>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                      <div>
                        <p className="font-medium text-zinc-900">New Job Alerts</p>
                        <p className="text-sm text-zinc-600">
                          Get notified when new jobs are posted in your area
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.newJobAlerts}
                          onChange={() => handleNotificationToggle("newJobAlerts")}
                          disabled={loading}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 peer-disabled:opacity-50"/>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Security Section */}
              {activeSection === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">
                      Security Settings
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-zinc-900">Change Password</h3>

                    <div>
                      <label className="block text-sm font-medium text-zinc-900 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-900 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-900 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors disabled:opacity-50"
                      />
                    </div>

                    <button
                      onClick={handleUpdatePassword}
                      disabled={loading}
                      className="px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Section — Provider Only */}
              {activeSection === "preferences" && userRole === "PROVIDER" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">
                      Preferences
                    </h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-900 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        setSettings({ ...settings, language: e.target.value })
                      }
                      disabled={loading}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors disabled:opacity-50"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Kannada">Kannada</option>
                      <option value="Malayalam">Malayalam</option>
                      <option value="Bengali">Bengali</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Gujarati">Gujarati</option>
                      <option value="Punjabi">Punjabi</option>
                      <option value="Odia">Odia</option>
                      <option value="Urdu">Urdu</option>
                    </select>
                    <p className="text-xs text-zinc-500 mt-1.5">This will be visible on your public profile</p>
                  </div>

                  <button 
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              )}

              {/* Privacy Section — Provider Only */}
              {activeSection === "privacy" && userRole === "PROVIDER" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">
                      Privacy Settings
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                      <div>
                        <p className="font-medium text-zinc-900">Public Profile</p>
                        <p className="text-sm text-zinc-600">
                          {settings.isPublic
                            ? "Customers can view your full profile, ratings, and experience"
                            : "Your profile details are hidden — only your name and bid are visible"}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.isPublic}
                          onChange={handlePrivacyToggle}
                          disabled={loading}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 peer-disabled:opacity-50"/>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Section */}
              {activeSection === "account" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">
                      Account Actions
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Logout */}
                    <div className="p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-zinc-900">Logout</p>
                          <p className="text-sm text-zinc-600">
                            Sign out of your account
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>

                    {/* Delete Account */}
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-900">Delete Account</p>
                          <p className="text-sm text-red-600">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <button
                          onClick={handleDeleteAccount}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
