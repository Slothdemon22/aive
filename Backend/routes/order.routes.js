import express from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/order.model.js';
import { Food } from '../models/food.model.js';
import User from '../models/user.model.js';
import auth from '../middlewares/authUser.js';
import authAdmin from '../middlewares/authAdmin.js';

const router = express.Router();

router.post('/place_order', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({   
                status: 400,
                message: "Please provide all the required fields",
            });
        }

        // Ensure req.user is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.user)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid user ID",
            });
        }

        // Find the food item
        const item = await Food.findById(productId);
        if (!item) {
            return res.status(404).json({
                status: 404,
                message: "Food item not found",
            });
        }

        // Create a new order
        const newOrder = new Order({
            foodItem: item._id,
            quantity,
            placedBy: req.user
        });

        // Save the order
        await newOrder.save();

        // Update the user
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        user.orders.push(newOrder._id);
        await user.save();

        // Populate and return the order
        const populatedOrder = await Order.findById(newOrder._id)
            .populate('foodItem')
            .populate('placedBy');

        res.status(200).json({
            status: 200,
            message: "Order placed successfully",
            data: populatedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
});

router.post("/remove_order", authAdmin, async (req, res) => {
    try {
        const { id } = req.body;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                status: 404,
                message: "Order not found",
            });
        }
        await Order.findByIdAndDelete(id);
        res.status(200).json({
            status: 200,
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }    
});

router.get('/get_orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('foodItem').populate('placedBy');
        res.status(200).json({
            length: orders.length,
            status: 200,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
});

router.get('/cart', auth, async (req, res) => {
    try {
        const Cart = await Order.find({ placedBy: req.user }).populate('foodItem');
        res.status(200).json({
            status: 200,
            message: "Cart fetched successfully",
            data: Cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
});

router.post("/update_status", async (req, res) => {
    const { id, status } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({
            status: 200,
            message: "Order status updated successfully",
            data: updatedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
});

export default router;
