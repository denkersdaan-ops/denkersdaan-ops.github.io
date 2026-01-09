document.addEventListener("DOMContentLoaded", () => {
  const sections = [
    ...document.querySelectorAll("main > section.panel"),
    document.querySelector("footer"),
  ].filter(Boolean);

  const targets = sections.filter(el => el.id);
  if (targets.length === 0) return;

  let isSnapping = false;
  let scrollStopTimer = null;
  let lastHash = "";

  const STOP_DELAY_MS = 80;     // wanneer we "gestopt" zijn met scrollen
  const EDGE_PX = 120;           // hoe dicht bij een section-rand om te mogen snappen
  const MIN_MOVE_PX = 8;         // voorkom micro-snaps

  function getDocTop(el) {
    return window.scrollY + el.getBoundingClientRect().top;
  }
  function getDocBottom(el) {
    return window.scrollY + el.getBoundingClientRect().bottom;
  }

  function updateHashByCenter() {
    const centerY = window.scrollY + window.innerHeight / 2;

    let best = null;
    let bestDist = Infinity;

    for (const el of targets) {
      const top = getDocTop(el);
      const bottom = getDocBottom(el);
      const clamped = Math.max(top, Math.min(centerY, bottom));
      const dist = Math.abs(centerY - clamped);

      if (dist < bestDist) {
        bestDist = dist;
        best = el;
      }
    }

    if (!best) return;
    const newHash = `#${best.id}`;
    if (newHash !== lastHash) {
      lastHash = newHash;
      history.replaceState(null, "", newHash);
    }
  }

  // Vind huidige section op basis van viewport center
  function currentSectionIndex() {
    const centerY = window.scrollY + window.innerHeight / 2;

    for (let i = 0; i < targets.length; i++) {
      const el = targets[i];
      const top = getDocTop(el);
      const bottom = getDocBottom(el);
      if (centerY >= top && centerY <= bottom) return i;
    }

    // fallback: dichtstbij
    let bestI = 0, bestD = Infinity;
    for (let i = 0; i < targets.length; i++) {
      const top = getDocTop(targets[i]);
      const d = Math.abs(top - window.scrollY);
      if (d < bestD) { bestD = d; bestI = i; }
    }
    return bestI;
  }

  function smoothSnapToY(targetY) {
    const diff = Math.abs(targetY - window.scrollY);
    if (diff < MIN_MOVE_PX) return;

    isSnapping = true;
    window.scrollTo({ top: targetY, behavior: "smooth" });

    const start = performance.now();
    const maxMs = 900;

    (function checkDone() {
      updateHashByCenter();
      const left = Math.abs(window.scrollY - targetY);
      const now = performance.now();

      if (left < 2 || now - start > maxMs) {
        isSnapping = false;
        return;
      }
      requestAnimationFrame(checkDone);
    })();
  }

  function maybeSnap() {
    if (isSnapping) return;

    const i = currentSectionIndex();
    const el = targets[i];

    const top = getDocTop(el);
    const bottom = getDocBottom(el);

    const viewTop = window.scrollY;
    const viewBottom = window.scrollY + window.innerHeight;

    const distToTopEdge = Math.abs(viewTop - top);
    const distToBottomEdge = Math.abs(viewBottom - bottom);

    const isTall = (bottom - top) > window.innerHeight + 1;

    // 1) Als section groter is dan viewport:
    //    - laat normaal scrollen
    //    - snap alleen als je dicht bij top/bottom rand bent
    if (isTall) {
      if (distToTopEdge <= EDGE_PX) {
        smoothSnapToY(top);
      } else if (distToBottomEdge <= EDGE_PX) {
        // naar begin van volgende section als die bestaat (of precies bottom)
        const next = targets[i + 1];
        if (next) smoothSnapToY(getDocTop(next));
        else smoothSnapToY(bottom - window.innerHeight); // bij footer-einde-ish
      }
      return;
    }

    // 2) Als section <= viewport (klassiek "1 scherm per panel"):
    //    snap naar top van de huidige section
    smoothSnapToY(top);
  }

  function onScroll() {
    updateHashByCenter();

    if (isSnapping) return;

    clearTimeout(scrollStopTimer);
    scrollStopTimer = setTimeout(() => {
      maybeSnap();
    }, STOP_DELAY_MS);
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Init: zet hash correct
  updateHashByCenter();

  // Als je met hash binnenkomt, laat de browser eerst landen en stabiliseer
  if (location.hash) {
    setTimeout(() => {
      updateHashByCenter();
      // niet meteen aggressief snappen bij tall sections; maybeSnap regelt dat
      maybeSnap();
    }, 60);
  }
});
