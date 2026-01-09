document.addEventListener("DOMContentLoaded", () => {
    const dvd = new Image();
    dvd.src = "assets/DVD_logo.png";
    dvd.id = "dvd-bounce";

    document.body.appendChild(dvd);

    let posX = (window.innerWidth - dvd.width) / 2;
    let posY = (window.innerHeight - dvd.height) / 2;
    let velX = 2 + Math.random() * 5;
    let velY = 2 + Math.random() * 5;

    let hue = Math.random() * 360;

    const toggle = document.getElementById("dvd-bounce-toggle");


    const KEY = "DvdBounceEnabled";

    const saved = localStorage.getItem(KEY);
    toggle.checked = (saved === "true");

    function updatePosition() {
        posX += velX;
        posY += velY;
    }

    function checkCollision() {
        if (posX <= 0 || posX + dvd.width >= window.innerWidth) {
            hue += 90 + Math.random() * 10;
            velX = -velX;
        }
        if (posY <= 0 || posY + dvd.height >= window.innerHeight) {
            hue += 90 + Math.random() * 10;
            velY = -velY;
        }
    }

    function changeColor() {

        hue = hue % 360;

        if (!toggle.checked) {
            dvd.style.filter = [
                "brightness(0)",
                "opacity(0%)",
                "saturate(100%)",
                "invert(62%)",
                "sepia(83%)",
                "saturate(3500%)",
                "brightness(87%)",
                "contrast(89%)",
                `hue-rotate(${hue}deg)`
            ].join(" ");
        } else {
            dvd.style.filter = [
                "brightness(0)",
                "opacity(100%)",
                "saturate(100%)",
                "invert(62%)",
                "sepia(83%)",
                "saturate(3500%)",
                "brightness(87%)",
                "contrast(89%)",
                `hue-rotate(${hue}deg)`
            ].join(" ");
        }
    }
    
    toggle.addEventListener("change", () => {
        localStorage.setItem(KEY, String(toggle.checked));
    });

    function animate() {
        updatePosition();
        checkCollision();
        changeColor();
        dvd.style.left = posX + "px";
        dvd.style.top = posY + "px";

        requestAnimationFrame(animate);
    }

    animate();
});