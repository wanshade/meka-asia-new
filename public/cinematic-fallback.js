(function () {
  "use strict";

  window.__mekaFilmFallbackInstalled = true;

  var TIMES = ["07:00", "10:00", "12:00", "16:00", "19:00"];
  var LABELS = [
    "Morning at Home",
    "Entrance Walkthrough",
    "Living Room",
    "Poolside Afternoon",
    "Future Secured",
  ];
  var SEGMENTS = [
    { kind: "hold", scene: 0, a: 0, b: 0.12 },
    { kind: "fade", from: 0, to: 1, a: 0.12, b: 0.2 },
    { kind: "hold", scene: 1, a: 0.2, b: 0.32 },
    { kind: "fade", from: 1, to: 2, a: 0.32, b: 0.4 },
    { kind: "hold", scene: 2, a: 0.4, b: 0.52 },
    { kind: "fade", from: 2, to: 3, a: 0.52, b: 0.6 },
    { kind: "hold", scene: 3, a: 0.6, b: 0.72 },
    { kind: "fade", from: 3, to: 4, a: 0.72, b: 0.8 },
    { kind: "hold", scene: 4, a: 0.8, b: 1 },
  ];
  var PUSH_WINDOWS = [
    { start: 0, end: 0.2 },
    { start: 0.12, end: 0.4 },
    { start: 0.32, end: 0.6 },
    { start: 0.52, end: 0.8 },
    { start: 0.72, end: 1 },
  ];

  var controllerStarted = false;

  function clamp(value) {
    return Math.min(1, Math.max(0, value));
  }

  function getScrollY() {
    return (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  function isTouchDevice() {
    var coarse = false;
    try {
      coarse = window.matchMedia("(pointer: coarse)").matches;
    } catch (_error) {
      coarse = false;
    }
    return (
      "ontouchstart" in window ||
      (navigator.maxTouchPoints || 0) > 0 ||
      coarse
    );
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (_error) {
      return false;
    }
  }

  function resolveSegment(progress) {
    var p = clamp(progress);
    for (var i = 0; i < SEGMENTS.length; i += 1) {
      var segment = SEGMENTS[i];
      if (p < segment.b || i === SEGMENTS.length - 1) {
        var span = segment.b - segment.a || 1;
        return {
          segment: segment,
          t: clamp((p - segment.a) / span),
          progress: p,
        };
      }
    }
    return { segment: SEGMENTS[SEGMENTS.length - 1], t: 1, progress: p };
  }

  function startController() {
    if (controllerStarted) return true;

    var wrapper = document.getElementById("filmWrapper");
    var stage = document.getElementById("filmStage");
    var clock = document.getElementById("filmClock");
    var label = document.getElementById("filmLabel");
    var progressBar = document.getElementById("filmProg");
    var slides = document.querySelectorAll("#filmStage .film-slide");

    if (!wrapper || !stage || !clock || !label || !slides.length) return false;

    var reducedMotion = prefersReducedMotion();
    if (!isTouchDevice() && window.innerWidth > 767 && !reducedMotion) {
      return false;
    }

    controllerStarted = true;
    window.__mekaFilmFallbackActive = true;
    wrapper.setAttribute("data-film-driver", "native-fallback");

    var scrollRange = 1;
    var rafId = 0;
    var momentumId = 0;
    var maxScale = 1.015;
    var startScale = 1 - (maxScale - 1) * 0.35;
    var pan = 8;

    function setSlideState(slide, active, opacity, index, progress) {
      slide.style.opacity = String(opacity);
      slide.style.visibility = active ? "visible" : "hidden";
      slide.style.pointerEvents = active ? "auto" : "none";

      if (active) {
        slide.classList.add("is-active");
        slide.classList.remove("is-idle");
      } else {
        slide.classList.remove("is-active");
        slide.classList.add("is-idle");
      }

      if (!active || reducedMotion) {
        slide.style.transform = "none";
        return;
      }

      var push = PUSH_WINDOWS[index];
      var local = push
        ? clamp((progress - push.start) / (push.end - push.start || 1))
        : 0;
      var scale = startScale + (maxScale - startScale) * local;
      var direction = index % 2 === 0 ? 1 : -1;
      slide.style.transform =
        "translate3d(" + direction * pan * local + "px,0,0) scale(" + scale + ")";
    }

    function render(progress) {
      var resolved = resolveSegment(progress);
      var segment = resolved.segment;
      var t = resolved.t;
      var current;
      var next;
      var currentOpacity;
      var nextOpacity;

      if (segment.kind === "hold") {
        current = segment.scene;
        next = Math.min(slides.length - 1, current + 1);
        currentOpacity = 1;
        nextOpacity = 0;
      } else {
        current = segment.from;
        next = segment.to;
        currentOpacity = 1 - t;
        nextOpacity = t;
      }

      var textScene = nextOpacity > currentOpacity ? next : current;

      for (var i = 0; i < slides.length; i += 1) {
        var opacity = 0;
        if (reducedMotion) {
          opacity = i === textScene ? 1 : 0;
        } else if (i === current) {
          opacity = currentOpacity;
        } else if (i === next) {
          opacity = nextOpacity;
        }
        setSlideState(slides[i], opacity > 0.001, opacity, i, resolved.progress);
      }

      clock.textContent = TIMES[textScene] || "";
      label.textContent = LABELS[textScene] || "";
      clock.style.opacity = "1";
      clock.style.transform = "none";
      label.style.opacity = "1";
      label.style.transform = "none";

      if (progressBar) {
        progressBar.style.transformOrigin = "left center";
        progressBar.style.transform = "scaleX(" + resolved.progress + ")";
      }
      wrapper.setAttribute(
        "data-film-progress",
        String(Math.round(resolved.progress * 1000) / 1000)
      );
    }

    function update() {
      rafId = 0;
      var scrollY = getScrollY();
      var documentTop = wrapper.getBoundingClientRect().top + scrollY;
      render((scrollY - documentTop) / scrollRange);
    }

    function scheduleUpdate() {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    }

    function measure() {
      var viewportHeight = Math.max(
        1,
        document.documentElement.clientHeight || window.innerHeight || 1
      );
      var stageHeight = stage.offsetHeight || viewportHeight;
      var candidateRange = wrapper.offsetHeight - stageHeight;

      // Repair the runway with plain pixels when old Safari drops svh rules.
      if (candidateRange < viewportHeight * 2.5) {
        wrapper.style.height = Math.round(viewportHeight * 4.5) + "px";
        wrapper.style.minHeight = Math.round(viewportHeight * 4.5) + "px";
        stage.style.position = "sticky";
        stage.style.top = "0";
        stage.style.height = viewportHeight + "px";
        stage.style.minHeight = viewportHeight + "px";
        stageHeight = stage.offsetHeight || viewportHeight;
        candidateRange = wrapper.offsetHeight - stageHeight;
      }

      scrollRange = Math.max(1, candidateRange);
      scheduleUpdate();
    }

    function startMomentumWatch() {
      if (momentumId) window.cancelAnimationFrame(momentumId);
      var frames = 0;
      var stableFrames = 0;
      var lastY = getScrollY();

      function watch() {
        update();
        frames += 1;
        var nextY = getScrollY();
        if (Math.abs(nextY - lastY) < 0.5) stableFrames += 1;
        else stableFrames = 0;
        lastY = nextY;

        if (frames < 240 && stableFrames < 14) {
          momentumId = window.requestAnimationFrame(watch);
        } else {
          momentumId = 0;
        }
      }

      momentumId = window.requestAnimationFrame(watch);
    }

    function onResize() {
      measure();
      startMomentumWatch();
    }

    window.addEventListener("scroll", scheduleUpdate, false);
    document.addEventListener("scroll", scheduleUpdate, true);
    window.addEventListener("touchstart", startMomentumWatch, false);
    window.addEventListener("touchmove", scheduleUpdate, false);
    window.addEventListener("touchend", startMomentumWatch, false);
    window.addEventListener("resize", onResize, false);
    window.addEventListener("orientationchange", onResize, false);
    window.addEventListener("pageshow", onResize, false);

    if (window.visualViewport) {
      window.visualViewport.addEventListener("scroll", scheduleUpdate, false);
      window.visualViewport.addEventListener("resize", onResize, false);
    }

    measure();
    window.setTimeout(measure, 250);
    window.setTimeout(measure, 1000);
    return true;
  }

  function boot() {
    try {
      if (
        window.matchMedia("(max-width: 767px)").matches &&
        document.querySelector(".film-mobile-caption")
      ) {
        return;
      }
    } catch (_error) {
      // Continue with the legacy fallback when matchMedia is unavailable.
    }

    if (startController()) return;

    var attempts = 0;
    var retry = window.setInterval(function () {
      attempts += 1;
      if (startController() || attempts >= 40) window.clearInterval(retry);
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, false);
  } else {
    boot();
  }
})();
