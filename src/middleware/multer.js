import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir;

        if (file.mimetype.startsWith('image/')) {
            dir = 'src/uploads/profile';
        } else {
            dir = 'src/uploads/documents';
        }

        // Verifica si el directorio existe sino lo crea
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

const upload = multer({ storage: storage });

export default upload;
