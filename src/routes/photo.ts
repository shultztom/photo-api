import express, { Request, Response } from 'express';
const router = express.Router();

import AWS from "aws-sdk";
import {get} from 'lodash';

import photoModel from '../models/photo';

// S3 Config
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: "us-east-1"
})


// Route Handlers
const getAllPhotos = async (req: Request, res: Response) => {
    try {
        const results = await photoModel.find();
        return res.status(200).json(results);
    } catch (e: any) {
        console.log(e.message);
        return res.status(500).send('ERROR: Issue getting all photos');
    }
}

const uploadPhoto = async (req: Request, res: Response) => {
    // TODO validate

    const {owner, label} = req.body; // todo take more than one label
    const photo = get(req, 'files.photo', null);

    const params = {
        Bucket: process.env.S3_BUCKET_NAME || "",
        Key: photo.name + Date.now(),
        Body: photo.data,
        ContentType: photo.mimetype
    };

    try {
        // Save to s3
        const stored = await s3.upload(params).promise();

        // Save to DB
        const results = await photoModel.create({
            photo: stored.Location,
            photoKey: stored.Key,
            owner: owner,
            label: [label]
        })

        return res.status(200).json(results);
    } catch (e: any) {
        console.log(e.message);
        return res.status(500).send('ERROR: Issue uploading photo');
    }
}

// Map Routes
router.get("/", getAllPhotos);
router.post("/", uploadPhoto);

export default router;