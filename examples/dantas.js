var http = require('http');
 
var urls = [
  '/',
  '/david-nao-existe',
  '/noticias/desporto',
  '/page-404-que-nao-existe',
  '/joao-almeida-vs-chapa-jiujitsu'];
 
urls.forEach(iterator);
 
function iterator(p) {
 
  var options = {
    host: 'www.sapo.pt',
    path: p
  };
 
  http.request(options, callback).end();
 
  function callback(response) {
    console.log(response.statusCode, p);
  }
}
