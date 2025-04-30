import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';


export default function Update() {

    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
   
    const navigate = useNavigate();

    
    

      const {mid} = useParams();
  

   

 
  
  useEffect(() => {
    try {
      const fetchE = async () => {
        const res = await fetch(
          `http://localhost:3000/api/auth/get?upId=${mid}`
        );
        const data = await res.json();
        console.log("data", data);

        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          const selectedE = data.find(
            (course) => course._id === mid
          );
          console.log(selectedE)
          if (selectedE) {
            setFormData(selectedE);
          }
        }
      };
      fetchE();
    } catch (error) {
      console.log(error.message);
    }
  }, [mid]);




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        
      const res = await fetch(`http://localhost:3000/api/auth/update/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),

      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        
        alert("sucsses ")
        navigate("");
        
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };


  
  


 
 


 

  return (
    <div
         className="relative w-full h-[900px] bg-cover bg-center"
         style={{
           backgroundImage:
             "url(https://firebasestorage.googleapis.com/v0/b/fir-8506f.appspot.com/o/top-view-agenda-glasses-pencil.jpg?alt=media&token=6d98d4f5-3af6-4783-8899-9d27ba93abdc)"
         }}
       >
         {/* Overlay for better text visibility */}
         <div className="absolute inset-0 bg-black opacity-60"></div>
   
         <div className="relative z-10 flex items-center justify-center h-full">
           <div className="flex flex-col items-center w-full max-w-md space-y-6 mt-10  bg-opacity-50 bg-gray-800 p-8 rounded-xl shadow-lg opacity-90">
             <h1 className="text-3xl font-bold text-center text-white">
               Update User
             </h1>
            
             
             <form onSubmit={handleSubmit} className="w-full space-y-4">
             <div className="flex items-center space-x-2">
              <input
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                type="email"
                placeholder="email"
                id="email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                value={formData.email}
                required
                
                
                
              />
            </div>
               <div className="flex items-center space-x-2">
                 <input
                   className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                   type="text"
                   placeholder="username"
                   id="username"
                   onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                   value={formData.username}
                   required
                  
                  
                  
                 />
                
               </div>
              

               
   
               <div className="flex items-center space-x-2">
                 <input
                   className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                   type="text"
                   placeholder="password"
                   id="password"
                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                   value={formData.password}
                   required
                
                 />
               </div>
              
   
           
               <div className="flex items-center space-x-2">
              <select
                name="Gender"
                id="Gender"
                onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                        value={formData.Gender}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              >
                <option value="" disabled selected>
                  Select 
                </option>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
             
              </select>
            </div>

   
              
   
              
               <button
                 type="submit"
                 className="w-full p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 Submit
               </button>
             </form>
             {publishError && (
               <p className="text-red-500 text-sm">{publishError}</p>
             )}
           </div>
         </div>
       </div>
  )
}
