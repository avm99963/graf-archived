// *********** HERE STARTS circle-mode.js *************

function isInRect(x, y, rect) {
  if (x < -10000 || x > 10000) return true;
  if (y < -10000 || y > 10000) return true;

  var ans = true;
  var c = crossProd(rect[0], rect[1], x, y);

  for (var i = 1; i < 4; i++) {
    var temp = crossProd(rect[i], rect[(i+1)%4], x, y);
    if (c*temp < 0) ans = false;
  }
  return ans;
}

function crossProd(r1, r2, x, y) {
  return r1[0]*r2[1] + r2[0]*y + x*r1[1] - r1[0]*y - r2[0]*r1[1] - x*r2[1];
}
