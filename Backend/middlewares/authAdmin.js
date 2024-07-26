import express from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const adminAuth = (req, res, next) => {
  
    const token = req.cookies.token;
  
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded.id;  // Use 'id' instead of '_id' to match your token payload
          
            if(decoded.id===process.env.adminId){
                next();
            }else{
                res.status(401).json({
                    status: 401,
                    msg: "Unauthorized: Admin can perform this only"
                });
            }
        } catch (error) {
            res.status(401).json({
                status: 401,
                msg: "Unauthorized: Invalid token"
            });
        }
    } else {
        res.status(401).json({
            status: 401,
            msg: "Unauthorized: No token provided"
        });
    }
};

export default adminAuth;
