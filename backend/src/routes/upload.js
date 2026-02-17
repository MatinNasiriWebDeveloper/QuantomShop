const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// اطمینان از وجود پوشه uploads
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// تنظیمات ذخیره‌سازی
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// فیلتر نوع فایل
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('فرمت فایل باید jpeg، jpg، png، webp یا gif باشد'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Route آپلود عکس
router.post('/avatar', upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'فایلی انتخاب نشده است' 
      });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('❌ خطا در آپلود:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Route آپلود چندین فایل (اختیاری)
router.post('/multiple', upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'فایلی انتخاب نشده است' 
      });
    }
    
    const files = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename
    }));
    
    res.json({
      success: true,
      files
    });
  } catch (error) {
    console.error('❌ خطا در آپلود چندگانه:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;