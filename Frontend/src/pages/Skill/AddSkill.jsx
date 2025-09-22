import { useState } from "react";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function AddSkill() {
  const [form, setForm] = useState({
    skillname: "",
    description: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/skills/add-skill", form); // ✅ adjust to match your backend route
      navigate("/skills"); // go back to skills list
    } catch (err) {
      console.error("Failed to add skill", err);
      alert(err.response?.data?.message || "Error adding skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Skill</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Skill Name */}
        <input
          type="text"
          name="skillname"
          placeholder="Skill Name"
          value={form.skillname}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          rows="4"
        />

        {/* Level */}
        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          {loading ? "Saving..." : "Add Skill"}
        </button>
      </form>
    </div>
  );
}
