import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function QuestionAndAnswer() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userID, fileID, filename } = location.state || {};

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAsk = async () => {
        if (!question.trim()) {
            setError("Please enter a question");
            return;
        }
        setError("");
        setLoading(true);

        try {
            // Retrieve JWT token from localStorage (set after login)
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication required. Please log in again.");
                navigate("/login");
                return;
            }

            const res = await axios.post(
                "https://text-summarization-backend.onrender.com/getquestionAndAnswer/questionAndAnswers",
                { question },
                {
                    headers: {
                        userid: userID,
                        fileid: fileID,
                        Authorization: `Bearer ${token}`, // ✅ JWT added
                    },
                }
            );

            setAnswer(res.data.answer);
        } catch (err) {
            setError(err.response?.data?.msg || "Error getting answer");
            console.error("Error fetching answer:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!userID || !fileID) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-mono">
                <div className="bg-gray-800 p-8 rounded-xl max-w-2xl text-center border border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-red-400">Error</h2>
                    <p className="mb-6">File information not found</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Summary
                </button>

                <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
                    <h1 className="text-3xl font-bold mb-2">{filename || "Document Q&A"}</h1>
                    <div className="mb-6 flex items-center text-gray-400">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ask questions about this document
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-lg mb-3 font-semibold uppercase tracking-wider">
                                Your Question
                            </label>
                            <textarea
                                className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-gray-400"
                                placeholder="What would you like to know about this document?"
                                rows="4"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-900/50 border border-red-700">
                                <p className="text-red-100">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleAsk}
                            disabled={loading}
                            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                                loading ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-700 hover:bg-indigo-600 hover:shadow-md"
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Ask Question"
                            )}
                        </button>

                        {answer && (
                            <div className="mt-6">
                                <div className="flex items-center text-lg font-semibold mb-3 text-indigo-400">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Answer
                                </div>
                                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 whitespace-pre-line">
                                    {answer}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
