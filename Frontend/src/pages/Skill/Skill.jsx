import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Skill() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get(`/skills/${user.id}`);
        console.log("Loaded skills:", res.data);
        setSkills(res.data.teachSkills || []);
      } catch (err) {
        console.error("Failed to fetch skills", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchSkills();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      await api.delete(`/skills/delete/${id}`);
      setSkills((prev) => prev.filter((skill) => skill._id !== id));
    } catch (err) {
      console.error("Failed to delete skill", err);
    }
  };

  if (loading) return <p>Loading skills...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">My Skills</h1>
      <button
          onClick={() => navigate("/add-skill")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          + Add Skill
        </button>
      {skills.length === 0 ? (
        <p className="text-center text-gray-500">No skills added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {skill.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
              <p className="text-sm text-gray-600">
                Level: <span className="font-medium">{skill.level}</span>
              </p>
              <p className="text-sm text-gray-600">
                Category: <span className="font-medium">{skill.category}</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Added on {new Date(skill.createdAt).toLocaleDateString()}
              </p>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/update-skill/${skill._id}`)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
