var page = require('webpage').create(),
    args = require('system').args;

page.open('http://www.imdb.com' + args[1], function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        var p = page.evaluate(function () {
            $('div[itemprop="description"]').children().children().remove()
            return $('div[itemprop="description"]').text()
        });
        console.log(p);
    }
    phantom.exit();
});
