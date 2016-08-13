var client = require('cheerio-httpcli');
var fs = require('fs');

client.fetch('http://web.shogidojo.net/kifu/srv/login')
  .then(function (result) {
    return result.$('form[name=form1]').submit({name: 'xxx', pwd: 'xxx'});
  })
  .then(function (result) {
    return result.$('form[name=form1]').submit();
  })
  .then(function (result) {
    result.$('a').each(function (idx) {
      var filename = result.$(this).html() + '.kif';
      client.fetch(result.$(this).attr('href'), 'sjis')
        .then(function (result) {
          fs.stat(filename, function(err, stat) {
            if(err == null) {
              console.log('File exists');
            } else if(err.code == 'ENOENT') {
              // file does not exist
              fs.writeFile(filename, result.body);
            } else {
              console.log('Some other error: ', err.code);
            }
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  })
  .catch(function (err) {
    console.log(err);
  });
