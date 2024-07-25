import express from 'express';
import upload from '../middlewares/multer.js'; // Import multer configuration
import cloudinary from '../cloudinary.js'; // Import cloudinary configuration
import fs from 'fs';
import adminAuth from '../middlewares/authAdmin.js';
import auth from '../middlewares/authUser.js';
import { Food } from '../models/food.model.js';

const router = express.Router();

router.post('/insertfood', adminAuth, upload.single('foodImage'), async (req, res) => {
    console.log(req.file);
    if (!req.file) return res.status(400).json("No file uploaded");
    if (req.file.size > 1000000) return res.status(400).json("File size too large");
    if(!req.body.foodName || !req.body.foodPrice || !req.body.foodDescription) return res.status(400).json("Please fill all the required fields");
    cloudinary.uploader.upload(req.file.path, async (error, result) => {
        
        // console.log(result.url);
        const food = await new Food({
            foodImage: result.url,
            foodName: req.body.foodName,
            foodPrice: req.body.foodPrice,
            foodDescription: req.body.foodDescription
        });
        await food.save();
        // console.log(food);
        // Optionally, delete the file from the server after upload to Cloudinary
        fs.unlinkSync(req.file.path);

        res.send(result);
    });
});
router.post("/remove_food",adminAuth, async (req, res) => {
    console.log(req.body);
    const { id } = req.body;
    const item = await Food.deleteOne({ _id: id });
    console.log(item);
    res.status(200).json("Food item deleted successfully");
})
router.get('/getfood', auth, async (req, res) => {
    const data = await Food.find({});
    
    res.status(200).json({
        status: 200,
        message: "Data fetched successfully",
        data
    });
});

export default router