const weddingDate = new Date("2026-12-10T19:30:00").getTime();

const intro = document.getElementById("intro");
const invite = document.getElementById("invite");
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");

const daysElement = document.getElementById("d");
const hoursElement = document.getElementById("h");
const minutesElement = document.getElementById("m");
const secondsElement = document.getElementById("s");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let inviteOpened = false;
let revealObserver = null;

function syncMusicButton(isPlaying) {
  if (isPlaying) {
    musicBtn.textContent = "♫";
    musicBtn.setAttribute("aria-label", "Pause background music");
    musicBtn.classList.add("is-playing");
  } else {
    musicBtn.textContent = "▷";
    musicBtn.setAttribute("aria-label", "Play background music");
    musicBtn.classList.remove("is-playing");
  }
}

function revealHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  requestAnimationFrame(() => {
    hero.classList.add("is-revealed");
  });
}

function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

function openInvite() {
  if (inviteOpened || !document.body.contains(intro)) return;

  inviteOpened = true;
  invite.hidden = false;
  invite.classList.add("is-open");

  intro.classList.add("hide");

  revealHero();
  initScrollReveals();

  setTimeout(() => {
    if (intro.parentNode) {
      intro.remove();
    }
  }, 1000);

  bgm
    .play()
    .then(() => {
      syncMusicButton(true);
    })
    .catch(() => {
      syncMusicButton(false);
    });
}

function toggleMusic() {
  if (bgm.paused) {
    bgm
      .play()
      .then(() => {
        syncMusicButton(true);
      })
      .catch(() => {
        syncMusicButton(false);
      });
  } else {
    bgm.pause();
    syncMusicButton(false);
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

  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);

  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);

  const seconds = Math.floor((timeRemaining / 1000) % 60);

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

if (prefersReducedMotion && intro) {
  intro.style.animation = "none";
}

(() => {
  "use strict";

  const intro = document.getElementById("intro");
  const invite = document.getElementById("invite");
  const music = document.getElementById("bgm");
  const musicButton = document.getElementById("musicBtn");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let inviteOpened = false;
  let revealObserver = null;
  let petalObserver = null;
  let countdownTimer = null;

  document.documentElement.classList.add("motion-ready");

  if (intro && invite?.hidden) {
    document.body.classList.add("invite-locked");
  }

  /* -------------------------------------------------------
     PREPARE REVEAL TIMING
     Short repeating delays avoid making later events wait.
     ------------------------------------------------------- */

  document.querySelectorAll(".events .event").forEach((event, index) => {
    event.style.setProperty(
      "--reveal-delay",
      `${(index % 3) * 110}ms`
    );
  });

  document.querySelectorAll(".couple-grid .reveal").forEach(
    (element, index) => {
      element.style.setProperty(
        "--reveal-delay",
        `${index * 130}ms`
      );
    }
  );

  document.querySelectorAll(".family-list").forEach((list) => {
    Array.from(list.children).forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty(
        "--reveal-delay",
        `${(index % 4) * 65}ms`
      );
    });
  });

  /* -------------------------------------------------------
     SCROLL REVEALS
     Reveal once; do not hide content again when scrolling up.
     ------------------------------------------------------- */

  function startScrollReveals() {
    const elements = document.querySelectorAll("#invite .reveal");

    if (
      reducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -24px 0px"
      }
    );

    elements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* -------------------------------------------------------
     PETALS
     Run only while their container is on screen.
     ------------------------------------------------------- */

  function startPetals() {
    const fields = document.querySelectorAll(".petal-field");

    if (
      reducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      fields.forEach((field) => {
        field.classList.toggle("is-active", !reducedMotion.matches);
      });
      return;
    }

    petalObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(
          "is-active",
          entry.isIntersecting
        );
      });
    });

    fields.forEach((field) => petalObserver.observe(field));
  }

  /* -------------------------------------------------------
     MUSIC
     Start playback directly from the opening gesture.
     A blocked or missing audio file does not block the invite.
     ------------------------------------------------------- */

  function updateMusicButton() {
    if (!music || !musicButton) return;

    const playing = !music.paused && !music.ended;

    musicButton.classList.toggle("is-playing", playing);
    musicButton.setAttribute("aria-pressed", String(playing));
    musicButton.setAttribute(
      "aria-label",
      playing
        ? "Pause background music"
        : "Play background music"
    );
  }

  function playMusic() {
    if (!music) return;

    music.volume = 0.45;

    const playback = music.play();

    if (playback && typeof playback.catch === "function") {
      playback.catch(() => {
        updateMusicButton();
      });
    }
  }

  window.toggleMusic = function toggleMusic() {
    if (!music) return;

    if (music.paused) {
      playMusic();
    } else {
      music.pause();
    }
  };

  if (music) {
    music.addEventListener("play", updateMusicButton);
    music.addEventListener("pause", updateMusicButton);
    music.addEventListener("ended", updateMusicButton);
    music.addEventListener("error", updateMusicButton);
  }
