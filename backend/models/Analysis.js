const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    jobDescription: { type: String, required: true },
    resumeContent: { type: String, required: true },
    response: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analysis", AnalysisSchema);