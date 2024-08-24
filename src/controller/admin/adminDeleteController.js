const User = require("../../models/userModel");

const deleteUser= async (req,res)=>{
    const { userId } = req.query;

    try {
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully', user });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  

module.exports = {deleteUser}