const OTP = require("../models/otpModel")
const User = require("../models/userModel")
const { refCodeGen } = require("../utility/genGerCode")
const sendOTP = require("../utility/sendOtp")
const verifyOtp = require("../utility/verifyOtp")

const adminLogin=(req,res)=>{
    const {phone , password} = req.body

    
}


// const userLogin= async(req,res)=>{
//     const {phone, referralCode, otp} = req.body
//     try {
//         const user = await User.findOne({phone: phone
            
//         })
//         // const user = false
//         if(user){
//             const optVerified = otpVerify(otp)
//             if(optVerified){
//                 res.status(200).send({success: true, message: "Login Successfully"})
//             }
//             else{
//                 res.status(400).send({success: false, message: "OTP Verification Failed"})
//             }
//         }
//         else{
//             //Registering user if not present
//             try {
//                 const otpVerified = otpVerify(otp)
//                 if(!otpVerified) return res.status(400).send({success: false, message: "OTP not verified"});

//                 if(otpVerified){
//                     const refCode = refCodeGen().toString();
//                     const user = new User({phone: phone, tempParent: referralCode, refCode: refCode});
//                     await user.save();
//                     res.status(201).send({success: true, message: "Registration Successfull", user});
//                 }
                
//             } catch (error) {
//                 return res.status(400).send({success: false, message: "Registration Failed"});
//             }
//         }
//     } catch (error) {
//         res.status(400).send({success: false, message: "Something went wrong",error: error.message});
//     }
// }

const userRegister= async(req,res)=>{
    const {phone, referralCode, otpCode} = req.body
    try {
        if(otpCode){
            const existingUser = await User.findOne({phone: phone});
            if(existingUser) return res.status(400).json({message: "User Allready Exists"});
            const otpVerified = await verifyOtp(phone, otpCode);
            console.log("from user register", otpVerified);
            if(!otpVerified) return res.status(400).json({message: "OTP not verified"});
            const refCode = refCodeGen().toString();
            const user = new User({phone, tempParent: referralCode, refCode: refCode});
            await user.save();
            return res.status(201).json({message: "User registered successfully", user});
        }
        return res.status(400).json({message: "OTP is required"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const generateOtp= async (req,res)=>{
    const {phone} = req.body;
    try {
        const otpCode = await sendOTP(phone);
        const otp = new OTP({phone: phone, otpCode: otpCode});
        await otp.save();
        return res.status(200).json({success: true, message: "OTP sent successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const testOtp=()=>{
    
}
module.exports = {adminLogin, userRegister, generateOtp};