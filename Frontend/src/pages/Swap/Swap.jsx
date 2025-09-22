import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Swap() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "active", "pending", "rejected"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/swaps/my`);
        if (res.status === 200) {
          setData(res.data || []);
        }
      } catch (error) {
        if (error.response?.status === 500) {
          alert("Server Error");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleAction = async (swapId, action) => {
    try {
      const res = await api.put(`/swaps/${swapId}/${action}`);
      if (res.status === 200) {
        alert("Action completed!");
        setData((prev) =>
          prev.map((s) => (s._id === swapId ? { ...s, status: action } : s))
        );
      }
    } catch (err) {
      alert("Failed to update swap!");
    }
  };

  const filteredSwaps =
    filter === "all" ? data : data.filter((s) => s.status === filter);

  if (loading) return <p className="text-center">Loading swaps...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">My Swaps</h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        {["all", "active", "pending", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded ${
              filter === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredSwaps.length === 0 ? (
        <p className="text-center text-gray-500">No {filter} swaps found.</p>
      ) : (
        <div className="space-y-4">
          {filteredSwaps.map((swap) => (
            <div
              key={swap._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              {/* User Info */}
              <div className="flex justify-between mb-3">
                <div>
                  <p className="font-semibold  cursor-pointer hover:underline" onClick={()=>{
                    navigate(`/profile/${swap.fromUser?._id}`);
                  }}>From: {swap.fromUser?.name}</p>
                  <p className="text-sm text-gray-600">
                    {swap.fromUser?.email}
                  </p>
                </div>
                <div>
                  <p className="font-semibold  cursor-pointer hover:underline" onClick={()=>{
                    navigate(`/profile/${swap.toUser?._id}`);
                  }}>To: {swap.toUser?.name}</p>
                  <p className="text-sm text-gray-600">{swap.toUser?.email}</p>
                </div>
              </div>

              {/* Skills Info */}
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-500">Skill from User 1</p>
                  <p className="font-medium">{swap.skillFromUser1?.name}</p>
                  <p className="text-sm text-gray-600">
                    Level: {swap.skillFromUser1?.level}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-500">Skill from User 2</p>
                  <p className="font-medium">{swap.skillFromUser2?.name}</p>
                  <p className="text-sm text-gray-600">
                    Level: {swap.skillFromUser2?.level}
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    swap.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : swap.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {swap.status}
                </span>

                <div className="flex gap-2">
                  {swap.status === "pending" &&
                    !swap.agreementConfirmedBy?.includes(user.id) && (
                      <>
                        <button
                          onClick={() => handleAction(swap._id, "confirm")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleAction(swap._id, "reject")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}

                  {swap.status === "pending" &&
                    swap.agreementConfirmedBy?.includes(user.id) && (
                      <span className="text-sm text-gray-600 italic">
                        ✅ You already confirmed
                      </span>
                    )}

                  {swap.status === "active" && (
                    <button
                      onClick={() => handleAction(swap._id, "complete")}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Complete
                    </button>
                  )}

                  {swap.status === "completed"  && (
                    <button
                      onClick={() =>
                        navigate(`/add-review/${swap._id}/${swap.toUser._id}`)
                      }
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                    >
                      Give Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
