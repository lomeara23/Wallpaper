var currentWindowSize = [innerWidth,innerHeight];

var columns = Math.floor(parseInt(innerWidth) / 40)-1
var rows = Math.floor(parseInt(innerHeight) / 40) 
var tileCount = columns * rows

var pointBase = [233,30,99]
var pointColor = [0,255,255] 

function updateWindowSize()  {
  var columns = Math.floor(parseInt(innerWidth) / 40)-1
  document.documentElement.style.setProperty('--columns', columns)
}

function multiplyNode(node, count, deep) {
  for (var i = 0, copy; i < count - 1; i++) {
    copy = node.cloneNode(deep);
    node.parentNode.insertBefore(copy, node);
  }
}
updateWindowSize();
multiplyNode(document.querySelector('.tile'), tileCount, true);

window.onresize = function() {
  updateWindowSize();
  var tempWindowSize = [innerWidth,innerHeight]

//TODO: Rework window resize adding points

  if (tempWindowSize[0] > currentWindowSize[0] || tempWindowSize[1] > currentWindowSize[1]) {
    var newTiles = (Math.floor(innerWidth / 40) * Math.floor(innerHeight / 40))-tileCount
    tileCount = newTiles

    multiplyNode(document.querySelector('.tile'), newTiles, true);
  }
  currentWindowSize = tempWindowSize;
}

document.addEventListener('mousemove', function() {
  handleMouseMove()
}, false);

function handleMouseMove(event) {
  var eventDoc, doc, body;

  event = event || window.event;

  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;

    event.pageX = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0);
    event.pageY = event.clientY +
      (doc && doc.scrollTop || body && body.scrollTop || 0) -
      (doc && doc.clientTop || body && body.clientTop || 0);
  }

  let mouseX = event.pageX;
  let mouseY = event.pageY;

  let tile = document.getElementsByClassName("tile");
  for (i = 0; i < tile.length; i++) {
    let point = tile[i].children[0];
    let rect = tile[i].getBoundingClientRect();
    let dot = point.children[0];
    let pointLeft = rect.left;
    let pointTop = rect.top;
    let pointWidth = rect.width;
    let pointHeight = rect.height;
    let pointX = Math.floor(pointLeft + (pointWidth / 2))
    let pointY = Math.floor(pointTop + (pointHeight / 2))
    let distX = pointX - mouseX
    let distY = pointY - mouseY
    let distTotal = Math.floor(Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)))
    if (distTotal < 200) {
      var proxPercent = (200-distTotal)/200
      var redness = pointBase[0]+proxPercent*(pointColor[0]-pointBase[0]);
      var greenness = pointBase[1]+proxPercent*(pointColor[1]-pointBase[1]);
      var blueness = pointBase[2]+proxPercent*(pointColor[2]-pointBase[2]);
      var displacement = 15*Math.pow(1.025, (-0.005*Math.pow(distTotal,2)))
      var displacementScalar = displacement/distTotal
      var avoidanceX = distX*displacementScalar
      var avoidanceY = distY*displacementScalar

      point.style.transform = "translate("+avoidanceX+"px, "+avoidanceY+"px)"
      dot.style.fill = "rgb(" + redness + ","+greenness+","+blueness+")";
    } else {
      point.style.transform = "translate(0px, 0px)"
      dot.style.fill = "rgb("+pointBase[0]+","+pointBase[1]+","+pointBase[2]+")";
    }
  }
}

document.addEventListener('mouseleave', function() {
  console.log("Left Screen")
  
  let tile = document.getElementsByClassName("tile");
  for (i = 0; i < tile.length; i++) {
    let point = tile[i].children[0];
    let dot = point.children[0];    
      point.style.transform = "translate(0px, 0px)"
      dot.style.fill = "rgb("+pointBase[0]+","+pointBase[1]+","+pointBase[2]+")";
    }
  }, false);
