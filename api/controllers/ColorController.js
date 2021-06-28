var ColorModel = require('../model/ColorModel.js');
apiResponse = require('../utils/ApiResponse.js');
var authVerify = require('../routes/authVerify');

module.exports = {
    getAllColors: async (req, res) => {
        try {
            const verifiedUser = authVerify(req, res);
            if (verifiedUser.code === 200 && verifiedUser.body._id) {
                var color = await ColorModel.find({}).sort();
                res
                .status(200)
                .send(
                new apiResponse.responseObject(200, color , null).getResObject()
                )
            } else {
                res
                .status(404)
                .send(
                    new apiResponse.responseObject(404, verifiedUser.body , null).getResObject()
                )
            }
        } catch(err) {
            return res // throwing error response to the client
              .status(400)
              .send(new apiResponse.responseObject(400, null, err).getResObject());
        }
    }
}