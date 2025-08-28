import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/me");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl mb-4">My Profile</h1>

      <p><strong>Bio:</strong> {profile.bio || "N/A"}</p>
      <p><strong>Location:</strong> {profile.location || "N/A"}</p>

      <h2 className="text-xl mt-4">Learn Skills</h2>
      <ul className="list-disc ml-6">
        {profile.learnSkills && profile.learnSkills.length > 0 ? (
          profile.learnSkills.map((s, i) => <li key={i}>{s}</li>)
        ) : (
          <li>No learn skills yet</li>
        )}
      </ul>

      <h2 className="text-xl mt-4">Experience</h2>
      <ul className="list-disc ml-6">
        {profile.experience && profile.experience.length > 0 ? (
          profile.experience.map((exp, i) => (
            <li key={i}>
              {exp.role} at {exp.company} ({exp.years} years)
            </li>
          ))
        ) : (
          <li>No experience added</li>
        )}
      </ul>

      <div className="mt-6">
        <p><strong>Average Rating:</strong> {profile.averageRating ?? "N/A"}</p>
        <p><strong>Total Reviews:</strong> {profile.totalReviews ?? 0}</p>
      </div>

      <button
        onClick={() => navigate("/update-profile")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update Profile
      </button>
    </div>
  );
}
