const express = require('express');
const multer = require('multer');
const { uploadFile, getUserFiles } = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router();

// Ensure uploads folder exists
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/upload',authMiddleware, upload.single('pdf'), uploadFile);
router.get('/my-files', authMiddleware, getUserFiles);

module.exports = router;
