var target = "./data";
var fs = require("fs");

fs.readdir(target, function(err, files){
  console.log(files);
  files.forEach(file => {
    console.log(file);
  });
});
