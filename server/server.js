// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Ensure directories exist
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.static('public')); // Serve static files from 'public' directory

// Multer setup for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Endpoint for file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (req.file) {
            res.json({ url: `/uploads/${req.file.filename}` });
        } else {
            throw new Error('File upload failed');
        }
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to list all uploaded files
app.get('/api/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading upload directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const fileUrls = files.map(file => `/uploads/${file}`);
        res.json(fileUrls);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
