import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/client";

export default function UserDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await api.get(`/admin/user/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!data) return <p className="text-center text-red-600">No data found</p>;

  const { profiledata, swaps, sentReq, receiveReq, reviewer, reviewee } = data;

  return (
    <div className="p-6 space-y-6">
      {/* User Info */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-2">User Info</h2>
        <p><span className="font-semibold">Name:</span> {profiledata?.user?.name}</p>
        <p><span className="font-semibold">Email:</span> {profiledata?.user?.email}</p>
      </div>

      {/* Profile Data */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <p><span className="font-semibold">Bio:</span> {profiledata?.bio || "N/A"}</p>
        <p><span className="font-semibold">Location:</span> {profiledata?.location || "N/A"}</p>
        <p><span className="font-semibold">Average Rating:</span> {profiledata?.averageRating}</p>
        <p><span className="font-semibold">Total Reviews:</span> {profiledata?.totalReviews}</p>
      </div>

      {/* Teach Skills */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-2">Teach Skills</h2>
        {profiledata?.teachSkills?.length > 0 ? (
          <ul className="list-disc list-inside">
            {profiledata.teachSkills.map((skill, idx) => (
              <li key={idx}>
                {skill.name} ({skill.level}) - {skill.category?.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No teach skills</p>
        )}
      </div>

      {/* Teach Skills */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-2">Teach Skills</h2>
        {profiledata?.learnSkills?.length > 0 ? (
          <ul className="list-disc list-inside">
            {profiledata.learnSkills.map((skill, idx) => (
              <li key={idx}>
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p>No teach skills</p>
        )}
      </div>

      {/* Swaps */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-2">Swaps</h2>
        {swaps?.length > 0 ? (
          swaps.map((swap, idx) => (
            <div key={idx} className="border rounded p-2 mb-2">
              <p><span className="font-semibold">From:</span> {swap.fromUser?.name}</p>
              <p><span className="font-semibold">To:</span> {swap.toUser?.name}</p>
              <p><span className="font-semibold">Status:</span> {swap.status}</p>
            </div>
          ))
        ) : (
          <p>No swaps found</p>
        )}
      </div>

      {/* Sent Requests */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-2">Sent Requests</h2>
        {sentReq?.length > 0 ? (
          sentReq.map((req, idx) => (
            <div key={idx} className="border rounded p-2 mb-2">
              <p><span className="font-semibold">To:</span> {req.toUser?.name}</p>
              <p><span className="font-semibold">Offered Skill:</span> {req.offeredSkill?.name}</p>
              <p><span className="font-semibold">Requested Skill:</span> {req.requestedSkill?.name}</p>
            </div>
          ))
        ) : (
          <p>No sent requests</p>
        )}
      </div>

      {/* Received Requests */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-2">Received Requests</h2>
        {receiveReq?.length > 0 ? (
          receiveReq.map((req, idx) => (
            <div key={idx} className="border rounded p-2 mb-2">
              <p><span className="font-semibold">From:</span> {req.fromUser?.name}</p>
              <p><span className="font-semibold">Offered Skill:</span> {req.offeredSkill?.name}</p>
              <p><span className="font-semibold">Requested Skill:</span> {req.requestedSkill?.name}</p>
            </div>
          ))
        ) : (
          <p>No received requests</p>
        )}
      </div>

      {/* Reviews Given */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-2">Reviews Given</h2>
        {reviewer?.length > 0 ? (
          reviewer.map((r, idx) => (
            <div key={idx} className="border rounded p-2 mb-2">
              <p><span className="font-semibold">To:</span> {r.reviewee?.name}</p>
              <p>{r.comment || "No comment"}</p>
            </div>
          ))
        ) : (
          <p>No reviews given</p>
        )}
      </div>

      {/* Reviews Received */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-2">Reviews Received</h2>
        {reviewee?.length > 0 ? (
          reviewee.map((r, idx) => (
            <div key={idx} className="border rounded p-2 mb-2">
              <p><span className="font-semibold">From:</span> {r.reviewer?.name}</p>
              <p>{r.comment || "No comment"}</p>
            </div>
          ))
        ) : (
          <p>No reviews received</p>
        )}
      </div>
    </div>
  );
}
