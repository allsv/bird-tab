import { fileListUpdateHandler } from "./api.js"
import { pickCatImage, pickCatFromLocal } from "./utils.js"

/** Image load timeout  */
const LOAD_TIMEOUT = 1000

/** timeout ID */
let timeoutChecker = null

document.addEventListener("DOMContentLoaded", () => {
    const colors = ["#ffdede", "#fffac4", "#e9f9d6", "#daf3ff", "#f8deff", "#ACF1E8", "#fde2e4", "#e2ece9", "#cddafd", "#eae4e9", "#fff1e6", "#fde2e4", "#fad2e1", "#dfe7fd"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.documentElement.style.setProperty("--background", randomColor);

    const adjectives = ["Majestic", "Graceful", "Swift", "Colorful", "Elegant", "Vibrant"];
    const nouns = ["Sparrow", "Eagle", "Parrot", "Falcon", "Robin", "Hummingbird"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    const titleElement = document.querySelector(".bird-title");
    titleElement.textContent = `${randomAdjective} ${randomNoun}`;

    const catContainer = document.querySelector(".cat");
    const THRESHOLD = 10;

    function handleHover(e) {
        const { clientX, clientY, currentTarget } = e;
        const { clientWidth, clientHeight } = currentTarget;
        const offsetLeft = currentTarget.getBoundingClientRect().left;
        const offsetTop = currentTarget.getBoundingClientRect().top;

        const horizontal = (clientX - offsetLeft) / clientWidth;
        const vertical = (clientY - offsetTop) / clientHeight;

        const rotateX = (THRESHOLD / 2 - vertical * THRESHOLD).toFixed(2);
        const rotateY = (horizontal * THRESHOLD - THRESHOLD / 2).toFixed(2);

        // Apply the transform to the .cat div
        currentTarget.style.transform = `
            translate(-50%, -50%)
            perspective(${clientWidth}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(0.8)
        `;
    }

    function resetStyles(e) {
        // Reset transform to keep the .cat div centered
        e.currentTarget.style.transform = `
            translate(-50%, -50%)
            perspective(${e.currentTarget.clientWidth}px)
            rotateX(0deg)
            rotateY(0deg)
            scale(0.7)
        `;
    }

    // Add event listeners to the .cat div
    catContainer.addEventListener("mousemove", handleHover);
    catContainer.addEventListener("mouseleave", resetStyles);

    const iframeLinks = [
        "https://macaulaylibrary.org/asset/634338890/embed",
        "https://macaulaylibrary.org/asset/634338785/embed",
        "https://macaulaylibrary.org/asset/634343551/embed",
        "https://macaulaylibrary.org/asset/634344244/embed",
        "https://macaulaylibrary.org/asset/634345756/embed"
    ];

    function setRandomTitle() {
        const adjectives = ["Majestic", "Graceful", "Swift", "Colorful", "Elegant", "Vibrant"];
        const nouns = ["Sparrow", "Eagle", "Parrot", "Falcon", "Robin", "Hummingbird"];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const titleElement = document.querySelector(".bird-title");
        titleElement.textContent = `${randomAdjective} ${randomNoun}`;
    }

    function setRandomIframe() {
        catContainer.innerHTML = ""; // Clear previous iframe
        const randomIframe = iframeLinks[Math.floor(Math.random() * iframeLinks.length)];
        const iframe = document.createElement("iframe");
        iframe.src = randomIframe;
        iframe.allowFullscreen = true;
        catContainer.appendChild(iframe);
    }

    setRandomIframe();

    document.addEventListener("keypress", (event) => {
        if (event.key === "r" || event.key === "R") {
            setRandomIframe();
            setRandomTitle();
        }
    });
});
