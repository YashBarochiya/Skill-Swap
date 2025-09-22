import { useEffect, useState } from "react";
import api from "../../api/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UpdateProfile() {
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  const [learnSkills, setLearnSkills] = useState([]);
  const [newLearnSkill, setNewLearnSkill] = useState("");

  const [experienceList, setExperienceList] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const { user } = useAuth(); // logged-in user
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
        setLearnSkills(data.learnSkills || []);
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
      await api.put(`/profile/update/${user.id}`, { 
        bio, 
        location, 
        experience: experienceList,
        learnSkills,
      });
      alert("Profile updated!");
      navigate("/profile/me");
    } catch (err) {
      alert("Update failed");
    }
  };

  // add/remove skills
  const handleAddLearnSkill = () => {
    if (!newLearnSkill.trim()) return;
    setLearnSkills([...learnSkills, newLearnSkill.trim()]);
    setNewLearnSkill("");
  };
  const handleRemoveLearnSkill = (i) => {
    setLearnSkills(learnSkills.filter((_, idx) => idx !== i));
  };

  // add experience entry locally
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!company || !role || !years) return;
    setExperienceList([...experienceList, { company, role, years: Number(years) }]);
    setCompany("");
    setRole("");
    setYears("");
  };

  const handleRemoveExperience = (i) => {
    setExperienceList(experienceList.filter((_, idx) => idx !== i));
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

        {/* Learn Skills */}
        <h2 className="text-xl mt-4">Learn Skills</h2>
        <ul className="list-disc ml-6 mb-2">
          {learnSkills.map((s, i) => (
            <li key={i}>
              {s}{" "}
              <button
                type="button"
                onClick={() => handleRemoveLearnSkill(i)}
                className="text-red-500 ml-2"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a learn skill"
            value={newLearnSkill}
            onChange={(e) => setNewLearnSkill(e.target.value)}
            className="border p-2 flex-1"
          />
          <button
            type="button"
            onClick={handleAddLearnSkill}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        

        {/* Experience */}
        <h2 className="text-xl mt-4">Experience</h2>
        <ul className="list-disc ml-6 mb-2">
          {experienceList.map((exp, i) => (
            <li key={i}>
              {exp.role} at {exp.company} ({exp.years} yrs){" "}
              <button
                type="button"
                onClick={() => handleRemoveExperience(i)}
                className="text-red-500 ml-2"
              >
                ✕
              </button>
            </li>
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
        <input
          type="number"
          placeholder="Years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={handleAddExperience}
          type="button"
          className="bg-purple-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Experience
        </button>

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
