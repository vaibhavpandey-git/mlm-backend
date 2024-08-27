const OTP = require("../../models/otpModel")
const User = require("../../models/userModel")
const referralCodes = require('referral-codes')
const sendOTP = require("../../utility/otpUtils/sendOtp")
const verifyOtp = require("../../utility/otpUtils/verifyOtp")
const { verifyPassword, hashPassword } = require("../../utility/hashUtils/bcrypt")
const JWT = require('jsonwebtoken');
require('dotenv').config();


const login= async(req,res)=>{
    const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(200).json({ error: 'Invalid phone or password' });
    }
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ error: 'Invalid phone or password' });
    }

    // Generate JWT token
    const token = JWT.sign(
      { userId: user._id,phone: phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    user.token = token;
    await user.save();
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}



const userRegister= async(req,res)=>{
    const {phone, referralCode, otpCode } = req.body
    try {
        if(otpCode){
            const existingUser = await User.findOne({phone: phone});
            if(existingUser) return res.status(200).json({message: "User Allready Exists, Please login"});
            const otpVerified = await verifyOtp(phone, otpCode);
            console.log("from user register", otpVerified);
            if(!otpVerified) return res.status(200).json({message: "OTP not verified"});
            const refCode = referralCodes.generate({ length: 8 }).toString(); // generating referral code
            const user = new User({phone, tempParent: referralCode, refCode: refCode});
            

            const token = JWT.sign(
                { userId: user._id,phone: phone, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              )
            user.token = token;
            await user.save();
            return res.status(201).json({message: "User registered successfully", token});
        }
        return res.status(400).json({message: "OTP is required"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}




const generateOtp= async (req,res)=>{
    const {phone} = req.body;
    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        // const otpCode = await sendOTP(phone);
        if(!otpCode) return res.status(400).json("Something went wrong while sending otp");
        
        const oldOtp = await OTP.findOne({phone: phone});
        if(oldOtp) await oldOtp.deleteOne();
        const otp = new OTP({phone: phone, otpCode: otpCode});
        await otp.save();
        
        return res.status(200).json({ message: "OTP sent successfully", otpCode: otpCode });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}



const resetPassword= async(req,res)=>{
  const {phone, otpCode, password} = req.body;
  console.log(req.body)
  try {
      const user = await User.findOne({phone});
      if(!user) return res.status(200).json({message: "User not found"});
      const otpVerified = await verifyOtp(phone, otpCode);
      if(!otpVerified) return res.status(200).json({message: "otp invalid"});

      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
      user.token = "";
      await user.save();
      return res.status(200).json({message: "Password successfully changed, login with new password"});
  } catch (error) {
      return res.status(500).json({message: error.message});
  }
}

module.exports = {login, userRegister, generateOtp, resetPassword}