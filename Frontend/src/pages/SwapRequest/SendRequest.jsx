import { useEffect, useState } from "react";
import api from "../../api/client";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SendRequest() {
  const { id } = useParams(); // receiver userId
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    toUser: "",
    offeredSkill: "",
    requestedSkill: "",
  });
  const [offeredSkill, setOfferedSkill] = useState([]); // sender's skills
  const [requestedSkill, setRequestedSkill] = useState([]); // receiver's skills
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!id || !user?.id) return;  // ⛔ do nothing until both are ready

      try {
        // fetch receiver profile skills
        const res1 = await api.get(`/skills/${id}`);
        // fetch sender profile skills
        const res2 = await api.get(`/skills/${user.id}`);

        setRequestedSkill(res1.data.teachSkills || []);
        setOfferedSkill(res2.data.teachSkills || []);
        console.log("skills fetched successfully!!");
      } catch (error) {
        console.error("Error fetching skills", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [id, user]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(data);
      await api.post("/swap-requests/request", {toUser:id,offeredSkill:data.offeredSkill,requestedSkill:data.requestedSkill});
      alert("Swap request sent!");
      navigate("/swap-requests");
    } catch (error) {
      console.error("Failed to send request", error);
      alert(error.response?.data?.message || "Error sending request");
    }
  };

  if (!user) {
  return <p className="text-center">Loading user...</p>;
    }


  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Send Swap Request</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Offered Skill (from sender) */}
        <div>
          <label className="block mb-1 font-medium">Your Skill</label>
          <select
            name="offeredSkill"
            value={data.offeredSkill}
            onChange={(e) => setData({ ...data, offeredSkill: e.target.value })}
            required
            className="border p-2 w-full rounded"
          >
            <option value="">Select one of your skills</option>
            {offeredSkill.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.level})
              </option>
            ))}
          </select>
        </div>

        {/* Requested Skill (from receiver) */}
        <div>
          <label className="block mb-1 font-medium">Requested Skill</label>
          <select
            name="requestedSkill"
            value={data.requestedSkill}
            onChange={(e) => setData({ ...data, requestedSkill: e.target.value })}
            required
            className="border p-2 w-full rounded"
          >
            <option value="">Select skill from other user</option>
            {requestedSkill.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.level})
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Send Request
        </button>
      </form>
    </div>
  );
}
