


import { Router } from 'express'
import multer from 'multer'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
import { Readable } from 'stream'
import path from 'path'


dotenv.config()

const uploadDriver = cloudinary.v2;

const upload = multer({
    fileFilter: function (req, file, callback) {

        callback(null, true)
    },
})
const app = Router()

uploadDriver.config({
    cloud_name: 'onesocial',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// currently no 
app.post('/upload_single_image', upload.single('image'), async function (req, res, next) {

    try {
        if (!req.file) {
            throw new Error("No file")
        }
        var ext = path.extname(req.file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            throw new Error('Only images of type png, jpg, gif, jpeg are allowed')
        }



        const val: any = await new Promise((resolve, reject) => {
            const cloudinaryStream = uploadDriver.uploader.upload_stream({}, (error: any, result: any) => {

                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            })
            const stream = Readable.from((req as any).file.buffer);
            stream.pipe(cloudinaryStream)
        })

        return res.send({
            error: false,
            url: val.secure_url
        })
    } catch (err) {
        return res.send({
            error: true,
            message: err.message
        })
    }
})


export default app;
