var request = require("request"),
  cheerio = require("cheerio"),
  url = "https://www.wunderground.com/US/CO/Boulder.html?MR=1" + 02888;

request(url, function(error, response, body) {
  if (!error) {
    var $ = cheerio.load(body),
      temperature = $("[data-variable='temperature'] .wx-value").html();

    console.log("It’s " + temperature + " degrees Fahrenheit.");
  } else {
    console.log("We’ve encountered an error: " + error);
  }
});