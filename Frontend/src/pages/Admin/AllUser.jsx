import { useState, useEffect } from "react";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBanned, setShowBanned] = useState(false); // toggle state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.user);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleBanStatus = async (userId, currentStatus) => {
    try {
      const action = currentStatus ? "unban" : "ban";

      // confirmation alert
      if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
        return; // if cancelled
      }

      // hit your ban/unban API
      const endpoint = currentStatus
        ? `/admin/users/${userId}/unban`
        : `/admin/users/${userId}/ban`;

      await api.patch(endpoint);

      // update state locally
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBanned: !currentStatus } : u
        )
      );

       alert(`User has been ${action}ned successfully`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update user status");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading users...</p>;
  }

  // filter based on switch
  const filteredUsers = users.filter((u) =>
    showBanned ? u.isBanned : !u.isBanned
  );

  return (
    <div className="p-6">
      {/* Header + Switch */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {showBanned ? "Banned Users" : "Active Users"}
        </h1>

        <label className="flex items-center cursor-pointer">
          <span className="mr-2 text-sm text-gray-600">Show Banned</span>
          <input
            type="checkbox"
            className="hidden"
            checked={showBanned}
            onChange={() => setShowBanned(!showBanned)}
          />
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
              showBanned ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                showBanned ? "translate-x-6" : ""
              }`}
            ></div>
          </div>
        </label>
      </div>

      {/* User Cards */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">
          {showBanned ? "No banned users found." : "No active users found."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`p-4 border rounded-lg shadow-md ${
                user.isBanned ? "bg-red-50" : "bg-white"
              }`}
            >
              {/* Clicking name goes to user details */}
              <h2
                className="text-lg font-semibold cursor-pointer hover:underline"
                onClick={() => navigate(`/admin/users/${user._id}`)}
              >
                {user.name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm mt-2">
                Role: <span className="font-medium">{user.role}</span>
              </p>

              {/* Ban/Unban Switch */}
              <div className="mt-3 flex items-center">
                <span className="mr-2 text-sm text-gray-600">
                  {user.isBanned ? "Unban" : "Ban"}
                </span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={user.isBanned}
                    onChange={() => toggleBanStatus(user._id, user.isBanned)}
                  />
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
                      user.isBanned ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                        user.isBanned ? "translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
