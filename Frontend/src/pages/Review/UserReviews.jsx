import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function UserReviews() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [received, setReceived] = useState([]); // reviews where user is reviewee
  const [written, setWritten] = useState([]);  // reviews where user is reviewer
  const [showWritten, setShowWritten] = useState(false); // toggle
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("time"); // time, ratingDesc, ratingAsc, today

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await api.get(`/review/${user.id}`);     // got
        const res2 = await api.get(`/review/user/me`);        // wrote
        
        console.log(res2.data);
        setReceived(res1.data.reviews || []);
        setWritten(res2.data.reviews || []);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    };
    if (user?.id) fetchData();
  }, [user]);

  const timeAgo = (dateString) => {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  // pick list depending on toggle
  let list = showWritten ? written : received;

  // filter by search (reviewer name if received, reviewee name if written)
  list = list.filter((rev) => {
    const targetName = showWritten
      ? rev.reviewee?.name?.toLowerCase()
      : rev.reviewer?.name?.toLowerCase();
    return targetName?.includes(search.toLowerCase());
  });

  // sort & filter
  list = [...list].sort((a, b) => {
    if (sort === "ratingDesc") return b.rating - a.rating;
    if (sort === "ratingAsc") return a.rating - b.rating;
    if (sort === "time") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  // filter only today
  if (sort === "today") {
    const today = new Date().toDateString();
    list = list.filter((rev) => new Date(rev.createdAt).toDateString() === today);
  }

  return (
    <div>
      <h2 className="text-xl mt-6 mb-4">
        {showWritten ? "Reviews I Wrote" : "Reviews I Got"}
      </h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder={`Search by ${showWritten ? "reviewee" : "reviewer"} name...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="time">Newest First</option>
          <option value="ratingDesc">Rating: High → Low</option>
          <option value="ratingAsc">Rating: Low → High</option>
          <option value="today">Only Today</option>
        </select>

        {/* Toggle button */}
        <button
          onClick={() => setShowWritten(!showWritten)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showWritten ? "Show Reviews I Got" : "Show Reviews I Wrote"}
        </button>
      </div>

      {/* Reviews list */}
      {list.length === 0 ? (
        <p className="text-gray-500">
          No reviews {showWritten ? "written" : "received"} found.
        </p>
      ) : (
        <div className="space-y-4">
          {list.map((rev) => (
            <div
              key={rev._id} 
              onClick={() =>
                    navigate(`/profile/${showWritten ? rev.reviewee?._id : rev.reviewer?._id}`)
                  }
              className="p-3 border rounded-lg bg-gray-50"
            >
              <p>
                <strong>{showWritten ? "Reviewee" : "Reviewer"}:</strong>{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  
                >
                  {showWritten
                    ? rev.reviewee?.name || "Unknown"
                    : rev.reviewer?.name || "Unknown"}
                </span>
              </p>
              <p>
                <strong>Rating:</strong> ⭐ {rev.rating}/5
              </p>
              <p>
                <strong>Comment:</strong> {rev.comment}
              </p>
              <p className="text-sm text-gray-500">{timeAgo(rev.createdAt)}</p>
            </div>
            
          ))}
          {showWritten && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleUpdate(rev)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
        </div>
      )}
    </div>
  );
}
