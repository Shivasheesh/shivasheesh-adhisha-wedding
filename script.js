const weddingDate = new Date("2026-12-10T19:30:00").getTime();

const intro = document.getElementById("intro");
const invite = document.getElementById("invite");
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");

const daysElement = document.getElementById("d");
const hoursElement = document.getElementById("h");
const minutesElement = document.getElementById("m");
const secondsElement = document.getElementById("s");

function openInvite() {
  invite.hidden = false;

  intro.classList.add("hide");

  setTimeout(() => {
    intro.remove();
  }, 900);

  bgm.play()
    .then(() => {
      musicBtn.textContent = "♫";
      musicBtn.setAttribute("aria-label", "Pause background music");
    })
    .catch(() => {
      musicBtn.textContent = "▷";
      musicBtn.setAttribute("aria-label", "Play background music");
    });
}

function toggleMusic() {
  if (bgm.paused) {
    bgm.play()
      .then(() => {
        musicBtn.textContent = "♫";
        musicBtn.setAttribute("aria-label", "Pause background music");
      })
      .catch(() => {
        musicBtn.textContent = "▷";
      });
  } else {
    bgm.pause();
    musicBtn.textContent = "▷";
    musicBtn.setAttribute("aria-label", "Play background music");
  }
}

function addLeadingZero(number) {
  return String(number).padStart(2, "0");
}

function updateCountdown() {
  const now = Date.now();
  const timeRemaining = weddingDate - now;

  if (timeRemaining <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    return;
  }

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (timeRemaining / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (timeRemaining / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (timeRemaining / 1000) % 60
  );

  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

updateCountdown();

setInterval(updateCountdown, 1000);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && document.body.contains(intro)) {
    openInvite();
  }
});