request(url, function (error, response, body) {
  if (error) {
    console.log(error);
    return;
  }

  // load the body of the page into Cheerio so we can traverse the DOM
  var $ = cheerio.load(body),
    links = $(".r a");

  links.each(function (i, link) {
    // get the href attribute of each link
    var url = $(link).attr("href");

    // strip out unnecessary junk
    url = url.replace("/url?q=", "").split("&")[0];

    if (url.charAt(0) === "/") {
      return;
    }

    // this link counts as a result, so increment results
    totalResults++;

    text = text.replace(/\s+/g, " ")
       .replace(/[^a-zA-Z ]/g, "")
       .toLowerCase();


// Split on spaces for a list of all the words on that page and
// loop through that list.
text.split(" ").forEach(function (word) {
  // We don't want to include very short or long words because they're
  // probably bad data.
  if (word.length  20) {
    return;
  }

  if (corpus[word]) {
    // If this word is already in our corpus, our collection
    // of terms, increase the count for appearances of that
    // word by one.
    corpus[word]++;
  } else {
    // Otherwise, say that we've found one of that word so far.
    corpus[word] = 1;
  }
});

for (prop in corpus) {
  words.push({
    word: prop,
    count: corpus[prop]
  });
}

// sort array based on how often they occur
words.sort(function (a, b) {
  return b.count - a.count;
});
