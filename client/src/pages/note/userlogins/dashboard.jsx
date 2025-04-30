import { useEffect, useState } from 'react';
import { FaBus, FaCalendarAlt, FaUsers, FaTicketAlt, FaRoute } from 'react-icons/fa'; // Icons for bus management
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2'; // Importing chart libraries from Chart.js
import { Chart as ChartJS } from 'chart.js/auto'; // Required for charts to work

export default function BusTicketDashboard() {
  const [info, setInfo] = useState([]);
  const [user, setUser] = useState([]);

  // Fetch note data (dashboard notes)
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/note/nget`);
        const data = await res.json();
        if (res.ok) {
          setInfo(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchInfo();
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/auth/get`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, []);

  // Chart data setup
  const barChartData = {
    labels: ['Notes', 'Users'],
    datasets: [
      {
        label: 'Total Count',
        data: [info.length, user.length],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Notes', 'Users'],
    datasets: [
      {
        data: [info.length, user.length],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/fir-8506f.appspot.com/o/top-view-agenda-glasses-pencil.jpg?alt=media&token=6d98d4f5-3af6-4783-8899-9d27ba93abdc)' }}>
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 text-white p-6">
        <h1 className="text-3xl font-bold"> Dashboard</h1>
        
        {/* Total Counts */}
        <div className="flex space-x-8 mt-4">
          <div className="p-4 bg-opacity-70 bg-blue-500 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaUsers />
              <h2 className="text-xl font-semibold">Total Users</h2>
            </div>
            <p className="mt-2">{user.length}</p>
          </div>
          <div className="p-4 bg-opacity-70 bg-green-500 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaTicketAlt />
              <h2 className="text-xl font-semibold">Total Notes</h2>
            </div>
            <p className="mt-2">{info.length}</p>
          </div>
        </div>

        {/* Bar and Pie Charts Container */}
        <div className="mt-8 flex space-x-8">
          {/* Bar Chart */}
       
          {/* Pie Chart */}
          <div className="flex-1 p-4 h-[250px] bg-black bg-opacity-50  rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold  mt-[-50px] text-center mb-8">Analysis - Pie Chart</h3>
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false, height: 150 }} />
          </div>
        </div>

        {/* User List and Notes Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* User List */}
          <div className="bg-black bg-opacity-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">User List</h3>
            <div className="overflow-x-auto scrollbar-none lg:h-[70px]">
            <ul className="list-disc pl-6 text-lg">
              {user.map((u) => (
                <li key={u._id} className="mt-2">{u.username}</li>
              ))}
            </ul>
            </div>
          </div>

          {/* Note Titles */}
          <div className="bg-black bg-opacity-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Note Titles</h3>
            <div className="overflow-x-auto scrollbar-none lg:h-[70px]">
            <ul className="list-disc pl-6 text-lg">
              {info.map((note) => (
                <li key={note._id} className="mt-2">{note.title}</li>
              ))}
            </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
