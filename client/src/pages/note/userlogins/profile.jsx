import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import "react-circular-progressbar/dist/styles.css";
import {
  updateFailure,
  updateSart,
  updateSuccess
} from "../redux/user/userSilce.js";
import { useDispatch } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);

  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [deleting, setDeleting] = useState(false); 
  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();
  console.log(currentUser);
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
   
    try {
      dispatch(updateSart());
      const res = await fetch(`/api/auth/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
        alert("succesfull");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };



  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        setDeleting(true);
        const res = await fetch(`/api/auth/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (res.ok) {
          alert("Your account has been deleted.");
          // Redirect to home or login page
          window.location.href = "/"; // Example redirect to homepage
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error deleting the account. Please try again.");
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
    {/* Background Image */}
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/fir-8506f.appspot.com/o/top-view-agenda-glasses-pencil.jpg?alt=media&token=6d98d4f5-3af6-4783-8899-9d27ba93abdc')",
      }}
    >
     

      <div className="flex justify-center items-center min-h-screen relative z-10">
        <div className="  p-8 rounded-xl shadow-lg max-w-3xl w-full">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-white">My Profile</h2>
          </div>
          
                    

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-6">
              {/* Username Field */}
              <div className="flex-1">
                <label htmlFor="username" className="block text-sm font-medium text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  defaultValue={currentUser.username}
                  onChange={handleChange}
                  className="mt-2 p-4 w-full rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Email Field */}
              <div className="flex-1">
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue={currentUser.email}
                  onChange={handleChange}
                  className="mt-2 p-4 w-full rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-[150px]">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                defaultValue={currentUser.password}
                onChange={handleChange}
                className="mt-2 p-4 w-full rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

             {/* Username Field */}
             <div className="flex-1">
            
                <label htmlFor="telephone" className="block text-sm font-medium text-white">
                  Gender
                </label>
                <select
                name="Gender"
                id="Gender"
                onChange={handleChange}
                defaultValue={currentUser.Gender}
                className="mt-2 p-4  rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              </div>
              

            </div>




            {/* Update Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none"
              >
                {updateUserSuccess ? (
                  <span>{updateUserSuccess}</span>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>

          {/* Error/Success Messages */}
          {updateUserError && (
            <p className="mt-4 text-red-600 bg-red-300 p-4 rounded-lg text-center">{updateUserError}</p>
          )}

          {error && (
            <p className="mt-4 text-red-600 bg-red-300 p-4 rounded-lg text-center">{error}</p>
          )}

          {/* Delete Account Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleDeleteAccount}
              className="bg-red-900 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
