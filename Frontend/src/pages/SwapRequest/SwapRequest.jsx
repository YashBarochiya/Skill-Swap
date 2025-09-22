import { useEffect, useState } from "react";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function SwapRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSent, setShowSent] = useState(true); // true = Sent, false = Received
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const endpoint = showSent
          ? "/swap-requests/sent"
          : "/swap-requests/received";
        const res = await api.get(endpoint);
        if (res.status === 200) {
          setRequests(res.data);
          console.log(`${showSent ? "Sent" : "Received"} requests fetched`);
        }
      } catch (error) {
        console.error("Failed to fetch swap requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [showSent]);

  const handleAction = async (reqId, status) => {
    try {
      const res = await api.put(`/swap-requests/${reqId}/${status}`);
      if (res.status === 200) {
        alert("Status Updated!");
        navigate("/swap-requests");
      }
      navigate("/swap-requests");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert("Request Not Found!");
        } else if (error.response.status === 400) {
          alert("This swap request has expired (max 5 days validity)");
        } else if (error.response.status === 403) {
          alert("Only the recipient can accept or reject.");
        } else if (error.response.status === 401) {
          alert("Only pending requests can be updated.");
        } else {
          alert("Something went wrong!");
        }
      } else {
        console.error(error.message);
        alert("Network error!");
      }
    }
  };

  if (loading) return <p className="text-center">Loading requests...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Swap Requests</h1>
        {/* Toggle button */}
        <button
          onClick={() => setShowSent((prev) => !prev)}
          className={`px-4 py-2 rounded ${
            showSent
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {showSent ? "Showing Sent" : "Showing Received"}
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">
          No {showSent ? "sent" : "received"} requests.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              {/* User Info */}
              <div className="mb-2">
                {showSent ? (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">To:</span>{" "}
                    {req.toUser?.name} ({req.toUser?.email})
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">From:</span>{" "}
                    {req.fromUser?.name} ({req.fromUser?.email})
                  </p>
                )}
              </div>

              {/* Skills Info */}
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-500">Offered Skill</p>
                  <p className="font-medium">{req.offeredSkill?.name}</p>
                  <p className="text-sm text-gray-600">
                    Level: {req.offeredSkill?.level}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-500">Requested Skill</p>
                  <p className="font-medium">{req.requestedSkill?.name}</p>
                  <p className="text-sm text-gray-600">
                    Level: {req.requestedSkill?.level}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="mt-3">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {req.status}
                </span>
              </div>
              {req.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  {showSent ? (
                    <button
                      onClick={() => handleAction(req._id, "cancelled")}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAction(req._id, "accepted")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "rejected")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
