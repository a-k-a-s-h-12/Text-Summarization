const File = require('../models/File');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const OpenAI = require('openai');
const pLimit = require('p-limit').default;


const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});


const readPdfText = async (filePath) => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at path: ${filePath}`);
    }
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
};

const chunkText = (text, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
};

const summarizeChunk = async (chunk) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Groq model
            messages: [
                { role: "system", content: "Summarize this PDF section concisely." },
                { role: "user", content: chunk }
            ],
            max_tokens: 150
        });
        return completion.choices[0].message.content.trim();
    } catch (err) {
        console.error("Error summarizing chunk:", err.message);
        return "";
    }
};

const mergeSummaries = async (summaries) => {
    try {
        const mergedText = summaries.join("\n");
        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Groq model
            messages: [
                { role: "system", content: "Combine these summaries into one concise overall summary." },
                { role: "user", content: mergedText }
            ],
            max_tokens: 300
        });
        return completion.choices[0].message.content.trim();
    } catch (err) {
        console.error("Error merging summaries:", err.message);
        return "";
    }
};


exports.uploadFile = async (req, res) => {
    try {
        const { path, filename } = req.file;
        const { userId } = req.body;

        
        const extractedText = await readPdfText(path);

        
        const chunks = chunkText(extractedText, 1500);

       
        const limit = pLimit(3);
        const summaries = await Promise.all(
            chunks.map(chunk => limit(() => summarizeChunk(chunk)))
        );

        
        let mergedLevel1 = [];
        for (let i = 0; i < summaries.length; i += 5) {
            const group = summaries.slice(i, i + 5);
            const merged = await mergeSummaries(group);
            mergedLevel1.push(merged);
        }

        
        const finalSummary = await mergeSummaries(mergedLevel1);

        const fileDoc = await File.create({
            user: userId,
            filename,
            filepath: path,
            extractedText,
            summary: finalSummary
        });

        res.status(200).json({
            msg: "File uploaded and processed",
            file: fileDoc
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error uploading file" });
    }
};

// Get user files
exports.getUserFiles = async (req, res) => {
    try {
        const userId = req.headers['userid'];
        const files = await File.find({ user: userId });
        res.status(200).json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching files" });
    }
};
