const User = require("../../models/userModel");

const userFileUpload = async (req,res)=>{
    const {userId} = re
    const { uploadedFor } = req.body;
    const file = req.file;
    try {

        console.log("file", req.file, "req.Body", req.body);
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({message: "User not found while uploading file"});

        switch (uploadedFor) {

            case 'profile':
                await profileUpload(user, file);
                return res.status(200).json({ message: "Profile file uploaded" });

            case 'aadhar':
                await aadharUpload(user, file);
                return res.status(200).json({ message: "KYC file uploaded" });

            case 'pan':
                await panUpload(user, file);
                return res.status(200).json({ message: "KYC file uploaded" });

            default:
                return res.status(400).json({ message: "Upload reason not found" });
        }
    } catch (error) {
        console.log("error", error.message);
        res.status(400).json({message: error.message});
    }
}


const profileUpload=async(user, file)=>{
    user.personalDetails.profileImage = file.path;
    console.log("Uploaded to profile");
    await user.save();
}

const aadharUpload= async(user, file)=>{
    user.kycDetails.aadharProof = file.path;
    console.log("Uploaded to aadhar");
    await user.save();
}

const panUpload= async(user, file)=>{
    user.kycDetails.panProof = file.path;
    console.log("Uploaded to Pan");
    await user.save();
}

module.exports = {userFileUpload}