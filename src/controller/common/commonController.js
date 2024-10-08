const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const { hashPassword, verifyPassword } = require("../../utility/hashUtils/bcrypt");


const updateDetails= async (req,res)=>{
    const {userId} = req.user;
    const { personalDetails, bankDetails } = req.body;

    try {
        const user = await User.findById(userId);
        if(personalDetails && !bankDetails){
            user.personalDetails = personalDetails;
        }
        else if(!personalDetails && bankDetails){
            user.bankDetails = bankDetails;
        }
        user.save();
        res.status(200).json({message: "Updated successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updatePassword= async (req,res)=>{
    const {userId} = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'userId number, old password, and new password are required' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(200).json({ message: 'User not found' });
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


const setPassword=async(req,res)=>{
    const {userId} = req.user;
    console.log(req.user);
    const { password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: 'User ID and password are required' });
    }
  
    try {
      const passwordHash = await hashPassword(password);
      const user = await User.findById(userId);
  
      if (!user) return res.status(200).json({ message: 'User not found' });

      user.password = passwordHash;
      await user.save();
  
      return res.status(200).json({ message: 'Password set successfully' });

    } catch (err) {

      return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { updateDetails, updatePassword, setPassword}