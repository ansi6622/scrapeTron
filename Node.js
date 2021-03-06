var request = require("request"),
  cheerio = require("cheerio"),
  url = "https://www.google.com/search?q=mustard",
  corpus = {},
  totalResults = 0,
  resultsDownloaded = 0;

function callback() {
  resultsDownloaded++;
  if (resultsDownloaded !== totalResults) {
    return;
  }
  var words = [];
  for (prop in corpus) {
    words.push({
      word: prop,
      count: corpus[prop]
    });
  }
  words.sort(function(a, b) {
    return b.count - a.count;
  });
  console.log(words.slice(0, 20));
}
request(url, function(error, response, body) {
  if (error) {
    console.log("Couldn’t get page because of error: " + error);
    return;
  }
  var $ = cheerio.load(body),
    links = $(".r a");
  links.each(function(i, link) {
    var url = $(link).attr("href");
    url = url.replace("/url?q=", "").split("&")[0];

    if (url.charAt(0) === "/") {
      return;
    }
    totalResults++;
    request(url, function(error, response, body) {
      if (error) {
        console.log("Couldn’t get page because of error: " + error);
        return;
      }
      var $page = cheerio.load(body),
        text = $page("body").text();
      text = text.replace(/\s+/g, " ")
        .replace(/[^a-zA-Z ]/g, " ")
        .toLowerCase();
      text.split(" ").forEach(function(word) {
        if (word.length < 5 || word.length > 14) {
          return;
        }
        if (corpus[word]) {
          corpus[word]++;
        } else {
          corpus[word] = 1;
        }
      });
      callback();
    });
  });
});
