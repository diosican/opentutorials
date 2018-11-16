var Links = {
  setColor:function(color) {
    // var alist = document.querySelectorAll('a');
    // var i = 0;
    // while (i < alist.length) {
    //   alist[i].style.color = color;
    //   i = i + 1;
    // }
    $("a").css("color", color);
  }
}
var Body = {
  seltColor:function(color){
    // document.querySelector('body').style.color = color;
    $("body").css("color",color);
  },
  setBackgroundColor:function(color){
    $("body").css("background-color",color);
  }
}

function nightdayhandler(self) {
  var target = document.querySelector('body');
  if (self.value == 'night') {
    Body.setBackgroundColor('black');
    Body.seltColor('white');
    self.value = 'day';
    Links.setColor('coral')
  } else {
    Body.setBackgroundColor('white');
    Body.seltColor('black');
    self.value = 'night';
    Links.setColor('blue')
  }
}
