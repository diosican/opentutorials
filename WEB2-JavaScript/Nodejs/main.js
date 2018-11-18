var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var app = http.createServer(function(request, response) {
var _url = request.url;
var queryData = url.parse(_url, true).query;
var pathname = url.parse(_url, true).pathname;
console.log(pathname);
var title = queryData.id

function templateHTML(title, list, body, control) {
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
}

function templateList(filelist){
  var list = '<ol>'
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ol>'
  return list;
}

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function(error, filelist) {
        var title = 'Welcome';
        var description = "Hello Node.js";

        var list = templateList(filelist);
        var body = `<h2>${title}</h2>${description}`
        var template = templateHTML(title, list, body,
        `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir('./data', function(error, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {

          var list = templateList(filelist);
          var body = `<h2>${title}</h2>${description}`
          var template = templateHTML(title, list, body,
          `<a href="/create">create</a> <a href="update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }

  } else if (pathname === '/create') {
    fs.readdir('./data', function(error, filelist) {
      var title = 'Welcome';
      var description = "Hello Node.js";
      console.log(description);

      var list = templateList(filelist);
      var body = ` <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`;
      var template = templateHTML(title, list, body, ``);
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function(data){
      body += data;

      if (body.length > 1e6)
              request.connection.destroy();
    });
    request.on('end', function(data){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description
      fs.writeFile(`data/${title}`, `${description}` ,'utf8', function(error, data){
        if (error) {throw error};
        console.log("ASync write complete");
        response.writeHead(302, {
          'Location': `/?id=${title}`
          //add other headers here...
        });
        response.end();
      });

    });

  } else {
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);
