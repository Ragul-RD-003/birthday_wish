/* ==========================================
   BIRTHDAY WEBSITE - NITHYA
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const birthdayTitle = document.getElementById("birthdayTitle");
    const nameTitle = document.getElementById("nameTitle");
    const quote = document.querySelector(".birthday-quote");

    const song = document.getElementById("birthdaySong");
    const tapOverlay = document.getElementById("tapOverlay");

    const sparklesContainer = document.getElementById("sparkles");
    const petalsContainer = document.getElementById("petals");
    const notesContainer = document.getElementById("musicNotes");

    /* ==========================================
       TEXT REVEAL SEQUENCE
    ========================================== */

    setTimeout(() => {
        birthdayTitle.style.opacity = "1";
        birthdayTitle.style.transform = "translateY(0)";
        birthdayTitle.style.transition =
            "all 1.4s ease";
    }, 600);

    setTimeout(() => {
        nameTitle.style.opacity = "1";
        nameTitle.style.transform = "translateY(0)";
        nameTitle.style.transition =
            "all 1.4s ease";
    }, 2200);

    setTimeout(() => {
        quote.style.opacity = "1";
        quote.style.transform = "translateY(0)";
        quote.style.transition =
            "all 1.2s ease";
    }, 3600);

    /* ==========================================
       AUDIO AUTOPLAY
    ========================================== */

    async function startMusic() {
        try {
            song.volume = 0.8;

            await song.play();

            tapOverlay.classList.add("hidden");

        } catch (err) {

            tapOverlay.classList.remove("hidden");

        }
    }

    startMusic();

    function unlockMusic() {

        song.play().then(() => {

            tapOverlay.classList.add("hidden");

        }).catch(() => {});

        document.removeEventListener("click", unlockMusic);
        document.removeEventListener("touchstart", unlockMusic);
    }

    document.addEventListener("click", unlockMusic);
    document.addEventListener("touchstart", unlockMusic);

    /* ==========================================
       FLOATING MUSIC NOTES
    ========================================== */

    const symbols = [
        "♪",
        "♫",
        "♬",
        "♩"
    ];

    function createMusicNote() {

        const note = document.createElement("div");

        note.classList.add("music-note");

        note.innerText =
            symbols[Math.floor(
                Math.random() * symbols.length
            )];

        const x =
            (Math.random() * 180 - 90) + "px";

        note.style.setProperty("--x", x);

        note.style.fontSize =
            (18 + Math.random() * 22) + "px";

        note.style.animationDuration =
            (4 + Math.random() * 3) + "s";

        notesContainer.appendChild(note);

        setTimeout(() => {
            note.remove();
        }, 7000);
    }

    setInterval(createMusicNote, 450);

    /* ==========================================
       SPARKLES
    ========================================== */

    function createSparkle() {

        const sparkle =
            document.createElement("div");

        sparkle.classList.add("sparkle");

        sparkle.style.left =
            Math.random() * window.innerWidth + "px";

        sparkle.style.top =
            Math.random() * window.innerHeight + "px";

        sparkle.style.animationDuration =
            (2 + Math.random() * 4) + "s";

        sparklesContainer.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 6000);
    }

    setInterval(createSparkle, 250);

    /* ==========================================
       PETALS
    ========================================== */

    function createPetal() {

        const petal =
            document.createElement("div");

        petal.classList.add("petal");

        petal.style.left =
            Math.random() * window.innerWidth + "px";

        petal.style.animationDuration =
            (8 + Math.random() * 10) + "s";

        petal.style.opacity =
            (0.4 + Math.random() * 0.5);

        petal.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        petalsContainer.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 18000);
    }

    setInterval(createPetal, 900);

    /* ==========================================
       NAME SPARKLE BURST
    ========================================== */

    function createNameSparkle() {

        const sparkle =
            document.createElement("div");

        sparkle.classList.add("sparkle");

        const centerX =
            window.innerWidth / 2;

        const centerY =
            window.innerHeight / 2 - 120;

        sparkle.style.left =
            centerX + (Math.random() * 250 - 125) + "px";

        sparkle.style.top =
            centerY + (Math.random() * 100 - 50) + "px";

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 3000);
    }

    setInterval(createNameSparkle, 300);

    /* ==========================================
       PARALLAX EFFECT
    ========================================== */

    document.addEventListener("mousemove", (e) => {

        const auroras =
            document.querySelectorAll(".aurora");

        const moveX =
            (e.clientX / window.innerWidth - 0.5) * 30;

        const moveY =
            (e.clientY / window.innerHeight - 0.5) * 30;

        auroras.forEach((item, index) => {

            item.style.transform =
                `translate(${moveX * (index + 1) * 0.3}px,
                           ${moveY * (index + 1) * 0.3}px)`;
        });

    });

    /* ==========================================
       HEART PULSE TO MUSIC
    ========================================== */

    const heart =
        document.getElementById("crystalHeart");

    setInterval(() => {

        heart.style.transform =
            "scale(1.15)";

        setTimeout(() => {

            heart.style.transform =
                "scale(1)";

        }, 250);

    }, 1800);

});