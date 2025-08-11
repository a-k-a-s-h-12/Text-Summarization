// controllers/qnaController.js
const File = require('../models/File');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

exports.askQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        const userId = req.headers['userid'];
        const fileId = req.headers['fileid'];

        if (!question || !userId || !fileId) {
            return res.status(400).json({ msg: "Missing question, userId, or fileId" });
        }

        const fileDoc = await File.findOne({ _id: fileId, user: userId });
        if (!fileDoc) {
            return res.status(404).json({ msg: "File not found" });
        }

        // Prefer summary, else fallback to extracted text
        let context = fileDoc.summary || fileDoc.extractedText || "";
        if (!context) {
            return res.status(400).json({ msg: "No text available for Q&A" });
        }

        // Trim context to avoid token limit (approx. 3k chars ≈ 1k tokens)
        const MAX_CHARS = 3000;
        if (context.length > MAX_CHARS) {
            context = context.slice(0, MAX_CHARS) + "...";
        }

        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant. Answer questions based only on the provided text."
                },
                {
                    role: "user",
                    content: `Text:\n${context}\n\nQuestion: ${question}`
                }
            ],
            max_tokens: 300
        });

        const answer = completion.choices[0]?.message?.content?.trim() || "No answer found.";
        res.status(200).json({ answer });

    } catch (error) {
        console.error("Error in Q&A:", error.message);
        res.status(500).json({ msg: "Error processing question" });
    }
};
