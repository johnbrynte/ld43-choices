var input = (function() {

  var self = {
    touch: null,
    cur: null,
    prev: null,
    onTouchStart: callback(),
    onTouchMove: callback(),
    onTouchEnd: callback(),
    onSwipeUp: callback(),
    onSwipeUpRight: callback(),
    onSwipeUpLeft: callback(),
    setContext: setContext,

    lateUpdate: lateUpdate,
    get: get,
    events: {
      touchstart: "touchstart",
      touchmove: "touchmove",
      touchend: "touchend",
    }
  };

  var el = document.body;
  var contextEl = document.body;

  var momentaryEvents = {};
  var events = {};

  init();

  return self;

  ////////////

  function init() {

    momentaryEvents[self.events.touchstart] = false;
    momentaryEvents[self.events.touchend] = false;
    events[self.events.touchmove] = false;

    ////

    // document.addEventListener('touchstart', preventtouchHandler, { passive: false });
    // document.addEventListener('touchmove', preventtouchHandler, { passive: false });

    function preventtouchHandler(evt) {
      evt.preventDefault();
    }

    ////

    el.addEventListener("touchstart", function(evt) {
      //evt.preventDefault();
      if (evt.touches.length > 1) return;
      self.prev = evtToPos(evt.touches[0]);
      self.touch = self.prev;
      self.onTouchStart.emit(self.prev);

      momentaryEvents["touchstart"] = true;
      events["touchmove"] = true;
    }, { passive: false });

    el.addEventListener("touchmove", function(evt) {
      evt.preventDefault();
      if (evt.touches.length < 1) return;
      self.cur = evtToPos(evt.touches[0]);
      self.touch = self.cur;
      self.onTouchMove.emit(self.cur);
    }, { passive: false });

    el.addEventListener("touchend", function(evt) {
      if (!self.cur) return;
      var r = getRelation(self.prev, self.cur);
      var v = Math.atan(r.dy / r.dx);
      if (r.dy < 0) {
        if (r.h < 30) return;
        if (v > 0 && v < 1) self.onSwipeUpLeft.emit();
        else if (v < 0 && v > -1) self.onSwipeUpRight.emit();
        else self.onSwipeUp.emit();
      }
      self.onTouchEnd.emit(self.cur);

      momentaryEvents["touchend"] = true;
      events["touchmove"] = false;

      self.prev = null;
      self.cur = null;
    }, { passive: false });

    el.addEventListener("touchcancel", function(evt) {
      if (!self.cur) return;
      self.onTouchEnd.emit(self.cur);

      momentaryEvents["touchend"] = true;
      events["touchmove"] = false;

      self.prev = null;
      self.cur = null;
    }, { passive: false });

    //

    var mousedown = false;

    el.addEventListener("mousedown", function(evt) {
      if (mousedown)
        return;
      mousedown = true;
      self.prev = evtToPos(evt);
      self.touch = self.prev;
      self.onTouchStart.emit(self.prev);

      momentaryEvents["touchstart"] = true;
      events["touchmove"] = true;
    });

    el.addEventListener("mousemove", function(evt) {
      if (!mousedown)
        return;
      self.cur = evtToPos(evt);
      self.touch = self.cur;
      self.onTouchMove.emit(self.cur);
    });

    el.addEventListener("mouseup", function(evt) {
      mousedown = false;
      self.onTouchMove.emit(self.cur);

      momentaryEvents["touchend"] = true;
      events["touchmove"] = false;
    });

    el.addEventListener("mouseleave", function(evt) {
      if (!mousedown)
        return;
      mousedown = false;
      self.onTouchMove.emit(self.cur);

      momentaryEvents["touchend"] = true;
      events["touchmove"] = false;
    });
  }

  function get(ev) {
    if (ev in momentaryEvents) {
      if (momentaryEvents[ev]) {
        switch (ev) {
          case self.events.touchstart:
            return getContextualPos(self.touch);
          case self.events.touchend:
            return getContextualPos(self.touch);
        }
      }
      return false;
    }
    if (ev in events) {
      if (events[ev]) {
        switch (ev) {
          case self.events.touchmove:
            return getContextualPos(self.touch);
        }
      }
      return false;
    }
    return null;
  }

  function lateUpdate(d) {
    for (var ev in momentaryEvents) {
      momentaryEvents[ev] = false;
    }
  }

  function setContext(e) {
    contextEl = e;
  }

  function callback() {
    var c = function(f) {
      c._cbs.push(f);
    };

    c._cbs = [];

    c.emit = function() {
      var args = [].slice.call(arguments);
      c._cbs.forEach(function(f) {
        f.apply(this, args);
      });
    };

    return c;
  };

  function evtToPos(evt) {
    return {
      x: evt.pageX,
      y: evt.pageY,
    };
  };

  function getContextualPos(pos) {
    var scale = contextEl.clientWidth / size;
    return {
      x: (pos.x - contextEl.offsetLeft) / scale,
      y: (pos.y - contextEl.offsetTop) / scale,
    };
  }

  function getRelation(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var h = Math.sqrt(dx * dx + dy * dy);
    return {
      dx: dx,
      dy: dy,
      h: h,
    };
  };

})();