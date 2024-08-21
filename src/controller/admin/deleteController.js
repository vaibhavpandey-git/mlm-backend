const User = require("../../models/userModel");

const deleteUser= async (req,res)=>{
    const { userId } = req.query;

    try {
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully', user });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }


  
const deleteKyc = async(req,res)=>{
    const {userId} = req.query;
    try {

        const user = await User.findByIdAndUpdate(
          userId,
          { $set: {
                'kycDetails.kycStatus': 'Pending', // Optional: Reset kycStatus to default
                'kycDetails.aadharNumber': null,
                'kycDetails.panNumber': null,
                'kycDetails.aadharProof': null,
                'kycDetails.panProof': null
          } }, // Remove kycDetails field
          { new: true }
        );

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.json({ message: 'KYC details deleted successfully', user });

      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}
module.exports = {deleteUser,deleteKyc}