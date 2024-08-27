const Payment = require("../../models/paymentModel");
const User = require("../../models/userModel");
const Withdrawal = require("../../models/withdrawalModel");

const rejectKyc = async(req,res)=>{
    const {userId} = req.query;
    try {
        const user = await User.findByIdAndUpdate(
          userId,
          { $set: {
                'kycDetails.kycStatus': 'Rejected', //Reset kycStatus to default
          } },
          { new: true }
        );
        if (!user) {
          return res.status(200).json({ message: 'User not found' });
        }
        res.json({ message: 'KYC details deleted successfully', user });

      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

const rejectPayment= async ()=>{
  try {
    const paymentId = req.query;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(200).json({ error: 'Payment not found' });
    }

    if (payment.paymentStatus == 'Rejected') {
      return res.status(200).json({ error: 'Payment is already rejected or successful' });
    }

    payment.paymentStatus = 'Rejected';
    await payment.save();

    res.json({ message: 'Payment rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const rejectWithdrawal = async(req, res)=>{
  const {withdrawalId} = req.query;

  try {
    const withdrawal = await Withdrawal.findByIdAndUpdate(withdrawalId, { $set: { paymentStatus: "Rejected" } }, { new: true });

    if (!withdrawal) {
      return res.status(200).json({ message: "Withdrawal not found" });
    }

    res.json({ message: "Withdrawal rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting withdrawal" });
  }
}

module.exports = {rejectKyc, rejectPayment, rejectWithdrawal}