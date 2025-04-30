import { Outlet, NavLink } from "react-router-dom"; // Use NavLink instead of Link for active styles
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSilce";
import { FaUser, FaStickyNote, FaRobot, FaUsers, FaChartBar, FaSignOutAlt } from 'react-icons/fa';  // Importing icons

export default function Sidbar() {
  const { currentUser } = useSelector((state) => state.user); // Get currentUser from Redux state
  const dispatch = useDispatch(); // Get dispatch function from Redux

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message); // Handle error if the response is not OK
      } else {
        dispatch(signoutSuccess()); // Dispatch the action to update Redux state after sign out
      }
    } catch (error) {
      console.log(error.message); // Handle fetch error
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-gray-800 p-4 lg:p-6">
        {/* Header with Logo and Logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold">Dashboard</div>
          {currentUser && (
            <button
              onClick={handleSignout}
              className="bg-red-600 w-16 h-10 text-white px-2 py-2 rounded-lg text-sm font-semibold hover:bg-red-800 transition"
            >
               LogOut
            </button>
          )}
        </div>

        {/* User Profile */}
        {currentUser ? (
          <div className="flex items-center mb-8">
           
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-10 w-10 rounded-full object-cover"
              />
           
            <div className="ml-4">
              <div className="text-lg font-semibold">Hi, {currentUser.username}</div>
              <div className="text-sm opacity-75">Welcome back!</div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <NavLink to="/" className="text-white hover:text-gray-400">
              Login
            </NavLink>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10">
          <h2 className="text-xl uppercase font-semibold opacity-70 mb-4">Navigation</h2>
          <nav>
            <ul>
              <li className="mb-3">
                <NavLink
                  to="/dashboard/Profile"
                  className="flex items-center text-white text-lg font-serif hover:text-blue-600"
                  activeClassName="text-blue-600" // Apply an active class
                >
                  <FaUser className="mr-3" /> Profile
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/dashboard/notetable"
                  className="flex items-center text-white text-lg font-serif hover:text-blue-600"
                  activeClassName="text-blue-600"
                >
                  <FaStickyNote className="mr-3" /> Note
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/dashboard/image"
                  className="flex items-center text-white text-lg font-serif hover:text-blue-600"
                  activeClassName="text-blue-600"
                >
                  <FaRobot className="mr-3" /> Image to Text
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/dashboard/audio"
                  className="flex items-center text-white text-lg font-serif hover:text-blue-600"
                  activeClassName="text-blue-600"
                >
                  <FaRobot className="mr-3" /> Speech to text
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/dashboard/dashbord"
                  className="flex items-center text-white text-lg font-serif hover:text-blue-600"
                  activeClassName="text-blue-600"
                >
                  <FaUsers className="mr-3" /> User Management
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/dashboard/dash"
                  className="flex items-center text-white text-lg font-serif hover:text-blue-600"
                  activeClassName="text-blue-600"
                >
                  <FaChartBar className="mr-3" /> Analysis
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Logo under the sidebar */}
        <div className="mt-8 flex justify-center">
          <img src="/path/to/your/logo.png" alt="Logo" className="h-16 w-auto" />
        </div>

        <hr className="bg-gray-600 h-1 opacity-60 mt-8" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 py-4 px-6">
        <Outlet />
      </main>
    </div>
  );
}
