import { fileListUpdateHandler } from "./api.js"
import { pickCatImage, pickCatFromLocal } from "./utils.js"

/** Image load timeout  */
const LOAD_TIMEOUT = 1000

/** timeout ID */
let timeoutChecker = null

document.addEventListener("DOMContentLoaded", () => {
    const colors = ["##ffdede", "#fffac4", "#e9f9d6", "#daf3ff", "#f8deff", "#ACF1E8", "#fde2e4", "#e2ece9", "#cddafd", "#eae4e9", "#fff1e6","#fde2e4","#fad2e1","#dfe7fd"]; // Lista kolorów
    const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Wybierz losowy kolor
    document.documentElement.style.setProperty("--background", randomColor); // Ustaw kolor jako zmienną CSS
    // Lista słów opisujących ptaki
    const adjectives = ["Majestic", "Graceful", "Swift", "Colorful", "Elegant", "Vibrant"];
    const nouns = ["Sparrow", "Eagle", "Parrot", "Falcon", "Robin", "Hummingbird"];

    // Wybierz dwa losowe słowa
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    // Ustaw tytuł
    const titleElement = document.querySelector(".bird-title");
    titleElement.textContent = `${randomAdjective} ${randomNoun}`;

    const image = document.querySelector("img.cat");
    const THRESHOLD = 15;

    function handleHover(e) {
        const { clientX, clientY, currentTarget } = e;
        const { clientWidth, clientHeight } = currentTarget;
        const offsetLeft = currentTarget.getBoundingClientRect().left;
        const offsetTop = currentTarget.getBoundingClientRect().top;

        const horizontal = (clientX - offsetLeft) / clientWidth;
        const vertical = (clientY - offsetTop) / clientHeight;

        const rotateX = (THRESHOLD / 2 - vertical * THRESHOLD).toFixed(2);
        const rotateY = (horizontal * THRESHOLD - THRESHOLD / 2).toFixed(2);

        // Keep the image centered with translate(-50%, -50%)
        currentTarget.style.transform = `
            translate(-50%, -50%)
            perspective(${clientWidth}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;
    }

    function resetStyles(e) {
        // Reset transform to keep the image centered
        e.currentTarget.style.transform = `
            translate(-50%, -50%)
            perspective(${e.currentTarget.clientWidth}px)
            rotateX(0deg)
            rotateY(0deg)
            scale(0.7)
        `;
    }

    image.addEventListener("mousemove", handleHover);
    image.addEventListener("mouseleave", resetStyles);

    // Zachowanie istniejących funkcji
    image.onerror = () => {
        image.src = pickCatFromLocal();
    };

    image.onload = () => {
        clearTimeout(timeoutChecker);
    };

    const SetRandomCatImage = () => {
        image.src = pickCatImage();
        timeoutChecker = setTimeout(() => image.onerror(), LOAD_TIMEOUT);
    };

    fileListUpdateHandler();
    SetRandomCatImage();

    document.addEventListener("keypress", (event) => {
        switch (event.key) {
            case "r":
            case "R":
                SetRandomCatImage();
                break;
        }
    });
});
