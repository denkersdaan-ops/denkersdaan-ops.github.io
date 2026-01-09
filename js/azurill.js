document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("azurill-toggle");

    let gif = null;
    let animFrame = null;
    let target = null;
    let lastTime = null;

    const speed = 120

    const KEY = "AzurillEnabled";

    const saved = localStorage.getItem(KEY);
    toggle.checked = (saved === "true");

    function spawnAzurril() {

        gif = document.createElement("video");
        gif.src = "assets/Azurill.webm";
        gif.id = "azurill";
        gif.loop = true;
        gif.muted = true;
        gif.autoplay = true;
        gif.playbackRate = 0.7;

        document.body.appendChild(gif);

        gif.addEventListener("loadedmetadata", () => {
            const maxX = window.innerWidth - gif.videoWidth;
            const maxY = window.innerHeight - gif.videoHeight;

            gif.x = Math.random() * maxX;
            gif.y = Math.random() * maxY;

            gif.style.left = gif.x + "px";
            gif.style.top = gif.y + "px";

            startMovement();
        });
    }

    function removeAzurril() {
        cancelAnimationFrame(animFrame);
        animFrame = null;

        if (gif) {
            gif.remove();
            gif = null;
        }

        lastTime = null;
        target = null;
    }

    function getRandomTarget() {
        const maxX = window.innerWidth - gif.videoWidth;
        const maxY = window.innerHeight - gif.videoHeight;

        return {
            x: Math.random() * maxX,
            y: Math.random() * maxY
        };
    }

    function startMovement() {
        target = getRandomTarget();
        lastTime = null;
        animFrame = requestAnimationFrame(moveLoop);
    }

    function moveLoop(timestamp) {

        if (!lastTime) lastTime = timestamp;
        const delta = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        if (gif.x < -10) {
            gif.x = -5 - gif.videoWidth
            target = getRandomTarget();
        }
        if (gif.x > window.innerWidth + 10) {
            gif.x = 5 + window.innerWidth
            target = getRandomTarget();
        }
        if (gif.y < -10) {
            gif.y = -5 - gif.videoHeight
            target = getRandomTarget();
        }
        if (gif.y > window.innerHeight + 10) {
            gif.y = 5 + window.innerHeight
            target = getRandomTarget();
        }

        const dx = target.x - gif.x;
        const dy = target.y - gif.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 4) {
            target = getRandomTarget();
        } else {
            gif.x += (dx / dist) * speed * delta;
            gif.y += (dy / dist) * speed * delta;
        }

        gif.style.left = gif.x + "px";
        gif.style.top = gif.y + "px";

        if (dx < 0) {
            gif.style.transform = "scaleX(1)";
        } else {
            gif.style.transform = "scaleX(-1)";
        }

        animFrame = requestAnimationFrame(moveLoop);
    }

    toggle.addEventListener("change", () => {
        localStorage.setItem(KEY, String(toggle.checked));
        if (toggle.checked) {
            spawnAzurril();
        } else {
            removeAzurril();
        }
    });

    if (toggle.checked) spawnAzurril();
});
