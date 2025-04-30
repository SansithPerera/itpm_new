import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2pdf from 'html2pdf.js';
import { FaArrowLeft, FaEdit, FaTrashAlt, FaDownload, FaStar, FaFilter, FaTimes } from "react-icons/fa";

export default function Notetable() {
  const [Info, setInfo] = useState([]); 
  const [DId, setformId] = useState("");
  const [filter, setfilter] = useState([]);
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [colorFilter, setColorFilter] = useState("");
  const [query, setQuery] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // These should match the colors from BAdd component
  const pastelColors = [
    { name: "Pastel Orange", value: "#FFE5B4" },
    { name: "Pastel Yellow", value: "#FFFFD1" },
    { name: "Pastel Green", value: "#D0F0C0" },
    { name: "Pastel Purple", value: "#E6E6FA" },
    { name: "Pastel Blue", value: "#B4E4FF" },
  ];

  // Add this to the head of your document to ensure list styling works
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .note-content ul { 
        list-style-type: disc !important; 
        padding-left: 20px !important; 
        margin: 10px 0 !important;
      }
      .note-content ol { 
        list-style-type: decimal !important; 
        padding-left: 20px !important; 
        margin: 10px 0 !important;
      }
      .note-content li { 
        display: list-item !important; 
        margin-bottom: 5px !important;
      }
      .color-palette {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
      }
      .color-swatch {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid transparent;
      }
      .color-swatch.active {
        border: 2px solid white;
        transform: scale(1.1);
      }
      .filter-chip {
        display: inline-flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        padding: 6px 12px;
        border-radius: 16px;
        margin-right: 8px;
        margin-bottom: 8px;
        color: white;
      }
      .filter-chip .close {
        margin-left: 6px;
        cursor: pointer;
      }
      .note-card {
        color: black !important;
      }
      .note-card-title {
        color: black !important;
        font-weight: 800 !important; /* Make title bolder */
        font-size: 1.25rem !important; /* Slightly larger font */
      }
      .note-content {
        color: black !important;
      }
      .note-content * {
        color: black !important;
      }
      .favorite-star {
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      .favorite-star:hover {
        transform: scale(1.2);
      }
      .favorite-star.active {
        color: #FFD700 !important;
        text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Function to process content and ensure list formatting works
  const processContent = (content) => {
    if (!content) return '';
    
    // Replace any malformed list markup
    let processed = content
      // Ensure all UL have proper styling
      .replace(/<ul[^>]*>/gi, '<ul style="list-style-type: disc !important; padding-left: 20px !important; margin: 10px 0 !important;">')
      // Ensure all OL have proper styling
      .replace(/<ol[^>]*>/gi, '<ol style="list-style-type: decimal !important; padding-left: 20px !important; margin: 10px 0 !important;">')
      // Ensure all LI have proper styling
      .replace(/<li[^>]*>/gi, '<li style="display: list-item !important; margin-bottom: 5px !important;">');
    
    // Add color styling to ensure text is black
    processed = processed
      .replace(/<p[^>]*>/gi, '<p style="color: black !important;">')
      .replace(/<span[^>]*>/gi, '<span style="color: black !important;">');
    
    return processed;
  };

  useEffect(() => {
    const fetchinfo = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/note/nget`);
        const data = await res.json();
        if (res.ok) {
          // Process content right after fetching
          const processedData = data.map(note => ({
            ...note,
            processedContent: processContent(note.content)
          }));
          setInfo(processedData);
          setfilter(processedData); // Initialize filter with fetched data
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchinfo();
  }, []);

  const generatePDF = (note) => {
    setIsGeneratingPDF(true); // Show loading state
  
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="
        width: 100%; 
        height: 100%; 
        padding: 30px; 
        border: 4px solid black; /* Adds a black outline around the A4 page */
        background-color: white;
        color: black;
      ">
        <h1 style="font-size: 22px; font-weight: bold; margin-bottom: 10px; color: black;">${note.title}</h1>
        <hr style="border: 1px solid black; margin-bottom: 10px;">
        <div class="note-content" style="font-size: 14px; line-height: 1.6; color: black;">
          ${note.processedContent || note.content}
        </div>
      </div>
    `;
  
    html2pdf()
      .from(element)
      .set({
        margin: 10, // Keeps spacing balanced
        filename: `${note.title}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4", compressPDF: true }
      })
      .save()
      .finally(() => setIsGeneratingPDF(false)); // Hide loading state
  };
  
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/note/ddelete/${DId}`,
        {
          method: "DELETE"
        }
      );
      if (res.ok) {
        setInfo((prev) => prev.filter((course) => course._id !== DId));
        setfilter((prev) => prev.filter((course) => course._id !== DId));
        alert("Deleted");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Toggle favorite status - Fixed function to properly update favorite status
  const toggleFavorite = async (noteId, currentFavoriteStatus) => {
    try {
      // First update locally for immediate feedback
      const updatedInfo = Info.map(note => 
        note._id === noteId ? { ...note, favorite: !currentFavoriteStatus } : note
      );
      setInfo(updatedInfo);
      setfilter(prev => prev.map(note => 
        note._id === noteId ? { ...note, favorite: !currentFavoriteStatus } : note
      ));
      
      // Then send update to server
      const res = await fetch(`http://localhost:3000/api/note/update/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorite: !currentFavoriteStatus }),
      });
      
      if (!res.ok) {
        // If server update fails, revert local changes
        setInfo(prev => prev.map(note => 
          note._id === noteId ? { ...note, favorite: currentFavoriteStatus } : note
        ));
        setfilter(prev => prev.map(note => 
          note._id === noteId ? { ...note, favorite: currentFavoriteStatus } : note
        ));
        console.error("Failed to update favorite status");
      }
    } catch (error) {
      console.log(error.message);
      // Revert local changes on error
      setInfo(prev => prev.map(note => 
        note._id === noteId ? { ...note, favorite: currentFavoriteStatus } : note
      ));
      setfilter(prev => prev.map(note => 
        note._id === noteId ? { ...note, favorite: currentFavoriteStatus } : note
      ));
    }
  };

  // Handle regular search filtering
  useEffect(() => {
    applyAllFilters();
  }, [query, Info, favoriteFilter, colorFilter]);

  // Apply all filters at once
  const applyAllFilters = () => {
    let filteredData = [...Info];

    // Apply search query filter
    if (query.trim() !== "") {
      filteredData = filteredData.filter(
        (note) => note.title && note.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply color filter
    if (colorFilter) {
      filteredData = filteredData.filter(note => note.color === colorFilter);
    }

    // Apply favorite filter
    if (favoriteFilter) {
      filteredData = filteredData.filter(note => note.favorite === true);
    }

    setfilter(filteredData);
  };

  // Reset all filters
  const resetFilters = () => {
    setQuery("");
    setColorFilter("");
    setFavoriteFilter(false);
    setShowAdvancedFilters(false);
  };

  // Get color name by hex value
  const getColorName = (hexValue) => {
    const color = pastelColors.find(c => c.value === hexValue);
    return color ? color.name : hexValue;
  };

  return (
    <div className="h-[800px] relative bg-cover bg-center" style={{
      backgroundImage: "url(https://firebasestorage.googleapis.com/v0/b/fir-8506f.appspot.com/o/top-view-agenda-glasses-pencil.jpg?alt=media&token=6d98d4f5-3af6-4783-8899-9d27ba93abdc)"
    }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {isGeneratingPDF && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="text-lg">Downloading PDF...</p>
          </div>
        </div>
      )}

      <div className="items-center justify-center flex relative z-10">
        <div className="items-center mt-10 w-full max-w-6xl px-4">
          <div className="flex justify-center mt-4">
            <input
              type="text"
              placeholder="Search Note..."
              value={query}
              className="w-[400px] h-12 rounded-full bg-black shadow-xl border border-slate-400 bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="ml-2 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-700 transition-all duration-300"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FaFilter className="text-xl" />
            </button>
            {/* Quick favorite filter button */}
            <button
              className={`ml-2 ${favoriteFilter ? 'bg-yellow-500' : 'bg-gray-600'} text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-yellow-600 transition-all duration-300`}
              onClick={() => setFavoriteFilter(!favoriteFilter)}
              title={favoriteFilter ? "Clear favorite filter" : "Show favorites only"}
            >
              <FaStar className="text-xl" />
            </button>
          </div>

          {/* Advanced Filters Panel - Reduced size */}
          {showAdvancedFilters && (
            <div className="mt-4 p-4 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg max-w-md mx-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white text-base font-semibold">Advanced Filters</h3>
                <button 
                  onClick={resetFilters}
                  className="text-white hover:underline text-xs"
                >
                  Reset All Filters
                </button>
              </div>
              
              {/* Color Filter */}
              <div className="mb-3">
                <p className="text-white text-sm mb-1">Filter by Color:</p>
                <div className="color-palette">
                  {pastelColors.map((color) => (
                    <div 
                      key={color.value}
                      className={`color-swatch ${colorFilter === color.value ? 'active' : ''}`}
                      style={{ backgroundColor: color.value }} 
                      onClick={() => setColorFilter(colorFilter === color.value ? "" : color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              {/* Favorite Filter */}
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="favoriteFilter"
                  checked={favoriteFilter}
                  onChange={() => setFavoriteFilter(!favoriteFilter)}
                  className="h-4 w-4 text-yellow-500"
                />
                <label htmlFor="favoriteFilter" className="ml-2 text-white text-sm">
                  Show only favorite notes
                </label>
              </div>
              
              {/* Active Filters Display */}
              {(colorFilter || favoriteFilter) && (
                <div className="mt-1">
                  <p className="text-white text-xs mb-1">Active filters:</p>
                  <div className="flex flex-wrap">
                    {colorFilter && (
                      <div className="filter-chip text-xs">
                        {getColorName(colorFilter)}
                        <span className="close" onClick={() => setColorFilter("")}>
                          <FaTimes size={10} />
                        </span>
                      </div>
                    )}
                    {favoriteFilter && (
                      <div className="filter-chip text-xs">
                        Favorites
                        <span className="close" onClick={() => setFavoriteFilter(false)}>
                          <FaTimes size={10} />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <Link to={`/dashboard/note`}>
              <button className="mt-4 bg-blue-600 font-serif text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                New Note
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto scrollbar-none lg:h-[500px] mt-6">
            <div className="lg:w-[1200px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filter && filter.length > 0 ? (
                filter.map((note) => (
                  <div key={note._id} 
                    className="note-card rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col relative" 
                    style={{ backgroundColor: note.color || '#ffffff' }}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="note-card-title font-bold text-xl break-words">{note.title}</div>
                      {/* Enhanced favorite star with better visual feedback */}
                      <div 
                        className={`favorite-star ${note.favorite ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(note._id, note.favorite);
                        }}
                        title={note.favorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <FaStar 
                          className={`text-2xl ${note.favorite ? "text-yellow-500" : "text-gray-400"}`}
                        />
                      </div>
                    </div>
                    
                    <div 
                      className="mt-2 text-sm break-words note-content" 
                      dangerouslySetInnerHTML={{ 
                        __html: note.processedContent || processContent(note.content) 
                      }}
                    />
                    
                    <div className="flex mt-4 gap-4 justify-center">
                      <Link to={`/dashboard/iupdate/${note._id}`}>
                        <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300">
                          <FaEdit className="text-lg" />
                        </button>
                      </Link>
                      <button onClick={() => {
                          setformId(note._id);
                          handleDeleteUser();
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300">
                        <FaTrashAlt className="text-lg" />
                      </button>
                      <button 
                        onClick={() => generatePDF(note)}
                        disabled={isGeneratingPDF}
                        className={`${isGeneratingPDF ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded-lg shadow-md transition duration-300`}>
                        <FaDownload className="text-lg" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-white py-4">
                  No notes found matching your filters
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}