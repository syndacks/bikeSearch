const express = require('express');
const app = express();
var bodyParser = require('body-parser');
// const Scraper = require('./scraper.js');
const Scraper = "blah blah blah";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => {
  res.render('index');
})

app.get('/search', (req, res) => {
  res.render('search');
} )

// handle register logic
app.post("/craigslistScraper", function(req, res){
	let city = req.body.city;
  let max_price = req.body.max_price;
  res.send("you've reaached the post route")
	// var newBikeSearch = {city: city, max_price: max_price};
	// Scraper.search(newBikeSearch, function(err, newlySearched){
	// 	if(err){
	// 		console.log(err)
	// 	}else{
	// 		// console.log(newlySearched);
	// 		res.redirect("/search_results");
	// 	}
	// });
});

// server
app.listen(3000, () => {
  console.log('Craigslist app listening on port 3000');
})
