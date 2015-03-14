// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
// configuration =================
mongoose.connect('mongodb://adolfoEVA01:Newyork79@novus.modulusmongo.net:27017/vito7jAr');     // connect to mongoDB database on modulus.io
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
var Score = mongoose.model('Score', {
	userName : String,
	attempts: String,
	guessed: String //ADDED
});
// routes ======================================================================

// api ---------------------------------------------------------------------
// Get all scores which are the attemps a user used to guess the word
app.get('/api/scores', function(req, res) {
	console.log("Getting scores");
	// Use mongoose to get all scores in the database
	
	
	
	Score.find(function(err, scores) {

		// If there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
			res.send(err)
		}
		res.json(scores); // Return all scores for the game in JSON format
	});
});

// Create a score once the game is over and send back all scores after creation
app.post('/api/scores', function(req, res) {
	console.log("Saving Score");
	console.log(req.body);
	// Create a record of a score, information comes from AJAX request from Angular
	Score.create({
		userName : req.body.userName,
		attempts : req.body.attempts,
        guessed : req.body.guessed
	}, function(err, attempts, userName) {
		if (err)
			res.send(err);

		// Get and return all the attempts after you create another
		Score.find(function(err, scores) {
			if (err)
				res.send(err)
				res.json(scores);
		});
	});

});

// Delete a score
app.delete('/api/scores/:score_id', function(req, res) {
	Score.remove({
		_id : req.params.score_id
	}, function(err, attempts, userName) {
		if (err)
			res.send(err);

		// Get and return all the scores after you create or delete another
		Score.find(function(err, scores) {
			if (err)
				res.send(err)
				res.json(scores);
		});
	});
});

// Application -------------------------------------------------------------
// This will load our single index.html file when we hit localhost:8080.
app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");