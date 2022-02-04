var r = document.querySelector('.root');
var tileCount = Math.floor(document.documentElement.clientWidth / 40) * Math.floor(document.documentElement.clientHeight / 40)
var currentWindowSize = document.documentElement.clientWidth * document.documentElement.clientHeight;

function updateWindowSize() {
  var columns = Math.floor(parseInt(document.documentElement.clientWidth) / 40)
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
  var tempWindowSize = document.documentElement.clientWidth * document.documentElement.clientHeight
  if (tempWindowSize > currentWindowSize) {
    var newTiles = Math.floor(document.documentElement.clientWidth / 40) * Math.floor(document.documentElement.clientHeight / 40)

    multiplyNode(document.querySelector('.tile'), newTiles, true);
  }
  currentWindowSize = tempWindowSize;
}

document.addEventListener('mousemove', function() {
  handleMouseMove()
}, false);

function handleMouseMove(event) {
  var eventDoc, doc, body;

  event = event || window.event; // IE-ism

  // If pageX/Y aren't available and clientX/Y are,
  // calculate pageX/Y - logic taken from jQuery.
  // (This is to support old IE)
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

  // Use event.pageX / event.pageY here
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
      var redness = (255 - distTotal) * (255 / 200);
      var displacement = 15*Math.pow(1.025, (-0.005*Math.pow(distTotal,2)))
      var displacementScalar = displacement/distTotal
      var avoidanceX = distX*displacementScalar
      var avoidanceY = distY*displacementScalar

      point.style.transform = "translate("+avoidanceX+"px, "+avoidanceY+"px)"
      dot.style.fill = "rgb(" + redness + ",0,0)";
    } else {
      point.style.transform = "translate(0px, 0px)"
      dot.style.fill = "black";
    }
  }
}
