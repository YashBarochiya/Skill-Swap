import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [experienceList, setExperienceList] = useState([]);
  const [company, setCompany] = useState("");
  const [role,setRole]=useState("");
  const [years, setYears] = useState("");

  const navigate = useNavigate();

  // fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        const data = res.data;
        setBio(data.bio || "");
        setLocation(data.location || "");
        setExperienceList(data.experience || []);
        // learnSkills handled separately on backend
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  // save profile updates
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/profile", { bio, location, experience: experienceList });
      if (newSkill.trim()) {
        await api.post("/skills/add-learnskill", { skill: newSkill });
      }
      alert("Profile updated!");
      navigate("/profile/me");
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  // add experience entry locally
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!company || !role || !years) return;
    setExperienceList([...experienceList, { company, role, years: Number(years) }]);
    setCompany("");

    setYears("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Update Profile</h1>

      <form onSubmit={handleSaveProfile} className="space-y-3">
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 w-full"
        />

        <h2 className="text-xl mt-4">Learn Skill</h2>
        <input
          type="text"
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <h2 className="text-xl mt-4">Experience</h2>
        <ul className="list-disc ml-6 mb-2">
          {experienceList.map((exp, i) => (
            <li key={i}>{exp.role} at {exp.company} ({exp.years} yrs)</li>
          ))}
        </ul>

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 w-full"
        />
        
        <button
          onClick={handleAddExperience}
          className="bg-purple-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Experience
        </button>

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
