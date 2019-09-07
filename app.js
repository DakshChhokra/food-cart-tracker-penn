const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Uncomment the following line to run this on local
// env = require('node-env-file');

//Uncomment the following line to run this on local
// env(__dirname + '/.env');

//mongoose set up
const mongooseConfig = { useNewUrlParser: true };

var mongoDBPort = process.env.MONGODB_URI || 'mongodb://localhost:27017/penn-cart-tracker';

mongoose.connect(mongoDBPort, mongooseConfig);
mongoose.set('useFindAndModify', false);

var Schema = mongoose.Schema;

var foodTruck = new Schema({
	name: String,
	location: [ Number ],
	menu: [ [ String, Number ] ],
	cost: Number,
	hours: [ [ 'String', Number, Number ] ],
	type: String
});

var FoodTruck = mongoose.model('FoodTruck', foodTruck);

var port = process.env.PORT || 3000;
var server = app.listen(port, () => {
	console.log('Server started on port ' + port);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//Routes

app.get('/', (req, res) => {
	res.send('Welcome to foodtruck API');
});
app.get('/allFoodtrucks', (req, res) => {
	FoodTruck.find({}, function(err, foodTrucksQuery) {
		if (err) {
			console.log('error!', err);
		}

		var jsonReturn = { list: [] };

		foodTrucksQuery.forEach(function(ft) {
			jsonReturn.list.push(ft);
			console.log(ft);
		});

		res.send(jsonReturn);
	});
});
app.get('/foodtruck', (req, res) => {
	FoodTruck.find({ name: req.query.name }, function(err, foodTrucksQuery) {
		if (err) {
			console.log('error!', err);
		}

		var jsonReturn = { list: [] };

		foodTrucksQuery.forEach(function(ft) {
			jsonReturn.list.push(ft);
			console.log(ft);
		});

		res.send(jsonReturn);
	});
});

app.get('/foodtruckwithfood', (req, res) => {
	let reqDish = req.query.dish;
	let returnableList = [];
	FoodTruck.find({}, function(err, foodTrucksQuery) {
		if (err) {
			console.log('error!', err);
		}

		foodTrucksQuery.forEach(function(ft) {
			let menu = ft.menu;
			let tester = false;
			menu.forEach((el) => {
				let dishName = el[0];
				console.log(
					dishName.toLowerCase(),
					'||',
					reqDish.toLowerCase(),
					'||',
					dishName.toLowerCase().includes(reqDish.toLowerCase())
				);

				if (dishName.toLowerCase().includes(reqDish.toLowerCase())) {
					tester = true;
				}
			});
			console.log(tester);
			if (tester == true) {
				returnableList.push(ft);
				console.log(returnableList);
			}
		});
		console.log('returnableList', returnableList);
		var jsonReturn = { list: returnableList };
		res.send(jsonReturn);
	});
});

app.get('/recommendOne', (req, res) => {
	let reqDish = req.query.dish;
	let returnableList = [];
	FoodTruck.find({}, function(err, foodTrucksQuery) {
		if (err) {
			console.log('error!', err);
		}

		foodTrucksQuery.forEach(function(ft) {
			let menu = ft.menu;
			let tester = false;
			menu.forEach((el) => {
				let dishName = el[0];
				console.log(
					dishName.toLowerCase(),
					'||',
					reqDish.toLowerCase(),
					'||',
					dishName.toLowerCase().includes(reqDish.toLowerCase())
				);

				if (dishName.toLowerCase().includes(reqDish.toLowerCase())) {
					tester = true;
				}
			});
			console.log(tester);
			if (tester == true) {
				returnableList.push(ft);
				console.log(returnableList);
			}
		});
		console.log('returnableList', returnableList);
		var item = returnableList[Math.floor(Math.random() * returnableList.length)];
		var jsonReturn = { place: returnableList.name };
		res.send(jsonReturn);
	});
});

app.get('/addfoodtrucks', (req, res) => {
	res.send('Add ejs file here');
});
app.post('/addfoodtrucks', (req, res) => {
	let currentElement = new FoodTruck({
		name: req.body.name,
		location: req.body.location,
		menu: req.body.menu,
		cost: req.body.cost,
		hours: req.body.hours,
		type: 'user-added'
	});

	currentElement.save((err, docsIn) => {
		if (err) {
			console.log('error!', err);
		}

		console.log('The just saved values are ' + docsIn);
	});
	res.send('Your foodtruck has been added');
});

function distance(x1, x2, y1, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
