
//////////////////////
// INPUT

document.addEventListener('touchstart', preventtouchHandler, {passive: false});
document.addEventListener('touchmove', preventtouchHandler, {passive: false});

function preventtouchHandler(evt) {
  evt.preventDefault();
}

var callback = () => {
  var c = f => c._cbs.push(f);
  c._cbs = [];
  c.emit = (...args) => {
    c._cbs.forEach(f => f.apply(this, args));
  };
  return c;
};

var evtToPos = evt => {
  return {
    x: evt.pageX,
    y: evt.pageY,
  };
};

var getRelation = (a, b) => {
  var dx = b.x-a.x;
  var dy = b.y-a.y;
  var h = Math.sqrt(dx*dx+dy*dy);
  return {
    dx: dx,
    dy: dy,
    h: h,
  };
};

var input = {
  cur: null,
  prev: null,
  onTouchStart: callback(),
  onTouchMove: callback(),
  onTouchEnd: callback(),
  onSwipeUp: callback(),
  onSwipeUpRight: callback(),
  onSwipeUpLeft: callback(),
};

var el = document.getElementById("container");

console.log(window.document.body.ontouchstart)

el.addEventListener("touchstart", (evt) => {
  evt.preventDefault();
  if (evt.touches.length > 1) return;
  input.prev = evtToPos(evt.touches[0]);
  input.onTouchStart.emit(input.prev);
});

el.addEventListener("touchmove", (evt) => {
  evt.preventDefault();
  if (evt.touches.length < 1) return;
  input.cur = evtToPos(evt.touches[0]);
  input.onTouchMove.emit(input.cur);
});

el.addEventListener("touchend", (evt) => {
  if (!input.cur) return;
  var r = getRelation(input.prev, input.cur);
  var v = Math.atan(r.dy/r.dx);
  if (r.dy < 0) {
    if (r.h < 30) return;
    if (v > 0 && v < 1) input.onSwipeUpLeft.emit();
    else if (v < 0 && v > -1) input.onSwipeUpRight.emit();
    else input.onSwipeUp.emit();
  }
  input.onTouchEnd.emit(input.cur);
  
  input.prev = null;
  input.cur = null;
});
