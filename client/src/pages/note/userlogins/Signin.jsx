import { Spinner,  } from "flowbite-react";
import { useEffect, useState } from "react";
import {  Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSilce";
import girl from "../img/img.jpg";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlchange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });



  };



  

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }

    try {
      dispatch(signInStart());

      const res = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message));
        return; // Ensure you return here to prevent further actions
      }

      dispatch(signInSuccess(data));
      navigate("/dashboard/notetable");
    } catch (error) {
      dispatch(signInFailure("An error occurred. Please try again."));
    }
  };

  return (
    <div className="relative h-[800px]">
  {/* Background Image with Dark Overlay */}
  <img
    src="https://firebasestorage.googleapis.com/v0/b/fir-8506f.appspot.com/o/top-view-agenda-glasses-pencil.jpg?alt=media&token=6d98d4f5-3af6-4783-8899-9d27ba93abdc"
    alt="Background Image"
    className="w-full h-full object-cover"
  />

  <div className="absolute top-1 flex justify-center items-center w-full h-full">
    <div className="">
     

      {/* Form Container */}
      <div className=" bg-black bg-opacity-10 w-[480px] md:w-[550px] lg:w-[550px] h-auto mt-8 max-w-3xl mx-auto rounded-3xl  p-8">
      <div className="flex justify-center items-center gap-8">
           

          </div>
        <div className="flex justify-center items-center">
          <div className=" w-full">
          <div className="mb-4 mt-4 font-serif flex justify-center items-center text-white text-xl">
              <h1>Login</h1>
            </div>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <h3 className="font-semibold text-white ml-1">Email</h3>
                <input
                  className="bg-slate-800 bg-opacity-70 border-white p-4 border-opacity-50 rounded-lg w-full h-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  placeholder="name@company.com"
                  id="email"
                  onChange={handlchange}
                />
              </div>

              {/* Password Input */}
              <div>
                <h3 className="font-semibold text-white  ml-1">Password</h3>
                <input
                  className="bg-slate-800 bg-opacity-70 border-white p-4 border-opacity-50 rounded-lg w-full h-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  placeholder="Password"
                  id="password"
                  onChange={handlchange}
                />
              </div>

              {/* Submit Button */}
              <button
                className="bg-slate-900 text-white p-4 rounded-lg w-full h-12 mt-6 hover:bg-blue-700 transition-all duration-300 focus:outline-none"
                type="submit"
                disabled={loading}
              >
                 {loading ? (
                <span className="lloading-text">Loading...</span>
              ) : (
                <div className="lsubmit-button">SIGN IN</div>
              )}
              </button>
            </form>

             <div className="flex gap-2 text-sm mt-5 text-white justify-center">
                    <span>Have an account?</span>
                    <Link to="/sign-Up" className="text-blue-400 hover:text-blue-500">
                      Sign Up
                    </Link>
                  </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="mt-5 text-red-600 bg-red-200 bg-opacity-60 p-4 rounded-lg text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  
  );
}
