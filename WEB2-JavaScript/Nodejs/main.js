var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');


var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function(error, filelist) {
        var title = 'Welcome';
        var description = "Hello Node.js";
        var list = template.list(filelist);
        var body = `<h2>${title}</h2>${description}`
        var html = template.HTML(title, list, body,
          `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir('./data', function(error, filelist) {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
          });
          var list = template.list(filelist);
          var title = queryData.id;
          var body = `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`;
          var html = template.HTML(sanitizedTitle, list, body,
            `<a href="/create">create</a>
             <a href="update?id=${sanitizedTitle}">update</a>
             <form action="delete_process" method="post">
                 <p><input type="hidden" name="id" value=${sanitizedTitle}></p>
                 <p>
                   <input type="submit" value="delete">
                 </p>
               </form>`);
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data', function(error, filelist) {
      var title = 'WEB - create';
      var list = template.list(filelist);
      var body = ` <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`;
      var html = template.HTML(title, list, body, ``);
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function(data) {
      body += data;

      if (body.length > 1e6)
        request.connection.destroy();
    });
    request.on('end', function(data) {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description
      fs.writeFile(`data/${title}`, `${description}`, 'utf8', function(error, data) {
        if (error) {
          throw error
        };
        console.log("ASync write complete");
        response.writeHead(302, {
          'Location': `/?id=${title}`
          //add other headers here...
        });
        response.end();
      });
    });
  } else if (pathname === "/update"){
    fs.readdir('./data', function(error, filelist) {
      var filteredId = path.parse(queryData.id).base;
      var title = queryData.id;
      fs.readFile(`./data/${filteredId}`, 'utf8', function(err, description){
        var list = template.list(filelist);
        var body = ` <form action="/update_process" method="post">
            <input type="hidden" name='id'>
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`;
        var html = template.HTML(title, list, body, ``);
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function(data) {
      body += data;
      if (body.length > 1e6)
        request.connection.destroy();
    });
    request.on('end', function(data) {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`,function(error, data) {
        fs.writeFile(`data/${title}`, `${description}`, 'utf8', function(error, data) {
          if (error) {
            throw error
          };
        });
      });
      response.writeHead(302, {
        'Location': `/?id=${title}`
      });
      response.end();
      });

  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function(data) {
      body += data;

      if (body.length > 1e6)
        request.connection.destroy();
    });
    request.on('end', function(data) {
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function(error){
        if (error) {
          throw error
        };
      });
        response.writeHead(302, {
          'Location': `/`
          //add other headers here...
        });
        response.end();
      });
  } else {
    response.writeHead(404);
    response.end('Not found');

  }
});
app.listen(3000);
