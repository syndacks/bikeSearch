const cheerio = require('cheerio');
const request = require('request');

// const city = res.body.city;
const city = "newyork";
// const max_price = res.body.max_price;
const max_price = "500";

const main_query = `https://${city}.craigslist.org/search/bia?max_price=${max_price}`;

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



fetch_html(main_query).then(($) => {
  console.log($);
});
