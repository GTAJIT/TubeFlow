import React, {useState } from "react";
import "../styles/uploadVideo.css";
import api from "../services/api";

function UploadVideo() {
    
    const [videoDetails, setVideoDetails] = useState({
        title: "",
        description: ""
    })
    const [file, setFile] = useState({
        video: null,
        thumbnail: null
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const [publish, setPublish] = useState(false)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target
        setVideoDetails({
            ...videoDetails,
            [name]: value
        })
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const {name, files} = e.target
        if(!files) return;
        setFile({
            ...file,
            [name]: files[0]
        })
    }
    const togglePublish = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked
        setPublish(value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(""); // Clear previous success message
        setError("");   // Clear previous error message
    
        const formData = new FormData();
        formData.append("title", videoDetails.title);
        formData.append("description", videoDetails.description);
        
        if (file.video) formData.append("video", file.video);
        if (file.thumbnail) formData.append("thumbnail", file.thumbnail);
    
        try {
            const response = await api.post('/video/upload-video', formData);
            
            if (response.data && response.data.message) {
                setSuccess("Upload Successful");
                // Optionally reset file inputs or videoDetails
                setFile({ video: null, thumbnail: null }); // Reset file state if needed
                setVideoDetails({ title: '', description: '' }); // Reset video details if needed
            } else {
                setError("Error uploading");
            }
            if (publish && response.data?.message?.id) {
                const togglePublish = await api.post(`/video/toggle-publish-status/${response.data.message.id}`);
                console.log("Publish toggled:", togglePublish.data);
            } else {
                console.log("Video not published.");
            }
            
        } catch (error) {
            console.error("Upload error:", error);
            // Set a more descriptive error message
            //@ts-ignore
            setError(error.response?.data?.message || "An error occurred during upload");
        } finally {
            setLoading(false); // Ensure loading is set to false after the operation
        }
    };
    
    return (
        <div className="container">
          <form className="upload-form" onSubmit={handleSubmit}>
            <h1>Upload a video</h1>
            <label className="label">Title:</label>
            <input type="text" name="title" className="input" onChange={handleChange} />
      
            <label className="label">Description:</label>
            <input type="text" name="description" className="input" onChange={handleChange} />
      
            <label className="label">Upload video:</label>
            <input type="file" name="video" className="input" onChange={handleFileChange} />
      
            <label className="label">Upload thumbnail:</label>
            <input type="file" name="thumbnail" className="input" onChange={handleFileChange} />
      
            <div className="toggle-container">
              <label className="toggle-label">Publish</label>
              <input type="checkbox" id="publish-toggle" className="toggle-input" onChange={togglePublish} />
              <label htmlFor="publish-toggle" className="toggle-slider"></label>
            </div>
      
            <button type="submit" className="button">Post</button>
          {loading ? <p>Loading.....</p> : ""}
          {success ? <p className={`message success-message`}>{success}</p> : ""}
          {error ? <p className={`message error-message`}>{error}</p> : ""}
          </form>
        </div>
      );
}      
  

export default UploadVideo;
