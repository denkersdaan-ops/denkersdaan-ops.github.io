document.addEventListener("DOMContentLoaded", () => {
  const panels = [
    ...document.querySelectorAll("main > section.panel"),
    document.querySelector("footer"),
  ].filter(Boolean);

  const targets = panels.filter(p => p.id);
  if (!targets.length) return;

  const TOL = 30;  // tolerance in pixels when scrolling(less sensitive to small panels)
  const DURATION = 240; // time to move between panels in ms

  let lastY = window.scrollY;
  let lastHash = "";
  let isAnimating = false;

  function docTop(el) {
    return window.scrollY + el.getBoundingClientRect().top;
  }
  function docBottom(el) {
    return window.scrollY + el.getBoundingClientRect().bottom;
  }

  function getCurrentIndex() {
    const centerY = window.scrollY + window.innerHeight / 2;

    for (let i = 0; i < targets.length; i++) {
      const t = docTop(targets[i]);
      const b = docBottom(targets[i]);
      if (centerY >= t && centerY <= b) return i;
    }

    let bestI = 0, bestD = Infinity;
    for (let i = 0; i < targets.length; i++) {
      const d = Math.abs(docTop(targets[i]) - window.scrollY);
      if (d < bestD) { bestD = d; bestI = i; }
    }
    return bestI;
  }

  function setHashByIndex(i) {
    const id = targets[i]?.id;
    if (!id) return;
    const h = `#${id}`;
    if (h !== lastHash) {
      lastHash = h;
      history.replaceState(null, "", h);
    }
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  let animRAF = 0;
  function cancelAnim() {
    if (animRAF) cancelAnimationFrame(animRAF);
    animRAF = 0;
    isAnimating = false;
  }

  function animateScrollTo(targetY, duration = DURATION) {
    cancelAnim();

    const startY = window.scrollY;
    const delta = targetY - startY;


    if (Math.abs(delta) < 2) return;

    isAnimating = true;
    const startT = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - startT) / duration);
      const eased = easeInOutCubic(t);

      window.scrollTo(0, startY + delta * eased);

      if (t < 1) {
        animRAF = requestAnimationFrame(step);
      } else {
        animRAF = 0;
        isAnimating = false;
      }
    };

    animRAF = requestAnimationFrame(step);
  }

  window.addEventListener("keydown", (e) => {

    const keys = ["ArrowDown","ArrowUp","PageDown","PageUp","Home","End"];
    if (keys.includes(e.key)) cancelAnim();
  });


  function enforceEdges(direction) {
    const i = getCurrentIndex();
    const el = targets[i];
    if (!el) return;

    const top = docTop(el);
    const bottom = docBottom(el);

    const viewTop = window.scrollY;
    const viewBottom = viewTop + window.innerHeight;

    setHashByIndex(i);

    if (direction > 0) {

      if (viewBottom > bottom + TOL) {
        const next = targets[i + 1];
        if (next) {
          animateScrollTo(docTop(next));
          setHashByIndex(i + 1);
        }
      }
    } else if (direction < 0) {

      if (viewTop < top - TOL) {
        const prev = targets[i - 1];
        if (prev) {
          const prevBottom = docBottom(prev);
          const y = Math.max(0, prevBottom - window.innerHeight);
          animateScrollTo(y);
          setHashByIndex(i - 1);
        }
      }
    }
  }
  let raf = 0;
  function onScroll() {
    if (isAnimating) return;

    const y = window.scrollY;
    const dir = y > lastY ? 1 : y < lastY ? -1 : 0;
    lastY = y;

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => enforceEdges(dir));
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  setHashByIndex(getCurrentIndex());
});
