const fs = require('fs');
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

let rawdata = fs.readFileSync('foodtrucks.json');
let foodtruckJSON = JSON.parse(rawdata);

foodTruckArray = foodtruckJSON.food_trucks;

foodTruckArray.forEach((el) => {
	let currentElement = new FoodTruck({
		name: el.name,
		location: el.location,
		menu: el.menu,
		cost: el.cost,
		hours: el.hours,
		type: 'original'
	});

	currentElement.save((err, docsIn) => {
		if (err) {
			console.log('error!', err);
		}

		console.log('The just saved values are ' + docsIn);
	});
});
