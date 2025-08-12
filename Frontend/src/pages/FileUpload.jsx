
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
            Authorization: `Bearer ${token}`
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

      await axios.post("http://localhost:5000/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      const updated = await axios.get("http://localhost:5000/file/my-files", {
        headers: {
          userid: userID,
          Authorization: `Bearer ${token}`
        },
      });
      setFiles(updated.data);

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
      state: { userID, fileID: selectedFileId }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 w-full lg:w-64 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 uppercase tracking-wider border-b border-gray-700 pb-3">
          My Files
        </h2>
        <ul className="space-y-2 max-h-[40vh] lg:max-h-[70vh] overflow-y-auto">
          {files.length > 0 ? (
            files.map((file) => (
              <li
                key={file._id}
                className={`p-3 rounded-lg cursor-pointer transition text-sm sm:text-base ${
                  selectedFileId === file._id
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
            <p className="text-gray-400 italic text-sm">No files uploaded yet</p>
          )}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-lg sm:text-2xl font-semibold mb-4 uppercase tracking-wider">
            Upload PDF
          </h2>
          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="block text-base sm:text-lg mb-3 font-semibold uppercase tracking-wider">
                Select PDF File
              </label>
              <div className="relative border-2 border-dashed border-gray-500 rounded-2xl hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="py-6 sm:py-8 text-center">
                  <p className="text-gray-400 text-sm sm:text-lg">
                    {file ? file.name : "Click to choose a file"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all font-mono ${
                uploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-indigo-700 hover:bg-indigo-600"
              }`}
            >
              {uploading ? "Processing..." : "Generate Summary"}
            </button>

            {error && (
              <div className="p-3 rounded-lg bg-red-900/50 border border-red-700 text-sm">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 flex flex-col">
          <h2 className="text-lg sm:text-2xl font-semibold mb-4 uppercase tracking-wider">
            Summary
          </h2>
          {selectedSummary ? (
            <>
              <div className="flex-1 overflow-y-auto max-h-[50vh] sm:max-h-none">
                <div className="bg-gray-900/50 p-4 sm:p-6 rounded-xl border border-gray-700">
                  <p className="text-sm sm:text-lg leading-relaxed text-gray-200 whitespace-pre-line font-mono">
                    {selectedSummary}
                  </p>
                </div>
                <button
                  onClick={handleQuestionAndAnswer}
                  className="mt-4 px-5 sm:px-6 py-2 sm:py-3 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 ease-in-out uppercase tracking-wider text-sm sm:text-base"
                >
                  Q & A
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <p className="text-sm sm:text-xl text-gray-400 uppercase tracking-wider">
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
