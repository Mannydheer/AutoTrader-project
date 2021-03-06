const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { HttpException, BadRequest } = require("./Error/CustomError");

//WEB SCRAPING LIBRARIES.
const cheerio = require("cheerio");
const request = require("request");

const app = express();

//--------------------HANDLERS--------------------
const {
  countryController,
  selectedCountryController,
} = require("./Country/countryController");

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, HEAD, GET, PUT, POST, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(__dirname + "/"));

//COUNTRY ENDPOINTS.
app.get("/getCountries", countryController);
app.get("/getSingleCountry/:country", selectedCountryController);

//BUILT IN ERROR CLASS.
app.use(function (err, req, res, next) {
  //If the error is coming from custom error class.
  if (err instanceof HttpException) {
    return res
      .status(err.status)
      .json({ message: err.name, status: err.status });
  }
  //else
  return res.status(500).json({
    message: "Unexpected Error Occured.",
    status: 500,
    error: JSON.stringify(err),
  });
});

//test
// request(
//   "https://www.worldometers.info/coronavirus/country/us/",
//   async (error, response, html) => {
//     if (!error && response.statusCode === 200) {
//       const $ = cheerio.load(html);
//       //table will hold all the table rows.
//       const table = $("tbody > tr");
//       //array for States.
//       let arrayEachStateUsaStatistics = [];
//       //loop through each table row.
//       table.each((index, element) => {
//         let data = {};
//         //for each of the rows, item will find all the td's.
//         const item = $(element).find("td");
//         //thei index - item[0] will target which td we want from the whole tr.
//         data["country"] = $(item[0]).text().replace("\n", "").replace(" ", "");
//         data["total"] = $(item[1]).text();
//         data["Deaths"] = $(item[3]).text().replace("\n", "").replace(" ", "");
//         //finally we push the new object to the array.
//         arrayEachStateUsaStatistics.push(data);
//       });
//     }
//   }
// );

module.exports = app;
