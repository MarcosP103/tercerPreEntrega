import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/profile')
        } else {
            cb(null, 'uploads/documents')
        }
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, `${file.fieldname}-${Date.now()}${ext}`)
    }
})

const upload = multer({ storage: storage })

export default upload