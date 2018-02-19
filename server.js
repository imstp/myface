// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, 'image')
  }
})
var upload = multer({ storage: storage })

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});
router.route('/facerec')
    .post(upload.single('face'), function(req, res) {
    	var pyshell = new PythonShell('recog.py');
		pyshell.on('message', function (message) {
			console.log(message);
  			res.send(message);
		});
		pyshell.end(function (err) {
  			if (err) //throw err;
  				console.log(err);
  				res.send(err);
		});
    });
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);