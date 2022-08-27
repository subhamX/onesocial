


import { Router } from 'express'
import multer from 'multer'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
import { Readable } from 'stream'
import path from 'path'
import { parseCookiesToObject } from '../utils/parseCookies'
import jwt from 'jsonwebtoken'
import { ApolloContext } from '../types/ApolloContext'
import {  jwtUserPayloadType } from "@onesocial/shared";
import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import { listingBuyModelRepository, listingModelRepository, listingProductItemModelRepository, ListingType } from '@onesocial/shared'

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



// currently no auth
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

app.post('/add_listing_product_items', upload.array('images', 10), async function (req, res, next) {
    try {
        const listingId = req.body.listing_id // must be for a product listing
        if (!listingId) throw new Error('No listing id')
        if (!req.files?.length) throw new Error('No files')

        const cookieObj = parseCookiesToObject(req.headers.cookie ?? "")
        const token = cookieObj['oneSocialKeeper']

        const user: ApolloContext['user'] = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET ?? "") as any;

        // the user can add to a digital product, only if he/she is the owner
        const listing = await listingModelRepository.fetch(listingId)
        if (listing.author_id !== user?.id) throw new Error('You are not the owner of this listing')
        if (listing.listing_type !== ListingType.DigitalProduct) throw new Error('This listing is not a digital product')
        if (listing.number_of_product_items >= 10) throw new Error('You can only add 10 product items to a digital product. Try uploading a zip instead.')

        // upload it

        const len = req.files?.length ?? 0;

        const filesResponse = []

        for (let i = 0; i < len; i++) {
            const file = (req.files as any)[i] as Express.Multer.File;

            const instance = listingProductItemModelRepository.createEntity({
                listing_id: listingId,
                name: file.originalname,
                description: '',
                owner_id: user.id,
            })

            const id = instance.entityId

            const passthroughStream = Readable.from(file.buffer);

            await uploadFileFromStream(passthroughStream, id)

            filesResponse.push({
                id,
                name: file.originalname,
                description: ''
            })

            // store it in redis
            await listingProductItemModelRepository.save(instance)
        }

        // create an instance
        listing.number_of_product_items += filesResponse.length;
        await listingModelRepository.save(listing)

        res.send({
            error: false,
            data: filesResponse
        })
    } catch (err: any) {
        res.send({
            error: true,
            message: err.message
        })
    }

})

app.get('/getProduct/:buyInstanceId/:productItemId', async (req, res) => {
    try {
        const cookieObj = parseCookiesToObject(req.headers.cookie ?? "")
        const token = cookieObj['oneSocialKeeper']

        const user: jwtUserPayloadType = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET ?? "") as any;

        const buyInstanceId = req.params.buyInstanceId
        const productItemId = req.params.productItemId

        console.log(buyInstanceId, productItemId)

        const instance = await listingBuyModelRepository.fetch(buyInstanceId)
        if (!instance || instance.buyer_id !== user.id) throw new Error('You are not the owner of this listing')

        const productItem = await listingProductItemModelRepository.fetch(productItemId)
        if (!productItem || productItem.listing_id !== instance.listing_id) throw new Error('Invalid productId or this product item does not belong to this listing')


        const credsJson = fs.readFileSync(path.resolve(__dirname, '..', '..', 'gcloud-service-account-key.json'), { encoding: 'utf-8' })
        const storage = new Storage({
            credentials: JSON.parse(credsJson),
        })

        const myBucket = storage.bucket(process.env.GCLOUD_BUCKET_NAME ?? "");

        const [url]=await myBucket.file(productItemId).getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000 * 24, // 1 day
        })


        res.redirect(url)
    } catch (err) {
        res.send({
            error: true,
            message: err.message
        })
    }


})


export default app;



export const uploadFileToPublicStorage = async (url: string) => {
    const response = await uploadDriver.uploader.upload(url, {
        unique_filename: true
    })

    return response.secure_url
}


// It throws an error incase of error, else return 0
const uploadFileFromStream = async (readableInstance: Readable, uniqueFileName: string) => {
    const credsJson = fs.readFileSync(path.resolve(__dirname, '..', '..', 'gcloud-service-account-key.json'), { encoding: 'utf-8' })
    const storage = new Storage({
        credentials: JSON.parse(credsJson),
    })

    const myBucket = storage.bucket(process.env.GCLOUD_BUCKET_NAME ?? "");

    const gcsFile = myBucket.file(uniqueFileName)

    return await new Promise<number>((res, rej) => {
        const writeStream = gcsFile.createWriteStream();
        readableInstance.pipe(writeStream).on('finish', () => {
            res(0)
        }).on('error', err => {
            rej(err)
        });
    })
}
