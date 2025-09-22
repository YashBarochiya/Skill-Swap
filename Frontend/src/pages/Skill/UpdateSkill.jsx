import { useEffect, useState } from "react";
import api from "../../api/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UpdateSkill() {
  const [data, setData] = useState({
    name: "",
    description: "",
    level: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  // fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/skills/user/${id}`);
        const data = res.data;
        setData(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [id]);
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/skills/update/${id}`, {
        name: data.name,
        description: data.description,
        level: data.level,
      });
      window.confirm("Skill updated!!")
      navigate("/skills");
    } catch (error) {
      console.log(error.message)
    }
  };

  if (!data) return <p>Loading skill...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Update Skill</h1>

      <form onSubmit={handleSaveSkill} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="border p-2 w-full"
        />
        <select
          value={data.level}
          onChange={(e) => setData({ ...data, level: e.target.value })}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>

        {/* Save */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
