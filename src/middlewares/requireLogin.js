const jwt = require('jsonwebtoken');
require('dotenv').config();

// Combined middleware for both authentication and authorization

function requireLogin(roles = []) {
    // Allow roles to be a string or an array
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
        const token = authHeader.split(' ')[1];

        try {
            // Verify the JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // If roles are specified, check if the user has the required roles
            if (roles.length && !roles.some(role => req.user.role.includes(role))) {
                return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
            }

            // If the token is valid and the user has the required roles, proceed
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
    };
}


module.exports = requireLogin;