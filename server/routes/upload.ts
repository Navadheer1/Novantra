import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

// Cloudinary config uses CLOUDINARY_URL from env by default
// No explicit config needed if URL is set, but we can call config to be safe:
cloudinary.config(true); // reads CLOUDINARY_URL

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder and resource type based on file
    let folder = 'noventra/misc';
    let resource_type = 'auto';

    if (file.mimetype.startsWith('image/')) {
      folder = 'noventra/images';
    } else if (file.mimetype === 'application/pdf') {
      folder = 'noventra/documents';
      resource_type = 'raw'; // PDF works best as 'raw' or 'image' but usually raw for documents
    }

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9]/g, '_')}`,
    };
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/', ClerkExpressRequireAuth({}), upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // req.file.path contains the secure Cloudinary URL
    res.status(200).json({
      url: req.file.path,
      format: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;
