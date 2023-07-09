const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_CODE, { expiresIn: "3d" });
}
module.exports={generateToken}