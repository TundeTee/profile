import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
try{
const users = await User.find({});
res.status(200).json({success: true, data: users});
}catch (error){
res.status(500).json({success: false, message: "server Error"});
}
}

export const createUser = async (req, res) => {
    try {
        const { name, age } = req.body;
        
        if (!name || !age) {
            return res.status(400).json({
                success: false, message: "Please provide name and age"
            });
        }
        
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        } else {
            return res.status(400).json({
                success: false, message: "Please upload an image"
            });
        }
        
        const newUser = new User({
            name,
            age,
            image: imagePath
        });
        
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error in Create profile:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, age } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success:false, message: "Invalid User Id"});
    }
    
    try {
        const updateData = { name, age };
        
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        
        const updatedUser = await User.findByIdAndUpdate(id, updateData, {new:true});
        res.status(200).json({success: true, data: updatedUser});
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const uploadUserImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image" });
        }
        
        const imagePath = `/uploads/${req.file.filename}`;
        return res.status(200).json({ success: true, imagePath });
    } catch (error) {
        console.error("Error uploading image:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteUser = async (req, res) => {
const { id }= req.params;
if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({success:false, message: "Invalid User Id"});
}
try{
    await User.findByIdAndDelete(id);
    res.status(200).json({success:true, message: "User deleted"});
}catch(error) {
    res.status(500).json({success: false, message: "Server Error"});
}

}