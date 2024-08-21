const User = require("../../models/userModel");







const fetchUsers= async (req,res)=>{
    const { userId, filter } = req.query;

  try {
    // If no query string, return all users
    if (!userId && !filter) {
      const users = await User.find();
      return res.json(users);
    }

    //If userId is provided, return the specific user
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    }

    //If filter is provided, return active or inactive users
    if (filter) {
      let isActive;
      if (filter.toLowerCase() === 'active') {
        isActive = true;
      } else if (filter.toLowerCase() === 'inactive') {
        isActive = false;
      } else {
        return res.status(400).json({ message: 'Invalid filter value. Use "active" or "inactive".' });
      }

      //Filter users based on the last product's isActive status
      const users = await User.find({
        products: { $exists: true, $ne: [] },
        $expr: { $eq: [{ $arrayElemAt: ['$products.isActive', -1] }, isActive] }
      });
      return res.json(users);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = fetchUsers