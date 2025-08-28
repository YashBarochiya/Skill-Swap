import { useState, useEffect } from "react";
import api from "../../api/client";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/admin/category/${id}`);
        setCategory(res.data.categories);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!category) return <p>Category not found</p>;

  // Add skill locally
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    setCategory({ ...category, skills: [...category.skills, skillInput.trim()] });
    setSkillInput("");
  };

  // Remove skill locally
  const handleRemoveSkill = (skill) => {
    setCategory({ ...category, skills: category.skills.filter((s) => s !== skill) });
  };

  // Save all changes at once
  const handleSave = async () => {
    try {
      const res = await api.put(`/admin/update-category/${id}`, {
        name: category.name,
        description: category.description,
        skills: category.skills,
      });
      alert("Category updated successfully!");
      navigate("/categories");
    } catch (err) {
      console.error(err);
      alert("Failed to update category");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Update Category</h1>

      <input
        type="text"
        value={category.name}
        onChange={(e) => setCategory({ ...category, name: e.target.value })}
        className="w-full mb-3 p-2 border rounded-md"
      />

      <textarea
        value={category.description}
        onChange={(e) => setCategory({ ...category, description: e.target.value })}
        className="w-full mb-3 p-2 border rounded-md"
      />

      {/* Skills */}
      <div className="mb-3">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Enter a skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-3 py-1 bg-blue-500 text-white rounded-md"
          >
            + Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-4 py-2 bg-green-600 text-white rounded-md"
      >
        Save Changes
      </button>
    </div>
  );
}
