const axios = require('axios');
const Analysis = require('../models/Analysis');

exports.analyzeResume = async (req, res) => {
    console.log("Request to analyze resume");

    try {
        const { jobDescription, promptType, resumeContent } = req.body;

        if (!jobDescription || !promptType || !resumeContent) {
            return res.status(400).json({ message: "Job description, prompt type, and resume content are required" });
        }

        console.log("Job Description:", jobDescription);
        console.log("Prompt Type:", promptType);
        console.log("Resume Content:", resumeContent);

        // 👇 Ensure you are using the correct API URL
        const apiUrl = 'https://resume-analyzer-o0gd.onrender.com/analyze-resume/';

        // 👇 Make the POST request with proper headers
        const response = await axios.post(apiUrl, {
            jobDescription,
            promptType,
            resumeContent
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // 👇 Save analysis to your DB (optional)
        const analysis = await Analysis.create({
            user: req.user._id,  // make sure req.user exists
            jobDescription,
            resumeContent,
            response: response.data.response
        });
        
        res.json({
            message: 'Resume analyzed successfully!',
            data: analysis
        });

    } catch (error) {
        console.error("❌ Analyze resume error:", error.message);

        if (error.response) {
            console.error("Response data:", error.response.data);
            res.status(error.response.status).json({ message: "Resume analysis failed", error: error.response.data });
        } else if (error.request) {
            console.error("No response received:", error.request);
            res.status(500).json({ message: "No response from the analysis service" });
        } else {
            console.error("Request setup error:", error.message);
            res.status(500).json({ message: "Resume analysis failed", error: error.message });
        }
    }
};
