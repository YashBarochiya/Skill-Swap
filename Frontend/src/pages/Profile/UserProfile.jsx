import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/${id}`);
      const reviewsRes = await api.get(`/review/${id}`);
      setProfile(res.data);
      setReviews(reviewsRes.data.reviews);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };
  
    fetchProfile();
  }, []);


  // ⏳ helper: convert timestamp to "x days ago" or "x hours ago"
  const timeAgo = (dateString) => {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdAt;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl mb-4">My Profile</h1>
      <p>
        <strong>Name:</strong> {profile.user.name || "N/A"}
      </p>
      <p>
        <strong>Email:</strong> {profile.user.email || "N/A"}
      </p>
      <p>
        <strong>Bio:</strong> {profile.bio || "N/A"}
      </p>
      <p>
        <strong>Location:</strong> {profile.location || "N/A"}
      </p>

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
        <p>
          <strong>Average Rating:</strong>{" "}
          {profile.averageRating ?? "N/A"}
        </p>
        <p>
          <strong>Total Reviews:</strong> {profile.totalReviews ?? 0}
        </p>
      </div>

      {/* Reviews Section */}
      <h2 className="text-xl mt-6 mb-2">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-3 border rounded-lg bg-gray-50"
            >
              <p>
                <strong>Reviewer:</strong> {rev.reviewer?.name || "Unknown"}
              </p>
              <p>
                <strong>Rating:</strong> ⭐ {rev.rating}/5
              </p>
              <p>
                <strong>Comment:</strong> {rev.comment}
              </p>
              <p className="text-sm text-gray-500">
                {timeAgo(rev.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