/* Pause music when the page is hidden; resume on return if it was playing. */
let resumeOnReturn = false;

document.addEventListener("visibilitychange", () => {
  if (!music) return;

  if (document.hidden) {
    resumeOnReturn = !music.paused;
    music.pause();
  } else if (resumeOnReturn) {
    resumeOnReturn = false;
    playMusic();
  }
});

/* iOS Safari sometimes skips visibilitychange when navigating away. */
window.addEventListener("pagehide", () => {
  if (music) music.pause();
});

  updateMusicButton();

  /* -------------------------------------------------------
     OPEN INVITATION
     ------------------------------------------------------- */

  window.openInvite = function openInvite() {
    if (inviteOpened || !invite) return;
    inviteOpened = true;

    playMusic();

    invite.hidden = false;
    invite.setAttribute("tabindex", "-1");

    if (intro) {
      intro.classList.add("is-opening");
      intro.setAttribute("aria-disabled", "true");
      intro.tabIndex = -1;
    }

    window.scrollTo({ top: 0, behavior: "instant" });

    const openingDuration = reducedMotion.matches ? 0 : 850;

    window.setTimeout(() => {
      if (intro) {
        intro.hidden = true;
      }

      document.body.classList.remove("invite-locked");
      invite.focus({ preventScroll: true });

      /*
       * Two frames ensure the initial hidden styles are painted
       * before hero transitions begin.
       */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.querySelectorAll(".hero .reveal-item").forEach(
            (element) => {
              element.classList.add("is-visible");
            }
          );

          startScrollReveals();
        });
      });
    }, openingDuration);
  };

  /* The intro div already handles clicks through your HTML. */
  intro?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.openInvite();
    }
  });

  /* -------------------------------------------------------
     COUNTDOWN
     Uses the displayed 7:00 PM time in India's time zone.
     ------------------------------------------------------- */

  const weddingTime = new Date(
    "2026-12-10T19:00:00+05:30"
  ).getTime();

  const countdownElements = {
    days: document.getElementById("d"),
    hours: document.getElementById("h"),
    minutes: document.getElementById("m"),
    seconds: document.getElementById("s")
  };

  function updateDigit(element, value) {
    if (!element) return;

    const nextValue = String(value).padStart(2, "0");

    if (element.textContent === nextValue) return;

    element.textContent = nextValue;

    if (reducedMotion.matches || invite?.hidden) return;

    element.classList.remove("digit-changing");

    // Restart the animation only when the displayed number changes.
    void element.offsetWidth;

    element.classList.add("digit-changing");
  }

  function updateCountdown() {
    const remaining = Math.max(0, weddingTime - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);

    updateDigit(
      countdownElements.days,
      Math.floor(totalSeconds / 86400)
    );

    updateDigit(
      countdownElements.hours,
      Math.floor((totalSeconds % 86400) / 3600)
    );

    updateDigit(
      countdownElements.minutes,
      Math.floor((totalSeconds % 3600) / 60)
    );

    updateDigit(
      countdownElements.seconds,
      totalSeconds % 60
    );

    if (remaining === 0 && countdownTimer !== null) {
      window.clearInterval(countdownTimer);
      countdownTimer = null;
    }

    return remaining;
  }

  if (updateCountdown() > 0) {
    countdownTimer = window.setInterval(updateCountdown, 1000);
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateCountdown();
    }
  });

  /* Respond if reduced-motion preference changes while open. */
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      revealObserver?.disconnect();

      document.querySelectorAll(".reveal, .reveal-item").forEach(
        (element) => {
          element.classList.add("is-visible");
        }
      );
    }
  });

  startPetals();
})();
