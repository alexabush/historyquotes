var express = require("express"); //import express
var bodyParser = require('body-parser'); //imports body-parser
var app = express(); // starts express
var MongoClient = require('mongodb').MongoClient; //allows use of mongodb, specifically mongodb on MongoClient

app.set('view engine', 'ejs'); //allows express to use ejs formatter

var db;
// connects index.js(my server code) to Mongodb database hosted on MongoClient
MongoClient.connect('mongodb://localhost:27017/quotes', function (err, database) {
	if (err) return console.log(err);
	db = database;
	app.listen(3000, function() { //express listens to port 3000
		console.log("listening to port 3000 ya")
	})
});

app.use(express.static('public')); //allows use of js file(s) from public directory
app.use(bodyParser.urlencoded({extended:true})); //needed to connect with mongo database
app.use(bodyParser.json()); //allows node.js server to turn JSON data into js object

app.get('/', function(req, res) { //returns page to browser; works for static pages, currently serves index.ejs
	db.collection('quotes').find().toArray(function(err, result) {
		if (err) return console.log(err);
	res.render('index.ejs', {quotes: result})
	});
});

app.post('/quotes', function(req, res) { //saves user input (in browser) to database
	db.collection('quotes').save(req.body, function(err, result) { //req.body == user input data
		if (err) {
			return console.log(err);
		}
	});
	console.log('saved to database');
	res.redirect('/');
});

app.delete('/quotes', function(req, res) {
	db.collection('quotes').findOneAndDelete(
		{name: req.body.name},
		function(err, result) {
			if (err) return res.send(500, err)
			res.send('quote was deleted')
	})
})




console.log("quotes page running");