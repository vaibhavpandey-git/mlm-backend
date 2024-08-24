const User = require("../../models/userModel");
const { verifyPassword, hashPassword } = require("../../utility/hashUtils/bcrypt");
const verifyOtp = require("../../utility/otpUtils/verifyOtp");


const setPassword=async(req,res)=>{
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: 'User ID and password are required' });
    }
  
    try {
      const passwordHash = await hashPassword(password);
      const user = await User.findById(userId);
  
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.password = passwordHash;
      await user.save();
  
      return res.status(200).json({ message: 'Password set successfully' });

    } catch (err) {

      return res.status(500).json({ message: 'Internal server error' });
    }
}


const updatePassword= async (req,res)=>{
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'userId number, old password, and new password are required' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await verifyPassword(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Old password is incorrect' });
      }

      const newPasswordHash = await hashPassword(newPassword);
      user.password = newPasswordHash;
      await user.save();

      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
}

const resetPassword= async()=>{
    const {phone, otp, password} = req.body;
    try {
        const user = await User.findOne({phone});
        if(!user) return res.status(404).json({message: "User not found"});

        const otpVerified = await verifyOtp(otp);
        if(!otpVerified) return res.status(400).json({message: "otp invalid"});

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        return res.status(200).json({message: "Password successfully changed, login with new password"});
    } catch (error) {
        return res.status(500).json({message: err.message});
    }
}