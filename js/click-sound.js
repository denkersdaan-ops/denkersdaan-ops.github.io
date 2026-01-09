document.addEventListener("DOMContentLoaded", () => {
  const soundFolders = [
    "click-sound/sound1/",
    "click-sound/sound2/",
    "click-sound/sound3/",
    "click-sound/sound4/",
    "click-sound/sound5/"
  ];

  const toggle = document.getElementById("click-sounds");
  const KEY = "ClickSoundEnabled";

  const saved = localStorage.getItem(KEY);
  toggle.checked = (saved === "true");

  const sounds = [];

  function loadSounds() {
    soundFolders.forEach(folder => {
      sounds.push({
        mp3: new Audio(folder + "click.mp3"),
        ogg: new Audio(folder + "click.ogg")
      });
    });
  }

  function getRandomSound() {
    return sounds[Math.floor(Math.random() * sounds.length)];
  }

  function playRandomSound() {
    if (!toggle.checked) return;

    const sound = getRandomSound();
    if (!sound) return;

    sound.mp3.currentTime = 0;
    sound.ogg.currentTime = 0;

    sound.mp3.play();
    sound.ogg.play();
  }

  loadSounds();
  document.body.addEventListener("click", playRandomSound);

  toggle.addEventListener("change", () => {
    localStorage.setItem(KEY, String(toggle.checked));
  });
});
