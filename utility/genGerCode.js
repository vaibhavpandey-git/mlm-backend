const referralCodes = require('referral-codes')

const refCodeGen =()=>{
    refCode = referralCodes.generate({
        length: 8
    });
    return refCode
}

module.exports = {refCodeGen}