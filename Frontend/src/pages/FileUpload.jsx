// src/components/FileUpload.jsx
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [userID, setUserID] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState("");
  const [selectedFileId, setSelectedFileId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem("userID"); 
        const token = localStorage.getItem("token"); 
        setUserID(id);

        const res = await axios.get("http://localhost:5000/file/my-files", {
          headers: {
            userid: id, 
            Authorization: `Bearer ${token}` // send JWT for auth
          },
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
    console.log(e.target.files[0]);
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
      const token = localStorage.getItem("token");

      const res = await axios.post("http://localhost:5000/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` // JWT token
        },
      });
      // console.log(res.data);

      // Refresh files list after upload
      const updated = await axios.get("http://localhost:5000/file/my-files", {
        headers: {
          userid: userID,
          Authorization: `Bearer ${token}`
        },
      });
      setFiles(updated.data);

      // Select the newly uploaded file
      if (updated.data.length > 0) {
        handleFileSelect(updated.data[updated.data.length - 1]);
      }

    } catch (err) {
      setError(err.response?.data?.msg || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedSummary(file.summary);
    setSelectedFileId(file._id);
  };

  const handleQuestionAndAnswer = () => {
    navigate("/questionAndAnswer", {
      state: {
        userID: userID,
        fileID: selectedFileId
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 mr-8 flex-shrink-0 h-fit">
        <h2 className="text-xl font-semibold mb-6 uppercase tracking-wider border-b border-gray-700 pb-3">
          My Files
        </h2>
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
          {files.length > 0 ? (
            files.map((file) => (
              <li
                key={file._id}
                className={`p-3 rounded-lg cursor-pointer transition ${selectedFileId === file._id
                  ? "bg-indigo-600 font-medium"
                  : "hover:bg-gray-700"
                  }`}
                onClick={() => handleFileSelect(file)}
              >
                <div className="truncate">{file.filename}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(file.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400 italic">No files uploaded yet</p>
          )}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 uppercase tracking-wider">
            Upload PDF
          </h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-lg mb-3 font-semibold uppercase tracking-wider">
                Select PDF File
              </label>
              <div className="relative border-2 border-dashed border-gray-500 rounded-2xl hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="py-8 text-center">
                  <p className="text-gray-400 text-lg">
                    {file ? file.name : "Click to choose a file"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all font-mono  ${uploading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-700 hover:bg-indigo-600"
                }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Generate Summary"
              )}
            </button>

            {error && (
              <div className="p-3 rounded-lg bg-red-900/50 border border-red-700">
                <p className="text-red-100">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700 flex flex-col">
          <h2 className="text-2xl font-semibold mb-6 uppercase tracking-wider">
            Summary
          </h2>
          {selectedSummary ? (
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <p className="text-lg leading-relaxed text-gray-200 whitespace-pre-line font-mono">
                    {selectedSummary}
                  </p>
                </div>

                <button
                  onClick={handleQuestionAndAnswer}
                  className="mt-3 ml-2 px-6 py-3 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 ease-in-out uppercase tracking-wider"
                >
                  Q & A
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <p className="text-xl text-gray-400 uppercase tracking-wider">
                {files.length > 0
                  ? "Select a file to view its summary"
                  : "Upload a file to generate a summary"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
