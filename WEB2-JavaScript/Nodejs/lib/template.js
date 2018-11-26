module.exports = {
  HTML:function (title, list, body, control) {
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

, list:function (filelist) {
    var lists = '<ol>'
    var i = 0;
    while (i < filelist.length) {
      lists = lists + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    lists = lists + '</ol>'
    return lists;
  }
}
