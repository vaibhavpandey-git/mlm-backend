const User = require("../models/userModel")
const { refCodeGen } = require("../utility/genGerCode")
const otpVerify = require("../utility/otpVerification")

const adminLogin=(req,res)=>{
    const {phone , password} = req.body

    
}


const userLogin= async(req,res)=>{
    const {phone, referralCode, otp} = req.body
    try {
        const user = await User.findOne({phone: phone
            
        })
        // const user = false
        if(user){
            const optVerified = otpVerify(otp)
            if(optVerified){
                res.status(200).send({success: true, message: "Login Successfully"})
            }
            else{
                res.status(400).send({success: false, message: "OTP Verification Failed"})
            }
        }
        else{
            //Registering user if not present
            try {
                const otpVerified = otpVerify(otp)
                if(!otpVerified) return res.status(400).send({success: false, message: "OTP not verified"});

                if(otpVerified){
                    const refCode = refCodeGen().toString();
                    const user = new User({phone: phone, tempParent: referralCode, refCode: refCode});
                    await user.save();
                    res.status(201).send({success: true, message: "Registration Successfull", user});
                }
                
            } catch (error) {
                return res.status(400).send({success: false, message: "Registration Failed"});
            }
        }
    } catch (error) {
        res.status(400).send({success: false, message: "Something went wrong",error: error.message});
    }
}

module.exports = {adminLogin,userLogin}