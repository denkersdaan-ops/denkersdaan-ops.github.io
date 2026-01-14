document.addEventListener("DOMContentLoaded", () => {
    let lastScrollY = window.scrollY;
    const header = document.getElementById("header-site");
    const settingsButton = document.getElementById("settings");

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            header.classList.add("hide");
            settingsButton.classList.add("hide");
        } else {
            header.classList.remove("hide");
            settingsButton.classList.remove("hide");
        }

        lastScrollY = currentScrollY;
    });
});