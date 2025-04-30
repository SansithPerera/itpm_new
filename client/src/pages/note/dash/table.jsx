import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import { FaArrowLeft } from 'react-icons/fa'; // Import the left arrow icon




export default function BManageEmp() {
  const [Info, setInfo] = useState([]);
  console.log(Info);
  const [DId, setformId] = useState("");
  const [filter, setfilter] = useState([]);
  const [query, setQuery] = useState("");


  useEffect(() => {
    const fetchinfo = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/auth/get`
        );
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setInfo(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchinfo();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Name", "email","Gender", "password"]],
      body: filter.map((course) => [
        course.username,
        course.email,
        course.Gender,
        course.password
      
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 0, 255] }
    });
    doc.save("user.pdf");
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/delete/${DId}`,
        {
          method: "DELETE"
        }
      );
      if (res.ok) {
        setInfo((prev) => prev.filter((course) => course._id !== DId));
        alert("Deleted");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (query.trim() === "") {
      setfilter([...Info]);
    } else {
      const filteredData = Info.filter(
        (course) =>
          course.email && course.email.toLowerCase().includes(query.toLowerCase())
      );
      setfilter(filteredData);
    }
  }, [query, Info]);

  return (
    <div
      className="h-[800px] relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://firebasestorage.googleapis.com/v0/b/fir-8506f.appspot.com/o/top-view-agenda-glasses-pencil.jpg?alt=media&token=6d98d4f5-3af6-4783-8899-9d27ba93abdc)"
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="items-center justify-center  flex relative z-10">
        <div className="items-center mt-16">
          {/* Search Input */}
          <div className="flex justify-center mt-8">
            <input
              type="text"
              placeholder="Search..."
              className="w-[400px] h-10 mt-4 rounded-full bg-black shadow-xl border border-slate-400 bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <div>
              <button
                onClick={generatePDF}
                className="mt-4 bg-blue-800 font-serif text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                User Report
              </button>
            </div>
         
          </div>

     

          {/* Table Container */}
          <div className="lg:w-[1200px] mt-4 rounded-3xl shadow-xl bg-opacity-50 bg-gray-800 text-white overflow-hidden">
            <div className="overflow-x-auto lg:h-[500px]">
              <table className="min-w-full bg-opacity-50 bg-gray-800 text-sm">
                <thead className="bg-blue-950 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">UserName</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Gender</th>
                    <th className="px-6 py-4 text-left">Password</th>

                    <th className="px-6 py-4 text-center">Edit</th>
                    <th className="px-6 py-4 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filter && filter.length > 0 ? (
                    filter.map((course) => (
                      <tr
                        key={course._id}
                        className="hover:bg-black transition-colors duration-300"
                      >
                        <td className="px-6 py-4 border-b text-gray-200">
                          {course.username}
                        </td>
                        <td className="px-6 py-4 border-b text-gray-200">
                          {course.email}
                        </td>
                        <td className="px-6 py-4 border-b text-gray-200">
                          {course.Gender}
                        </td>
                        <td className="px-6 py-4 border-b text-gray-200">
                          {course.password}
                        </td>
                        

                        <td className="px-6 py-4 border-b text-center">
                          <Link to={`/dashboard/Uupdate/${course._id}`}>
                            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300">
                              Edit
                            </button>
                          </Link>
                        </td>
                        <td className="px-6 py-4 border-b text-center">
                          <button
                            onClick={() => {
                              setformId(course._id);
                              handleDeleteUser();
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-gray-500 py-4"
                      >
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
