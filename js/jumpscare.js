document.addEventListener("DOMContentLoaded", () => {
    const gif = new Image();
    gif.src = "assets/secret.gif?reset=" + Date.now();
    gif.style.display = "none";
    gif.id = "secret";
    document.body.appendChild(gif);

    const audioMp3 = new Audio("assets/secret.mp3");
    const audioOgg = new Audio("assets/secret.ogg");

    const toggle = document.getElementById("jumpscare");

    const KEY = "ScareEnabled";

    const saved = localStorage.getItem(KEY);
    toggle.checked = (saved === "true");

    if (!toggle) {
        console.error("ERROR: #jumpscare not found in DOM");
        return;
    }

    console.log("Jumpscare system initialized. Enabled:", toggle.checked);

    let timeoutId = null;

    function showGifOnce() {
        if (!toggle.checked) {
            setNextTime();
            return;
        }

        audioMp3.currentTime = 0;
        audioOgg.currentTime = 0;

        gif.src = "assets/secret.gif?reset=" + Date.now();

        gif.style.display = "block";

        audioMp3.play();
        audioOgg.play();

        setTimeout(() => {
            gif.style.display = "none";
            audioMp3.pause();
            audioOgg.pause();
            setNextTime();
        }, 800);
    }


    function setNextTime() {
        clearTimeout(timeoutId);

        const min = 0.5 * 60 * 1000 // 30 sec min;
        const max = 5 * 60 * 1000 // 5 minuten max;
        const nextTime = Math.random() * (max - min) + min;

        timeoutId = setTimeout(showGifOnce, nextTime);
    }

    toggle.addEventListener("change", () => {

        localStorage.setItem(KEY, String(toggle.checked));
        clearTimeout(timeoutId);

        if (toggle.checked) {
            console.log("Jumpscare system initialized. Enabled: " + toggle.checked);
            showGifOnce(); // show immediately
        } else {
            console.log("Jumpscare system initialized. disabled: " + toggle.checked);
            setNextTime(); // restart timer
        }
    });

    // Start system
    setNextTime();
});
