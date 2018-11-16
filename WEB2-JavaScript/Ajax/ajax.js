function ajaxpage(name) {
  $.ajax({
   url: name,
   method: "GET",
   dataType: "text",
   success: function(text) {
     document.querySelector('article').innerHTML = text;
   }
});
}
function ajaxnav(){
  $.ajax({
   url: "list",
   method: "GET",
   dataType: "text",
   success: function(text) {
     var tags = '';
     var i = 0;
     var items = text.split(',');
     while( i < items.length ){
           var item = items[i];
           item = item.trim();
           var tag = '<li><a href=#!'+item+' onclick="ajaxpage(\''+item+'\')">'+item+'</a></li>';
           tags = tags + tag;
           i += 1;
         };
    $("#nav").html(tags);
   }
  });
}

function fetchpage(name) {
  fetch(name).then(function(response){
    response.text().then(function(text){
      document.querySelector('article').innerHTML = text;
    })
  });
}

/*fetch('list').then(function(response){
  response.text().then(function(text){
    document.querySelector('#nav').innerHTML = text;
  })
});*/

function fetchnav(){
  fetch('list').then(function(response){
    response.text().then(function(text){
      /* var tags = "" ;
      var lis = text.split(',');
      lis.forEach(function(it) {
        var li = '<li><a href=#!'+it.trim()+' onclick="fetchpage(\''+it.trim()+'\')">'+it.trim()+'</a></li>\n';
        tags = tags + li;
        console.log(tags);
      }); */
      var tags = '';
      var i = 0;
      var items = text.split(',');
      while( i < items.length ){
        var item = items[i];
        item = item.trim();
        var tag = '<li><a href=#!'+item+' onclick="fetchpage(\''+item+'\')">'+item+'</a></li>';
        tags = tags + tag;
        i += 1;
      }
      document.querySelector('#nav').innerHTML = tags;
    });
  });
}
