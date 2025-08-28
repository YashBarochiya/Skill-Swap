import { useState } from "react";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [list, setList] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const navigate = useNavigate();

  const handleAddSkill = () => {
    if (skillInput.trim() === "") return;
    setList([...list, skillInput.trim()]);
    setSkillInput(""); // clear input
  };

  const handleRemoveSkill = (index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // ✅ stop page refresh
    try {
      const res = await api.post("/admin/add-category", {
        name,
        description,
        list, // backend expects "skills:list"
      });
      if (res.status === 200) {
        alert("Category added");
        navigate("/"); // ✅ redirect after success
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to add category");
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Add Category</h1>
      <form onSubmit={onSubmit}>
        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded-md"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 p-2 border rounded-md"
        />

        {/* Skills */}
        <div className="mb-3">
          <label className="block font-semibold mb-2">Skills (min 5)</label>
          <div className="flex gap-2">
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

          {/* Show Added Skills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {list.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-2 bg-green-600 text-white rounded-md"
        >
          Save Category
        </button>
      </form>
    </>
  );
}
