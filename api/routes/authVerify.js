const jwt = require("jsonwebtoken");

module.exports = (req, res) => {
    const token = req.header("auth-token");
    if (!token)
    return new apiResponse.responseObject(400, 'Access denied' , null).getResObject()
    
    try {
        const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);

        return new apiResponse.responseObject(200, verifiedUser , null).getResObject()
    } catch(err) {
        return new apiResponse.responseObject(400, 'Invalid token' , null).getResObject()
    }
}