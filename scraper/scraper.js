const cheerio = require('cheerio');
const request = require('request');

// const city = res.body.city;
const city = "newyork";
// const max_price = res.body.max_price;
const max_price = "500";

const search_query = `https://${city}.craigslist.org/search/bia?max_price=${max_price}`;

const USER_AGENT = 'bikesearch';

const pooledRequest = request.defaults({
    pool: { maxSockets: 10 },
    headers: {
        'User-Agent': USER_AGENT,
    },
});

// Wrap request results in a promise
function rp (options) {
    return new Promise((resolve, reject) => {
        pooledRequest(options, (err, res, body) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

function fetch_html(uri, encoding) {
    const options = {
        uri: uri,
        gzip: true,
    };

    return rp(options).then(res => {
        let body = res.body;

        if (encoding) {
            const converter = new iconv.Iconv(encoding, 'UTF-8');
            body = converter.convert(body);
        }
        return cheerio.load(body);
    });
}

function fetch_listings (listings_url) {
  return new Promise((resolve, reject) => {
    fetch_html(listings_url).then(($) => {
      const $listings = $('p.result-info');

      const listings = [];

      $listings.each((index, element) => {
        const $element = $(element);
        const title = $element.find('a').first().text();
        const price = $element.find('.result-price').first().text() || null;
        const location = $element.find('.result-hood').first().text().trim().replace(/[\(|\)]/gi, '');
        const image = $element.find('img').first().attr('src');
        const url = $element.find('a').first().attr('href');

        if ( title ) {
          listings.push({
            title,
            price,
            location,
            image,
            url
          });
        }
      });

      resolve(listings);
    });
  });
}



fetch_listings(search_query).then((listings) => {
  console.log(listings);
});
