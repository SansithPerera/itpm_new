import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles for react-quill

export default function Update() {
    const [formData, setFormData] = useState({ 
        content: '', 
        _id: '',
        title: '',
        color: '#FFE5B4' // Default pastel orange
    }); 
    const [publishError, setPublishError] = useState(null);
    console.log(formData);
    
    const navigate = useNavigate();
    const { incomid } = useParams();
    
    const pastelColors = [
        { name: "Pastel Orange", value: "#FFE5B4" },
        { name: "Pastel Yellow", value: "#FFFFD1" },
        { name: "Pastel Green", value: "#D0F0C0" },
        { name: "Pastel Purple", value: "#E6E6FA" },
        { name: "Pastel Blue", value: "#B4E4FF" },
    ];
  
    useEffect(() => {
        const fetchE = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/note/nget?upId=${incomid}`);
                const data = await res.json();
                console.log("data", data);

                if (!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if (res.ok) {
                    const selectedE = data.find(course => course._id === incomid);
                    console.log(selectedE);
                    if (selectedE) {
                        setFormData({ 
                            title: selectedE.title, 
                            content: selectedE.content || '', 
                            _id: selectedE._id,
                            color: selectedE.color || '#FFE5B4' // Use existing color or default
                        });
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchE();
    }, [incomid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3000/api/note/update/${incomid}`, {
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
                alert("Success");
                navigate("");
            }
        } catch (error) {
            setPublishError("Something went wrong");
        }
    };

    return (
        <div
            className="relative w-full h-[800px] bg-cover bg-center"
            style={{
                backgroundImage:
                    "url(https://firebasestorage.googleapis.com/v0/b/fir-8506f.appspot.com/o/top-view-agenda-glasses-pencil.jpg?alt=media&token=6d98d4f5-3af6-4783-8899-9d27ba93abdc)",
            }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <div className="relative z-10 flex justify-center items-center h-full px-4">
                <div className="overflow-x-auto scrollbar-none lg:h-[600px]">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full space-y-8 opacity-90">

                        <h1 className="text-4xl font-semibold text-center text-white mb-4">
                            Update Your Note
                        </h1>
                        

                        {publishError && (
                            <p className="text-red-500 text-sm text-center">{publishError}</p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title Input */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-lg font-medium text-white mb-2"
                                >
                                    Note Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter the title of your article"
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    value={formData.title}
                                    required
                                />
                            </div>
                            
                            {/* Color Picker Section */}
                            <div className="mb-6">
                              <label className="block text-lg font-medium text-white mb-2">
                                Choose Note Color
                              </label>
                              <div className="flex gap-4">
                                {pastelColors.map((color) => (
                                  <button
                                    key={color.value}
                                    type="button"
                                    className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                                      formData.color === color.value
                                        ? "border-white scale-110"
                                        : "border-transparent hover:scale-105"
                                    }`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                    title={color.name}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Content Section: Rich Text Editor */}
                            <div>
                                <label
                                    htmlFor="content"
                                    className="block text-lg font-medium text-white mb-2"
                                >
                                    Note Content
                                </label>
                                <ReactQuill
                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                    value={formData.content || ''}  
                                    className="w-full p-3 bg-white text-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Write your article content here..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Update Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}