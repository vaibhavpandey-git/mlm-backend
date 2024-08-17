const Payment = require("../../models/paymentModel");
const User = require("../../models/userModel");

const userFileUpload = async (req,res)=>{
    const {userId, uploadedFor} = req.body;
    const file = req.file;
    try {

        console.log("file", req.file, "req.Body", req.body);
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({message: "User not found while uploading file"});

        switch (uploadedFor) {
            case 'Payment':
                paymentUpload(user, file);
                return res.status(200).json({ message: "Payment file uploaded" });

            case 'Profile':
                profileUpload(user, file);
                return res.status(200).json({ message: "Profile file uploaded" });

            case 'KYC':
                kycUpload(user, file);
                return res.status(200).json({ message: "KYC file uploaded" });

            default:
                return res.status(400).json({ message: "Upload reason not found" });
        }
    } catch (error) {
        console.log("error", error.message);
        res.status(400).json({message: error.message});
    }
}

const paymentUpload= async (user, file)=>{
    const payment = await Payment.findOne({userId: user._id, paymentStatus: 'Pending'});
    payment.paymentProof = file.path;
    console.log("Uploaded to Payment");
    await payment.save();
}

const profileUpload=(user, file)=>{
    console.log("Uploaded to profile");
}

const kycUpload=(user, file)=>{
    console.log("Uploaded to KYC");
}

module.exports = userFileUpload