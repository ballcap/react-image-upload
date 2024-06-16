// src/components/PostImage/PostImage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PostImage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchUploadedImages();
    }, []);

    const fetchUploadedImages = async () => {
        try {
            const response = await axios.get('http://192.168.10.108:5000/api/files');
            setUploadedImages(response.data);
        } catch (error) {
            console.error('Error fetching uploaded images:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setUploading(true);
            const response = await axios.post('http://192.168.10.108:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadedImages([...uploadedImages, response.data.url]);
            alert('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <input type="submit" value="POST" disabled={uploading} />
            </form>
            {preview && (
                <div>
                    <h3>Image Preview:</h3>
                    <img src={preview} alt="Selected" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                </div>
            )}
            <div>
                <h3>Uploaded Images:</h3>
                {uploadedImages.map((image, index) => (
                    <img key={index} src={`http://localhost:5000${image}`} alt={`Uploaded ${index}`} style={{ maxWidth: '100%', maxHeight: '400px' }} />
                ))}
            </div>
        </div>
    );
}