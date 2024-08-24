const axios = require('axios');

const sendSMS = async (mobileNumber, var1) => {
    const apiKey = '428529ARzH3ayZD93l66c407f5P1'; // Replace with your MSG91 authkey
    const templateId = '66c40f54d6fc05398328d722'; // Replace with your MSG91 template ID
    const senderId = 'TRISRG'; // Replace with your Sender ID

    const url = `https://control.msg91.com/api/v5/flow/`;

    const payload = {
        sender: senderId,
        template_id: templateId,
        short_url: "1", // Set to "1" (On) or "0" (Off)
        realTimeResponse: "1", // Optional: Set to "1" if you need real-time response
        recipients: [
            {
                mobiles: mobileNumber, // The mobile number of the recipient
                VAR1: var1, // Replace with the value for VAR1
            },
        ],
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'authkey': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        console.log('SMS sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending SMS:', error.response ? error.response.data : error.message);
    }
};

// Example usage
sendSMS('+917827295033', '345978');