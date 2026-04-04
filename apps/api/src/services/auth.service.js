import { User } from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'


export function signToken(sub){
    return jwt.sign({sub}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

export async function registerUser({email, password}){
    // check if there is any existing user or not

    const existing = await User.findOne({email});

    if(existing){
        const err  = new Error('Email already registered');
        err.statusCode = 409;
        throw err;
    };

    const passwordHash = await bcrypt.hash(password, 10);
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const role =
      adminEmail && email === adminEmail ? "admin" : "user";

    const user = await User.create({ email, passwordHash, role });
    const token = signToken(user._id.toString());
    return { user, token };

}

export async function loginUser({email, password}){
    // check if there is any existing user or not
    const user = await User.findOne({email: email.trim().toLowerCase()});
    if(!user){
        const err  = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    };
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok){
        const err  = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }
    const token = signToken(user._id.toString());

    return {user, token}

}