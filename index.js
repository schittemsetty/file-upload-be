var express = require('express');
var app = express();
require('dotenv').config();
var port = process.env.PORT;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var GroupController = require('./api/controllers/GroupController');
const fs = require('fs');
const cors = require('cors');
var authVerify = require('./api/routes/authVerify');

//connect to MongoDB
var mongoUserName = process.env.MONGO_USERNAME;
var mongoUserPassword = process.env.MONGO_PASSWORD;
var mongoDatabaseName = process.env.MONGO_DB_NAME;
var connectionString = `mongodb+srv://${mongoUserName}:${mongoUserPassword}@node.78n9r.mongodb.net/${mongoDatabaseName}?retryWrites=true&w=majority`
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(client => {
    console.log('Connected to Database')
})
.catch(error => console.error(error))

// parse incoming requests
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 1000000 }));
app.use(express.json(), cors());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })

app.post('/api/uploadfile', upload.single('myFile'), async (req, res, next) => {
  const verifiedUser = authVerify(req, res);
  if (verifiedUser.code === 200 && verifiedUser.body._id) {
    const file = req.file;
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    // res.send(file);
    fs.readFile(`./files/${file.filename}`, "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      // console.log("File data:", JSON.parse(jsonString));
      const body = JSON.parse(jsonString);
      req.body = body;
      GroupController.create(req, res);
    });
  } else {
    res
    .status(404)
    .send(
        new apiResponse.responseObject(404, verifiedUser.body , null).getResObject()
    )
}
})

// include routes
require('./api/routes/PingRoute.js')(app);
require('./api/routes/router.js')(app);



// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('File Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  console.log(err, 'error handler');
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 8080
app.listen(port);
console.log('listening on ' + port);
