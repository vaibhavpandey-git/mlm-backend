const bcrypt = require('bcrypt');

const hashPassword=async(password)=>{
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    console.error(err.message);
  }
}


const verifyPassword=async(password, hash)=>{
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {hashPassword, verifyPassword};