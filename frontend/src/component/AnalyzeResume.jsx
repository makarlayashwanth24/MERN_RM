import React, { useState } from 'react';
import axios from 'axios';

const AnalyzeResume = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [resumeContent, setResumeContent] = useState('');
    const [promptType, setPromptType] = useState('review');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const result = await axios.post(`${import.meta.env.VITE_API_URL}/analyze-resume`, {
                jobDescription,
                promptType,
                resumeContent,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResponse(result.data.response);
            setError('');
        } catch (error) {
            console.error('Error analyzing resume:', error);
            setError('Failed to analyze resume. Please try again.');
            setResponse('');
        }
    };

    return (
        <div className="container mt-5">
            <div className="form-container">
                <h2>Analyze Resume</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Job Description</label>
                        <textarea
                            className="form-control"
                            rows="5"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Resume Content</label>
                        <textarea
                            className="form-control"
                            rows="10"
                            value={resumeContent}
                            onChange={(e) => setResumeContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Prompt Type</label>
                        <select
                            className="form-control"
                            value={promptType}
                            onChange={(e) => setPromptType(e.target.value)}
                        >
                            <option value="review">Review Resume</option>
                            <option value="improve">Improve Resume</option>
                            <option value="keywords">Identify Missing Keywords</option>
                            <option value="match">Match Percentage</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Analyze</button>
                </form>
                {error && (
                    <div className="alert alert-danger mt-3">
                        {error}
                    </div>
                )}
                {response && (
                    <div className="analysis-result mt-3">
                        <h3>Analysis Result</h3>
                        <pre>{response}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyzeResume;