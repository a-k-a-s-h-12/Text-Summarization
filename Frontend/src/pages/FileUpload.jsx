import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [userID, setUserID] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem("userID");
        if (!id) {
          setError("Please log in first");
          return;
        }
        setUserID(id);

        const res = await axios.get("https://text-summarization-backend.onrender.com/file/my-files", {
          headers: { userid: id },
        });

        setFiles(res.data);
      } catch (error) {
        console.error("Error fetching files:", error);
        setError("Failed to load files");
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }
    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("userId", userID);

    try {
      const res = await axios.post("http://localhost:5000/file/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = await axios.get("http://localhost:5000/file/my-files", {
        headers: { userid: userID },
      });
      setFiles(updated.data);

    } catch (err) {
      setError(err.response?.data?.msg || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile: Stacked layout */}
        <div className="lg:hidden space-y-6">
          {/* My Files - Top on mobile */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider">My Files</h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {files.length > 0 ? (
                files.map((file) => (
                  <li
                    key={file._id}
                    className="cursor-pointer p-2 rounded hover:bg-gray-700 transition text-sm"
                    onClick={() => setSelectedSummary(file.summary)}
                  >
                    {file.filename}
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No files uploaded yet</p>
              )}
            </ul>
          </div>

          {/* File Upload - Middle on mobile */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider">Upload PDF</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 font-medium uppercase">Select PDF File</label>
                <div className="relative border-2 border-dashed border-gray-500 rounded-xl hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="py-6 text-center">
                    <p className="text-gray-400 text-sm">
                      {file ? file.name : "Choose a file"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                  uploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-600'
                }`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Generate Summary"}
              </button>

              {error && (
                <div className="p-2 rounded-lg bg-red-900/50 border border-red-700">
                  <p className="text-xs text-red-100">{error}</p>
                </div>
              )}
            </form>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider">Summary</h2>
            {selectedSummary ? (
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 max-h-60 overflow-y-auto">
                <p className="text-sm text-gray-200 whitespace-pre-line">
                  {selectedSummary}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-400 text-sm">Select a file to view summary</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop: 3-column layout */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {/* My Files - Left column */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider">My Files</h2>
            <ul className="space-y-2 h-[500px] overflow-y-auto">
              {files.length > 0 ? (
                files.map((file) => (
                  <li
                    key={file._id}
                    className="cursor-pointer p-2 rounded hover:bg-gray-700 transition text-sm"
                    onClick={() => setSelectedSummary(file.summary)}
                  >
                    {file.filename}
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No files uploaded yet</p>
              )}
            </ul>
          </div>

          
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider">Upload PDF</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 font-medium uppercase">Select PDF File</label>
                <div className="relative border-2 border-dashed border-gray-500 rounded-xl hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="py-12 text-center">
                    <p className="text-gray-400 text-sm">
                      {file ? file.name : "Drag & drop or click to select"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                  uploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-600'
                }`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Generate Summary"}
              </button>

              {error && (
                <div className="p-2 rounded-lg bg-red-900/50 border border-red-700">
                  <p className="text-xs text-red-100">{error}</p>
                </div>
              )}
            </form>
          </div>

          
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider">Summary</h2>
            {selectedSummary ? (
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 h-[500px] overflow-y-auto">
                <p className="text-sm text-gray-200 whitespace-pre-line">
                  {selectedSummary}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[500px]">
                <p className="text-gray-400 text-sm">Select a file to view summary</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
