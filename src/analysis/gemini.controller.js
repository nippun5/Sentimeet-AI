const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateTasksFromTranscript = async (req, res) => {
    try {
        const { transcript } = req.body;

        if (!transcript || typeof transcript !== "string") {
            return res.status(400).json({ error: "transcript (string) is required" });
        }

        const prompt = `
Extract tasks and deadlines from the following meeting transcript. 
Return only valid JSON. Do NOT include any markdown or code blocks like \`\`\`. 
Use the format: 
[
  {
    "assignee": "Name",
    "task": "Task description",
    "deadline": "Due date"
  }
]

Transcript:
${transcript}
        `.trim();

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean code block formatting if Gemini returns it anyway
        text = text.replace(/```json|```/g, "").trim();

        // Parse and return as JSON
        const tasks = JSON.parse(text);
        return res.json({ tasks });
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        return res.status(500).json({ error: "Failed to process the request" });
    }
};

module.exports = {
    generateTasksFromTranscript,
};
