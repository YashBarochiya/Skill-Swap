import { useEffect, useState } from "react";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function AllCategory() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories"); // backend route
        setCategories(res.data.categories);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Categories</h1>
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/admin/update-category/${cat._id}`)}
              className="p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 cursor-pointer transition"
            >
              <h2 className="text-lg font-semibold">{cat.name}</h2>
              <p className="text-gray-600">{cat.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {cat.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
