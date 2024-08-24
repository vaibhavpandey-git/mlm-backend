const OTP = require("../../models/otpModel")

const verifyOtp = async (phone, otpCode)=>{
    try {
        const otp = await OTP.findOne({phone: phone, otpCode: otpCode});
        console.log("from verify otp", otp);
        if(!otp) return false;
        return true;
    } catch (error) {
        console.log(error);
    }
}

module.exports = verifyOtp