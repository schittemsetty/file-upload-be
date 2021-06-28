var GroupModel = require('../model/GroupModel.js');
var ColorModel = require('../model/ColorModel.js');
var async = require('async');
apiResponse = require('../utils/ApiResponse.js');
var authVerify = require('../routes/authVerify');

const getUsers = async(body, groupName, groupExists) => {
    var reqBody = [];
    var users = Object.keys(body[groupName]);
    if (users && users.length) {
        for (let j=0; j<users.length; j++) {
            if (typeof body[groupName][users[j]] === 'string') {
                var userExists = groupExists && await GroupModel.findOne({
                    'group': groupName,
                    'user': users[j]
                });
                var reqObj = {
                    color: body[groupName][users[j]]
                }
                var colorExists = await ColorModel.findOne({
                    'color': body[groupName][users[j]],
                });
                if (!colorExists) {
                    try {
                        await ColorModel.create(reqObj);
                    } catch(err) {
                        console.log(err, 'error in creating color ' + body[groupName][users[j]]);
                    }
                }
                if (groupExists && userExists) {
                    if (userExists.color !== body[groupName][users[j]]) {
                        try {
                            const updatedGroup = await GroupModel.findOneAndUpdate(
                                { 'group': groupName, 'user': users[j] },
                                { $set: reqObj },
                                { new: true }
                            );
                            reqBody.push(updatedGroup);
                        } catch(err) {
                            console.log(err, 'error in updating ' + groupName + users[j]);
                        }                                    
                    } else {
                        console.log('nothing to update in group ' + groupName + ' for user ' + users[j]);
                    }
                } else {
                    var reqObj = {
                        group: groupName,
                        user: users[j],
                        color: body[groupName][users[j]]
                    }
                    try {
                        var group = await GroupModel.create(reqObj);
                        reqBody.push(group);
                    } catch(err) {
                        console.log(err, 'error in creating ' + groupName, users[j]);
                    }  
                }
            } else {
                console.log('json structure not as expected ' + 'in ' + groupName, users[j])
            }
        }
    }

    return reqBody;
}

module.exports = {
    create: async(req, res) => {
        try {
            const verifiedUser = authVerify(req, res);
            if (verifiedUser.code === 200 && verifiedUser.body._id) {
                var body = req.body;
                var result = [];
                if (Object.keys(body)) {
                    var groupNames = Object.keys(body);
                    if (groupNames && groupNames.length) {
                        for (let i=0; i<groupNames.length; i++) {
                            if (typeof body[groupNames[i]] === 'object') {
                                var groupExists = await GroupModel.findOne({
                                    'group': groupNames[i]   
                                });
                                const response = await getUsers(body, groupNames[i], groupExists);
                                result = [...result, ...response];
                            } else {
                                console.log('json structure not as expected ' + 'in ' + groupNames[i])
                            }
                        }
                    }
                }

                res
                .status(200)
                .send(
                    new apiResponse.responseObject(200, result , null).getResObject()
                )
            } else {
                res
                .status(404)
                .send(
                    new apiResponse.responseObject(404, verifiedUser.body , null).getResObject()
                )
            }
        } catch(err) {
            console.log(err);
            return res // throwing error response to the client
            .status(500)
            .send(new apiResponse.responseObject(500, null, err).getResObject());
        }
    },

    getAll: async (req, res) => {
        try{
          const verifiedUser = authVerify(req, res);
          if (verifiedUser.code === 200 && verifiedUser.body._id) {
            let size = req.query.size ? parseInt(req.query.size): 5;
            let from = req.query.from ? parseInt(req.query.from): 0;
            var query = req.query.color ? { 'color': req.query.color } : {};
            var group = await GroupModel.find(query).skip(from*size).limit(size).sort();
            var totalData = await GroupModel.find(query);
            var totalCount = totalData && totalData.length;
            var body = {
                data: group,
                totalCount: totalCount
            };

                res
                .status(200)
                .send(
                new apiResponse.responseObject(200, body , null).getResObject()
                )
          } else {
            res
            .status(404)
            .send(
                new apiResponse.responseObject(404, verifiedUser.body , null).getResObject()
            )
          }
        } catch(err){
          return res // throwing error response to the client
            .status(400)
            .send(new apiResponse.responseObject(400, null, err).getResObject());
        }
      }
}
