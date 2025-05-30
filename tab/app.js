/** Image load timeout  */
const LOAD_TIMEOUT = 1000

/** timeout ID */
let timeoutChecker = null

document.addEventListener("DOMContentLoaded", () => {
    const userButtonsContainer = document.getElementById("user-buttons");
    const addButton = document.getElementById("add-button");
    const resetButton = document.getElementById("reset-button");
    const settingsButton = document.getElementById("settings-button");
    const popularDomains = [
        { label: "Google", url: "https://www.google.com" },
        { label: "YouTube", url: "https://www.youtube.com" },
        { label: "Facebook", url: "https://www.facebook.com" },
        { label: "Twitter", url: "https://www.x.com" },
        { label: "Wikipedia", url: "https://www.wikipedia.org" },
        { label: "Reddit", url: "https://www.reddit.com" },
        { label: "Last.fm", url: "https://www.last.fm/" }
    ];

    const fontButton = document.getElementById("font-button");

    // Predefined font families
    const fontFamilies = [
        "'Noto Sans', 'Arial', sans-serif",
        "'Patrick Hand', cursive",
        "'Comic Sans MS', 'Comic Sans', cursive",
        "'Atkinson Hyperlegible', sans-serif",
        "'Eczar', serif;",
        "'Quintessential', serif",
        "'Fira Code', monospace",
        "'Potta One', system-ui"
    ];

    let currentFontIndex = parseInt(localStorage.getItem("fontIndex")) || 0;
    document.documentElement.style.setProperty("--font-family", fontFamilies[currentFontIndex]);

    addButton.classList.add("hidden");
    resetButton.classList.add("hidden");
    fontButton.classList.add("hidden");
    // Load saved buttons from localStorage or initialize with popular domains
    let savedButtons = JSON.parse(localStorage.getItem("userButtons")) || [...popularDomains];
    const colors = [
        "#ffdede", "#fffac4", "#e9f9d6", "#daf3ff", "#f8deff", "#ACF1E8", "#fde2e4",
        "#e2ece9", "#cddafd", "#eae4e9", "#fff1e6", "#fde2e4", "#fad2e1", "#dfe7fd",
        "#9FB3DF", "#9EC6F3", "#BDDDE4", "#FFF1D5", "#FFE6A9", "#B1C29E", "#A2D2DF",
        "#E4C087", "#BC7C7C", "#789DBC", "#FFE3E3", "#C9E9D2", "#FFECC8", "#FFD09B",
        "#FFB0B0", "#D1E9F6", "#EECAD5", "#BBE9FF", "#B1AFFF", "#9BB0C1", "#F6995C",
        "#51829B", "#A1EEBD", "#F6D6D6", "#82A0D8", "#EDB7ED", "#FD8A8A", "#F1F7B5",
        "#A8D1D1", "#9EA1D4", "#FEBE8C", "#F7A4A4", "#FFFBC1", "#B6E2A1", "#C1EFFF",
        "#FFB2A6", "#9ADCFF", "#BAABDA", "#F7CFD8", "#A6D6D6", "#F0A8D0", "#F7B5CA",
        "#FFC6C6", "#FDCEDF", "#F2BED1", "#FFC0D9", "#8ACDD7"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.documentElement.style.setProperty("--background", randomColor);

    const adjectives = [
        // Pretty
        "Rosy", "Glimmering", "Dainty", "Gleaming", "Graceful", "Cuddle-feathered",
        "Feathered", "Whimsical", "Dewy", "Gentle", "Dovely", "Dreamy", "Swift", "Delicate",
        // Forest
        "Meadowy", "Brambly", "Piney", "Ferny", "Overgrown", "Arboreal",
        "Mossy", "Wildfeather", "Brambly", "Foggy", "Foraging", "Resilient",
        "Hollow", "Meadowbound", "Pebbled", "Branchy", "Nestled", "Sedentary",
        // City
        "Sooty", "Trashy", "Rusty", "Dingy", "Scouting", "Sneaky", "Underhanded",
        "Asphalt", "Trash-hunting", "Breadcrumb Covered", "Thieving", "Alleywise", "Subway",
        "Streetshined", "Chimneyflap", "Rooftopped", "Urbanite", "Awning", "Windowsill",
        // Weirdo
        "Shabby", "Whimsical", "Loopy", "Grumbling", "Paranormal", "Ethereal",
        "Voidwing", "Vaporfeather", "Cosmic", "Time-lost", "Static", "Lucid",
        "Wyrd", "Inbetweener", "Unnested", "Fogspun", "Tangled", "Mystic", "Wild", "Feral",
        // Fun
        "Zany", "Jolly", "Frolicsome", "Giggly", "Exuberant", "Bouncy", "Startled",
        "Fluffy", "Plump", "Sassy", "Skippy", "Bready", "Zippy", "Peppy", "Derpy",
        "Swooshy", "Boingy", "Chirpy", "Bubbly", "Goofy", "Bumbly", "Silly",
        "Flirty", "Eepy", "Round", "Squishy", "Premium", "Shiny", "Unhoused",
        // Pompous
        "Noble", "Enchanting", "Majestic", "Distinguished", "Regal", "Valorous", "Intrepid",
        "Sacred", "Celestial", "Grove-born", "Whispered", "Prancing", "Iridescent",
        "Spiritcoated", "Mythic", "Feyplumed", "Ancient", "Shrine-perched", "Rune-feathered"
    ];

    const nouns = [
        // Forest
        "Pecker", "Thicket", "Mossball", "Buzzleaf", "Fungus", "Nomad", "Sprout",
        "Woodlander", "Clearcut", "Driftwood", "Acorn", "Burrow", "Bracken",
        "Whistle", "Murmur", "Rustle", "Pebble", "Bramble", "Leaflet", "Fernlet", "Percher",
        "Breezelet", "Twig", "Grovelet", "Doveling", "Tree-hugger", "Forestbaby",
        "Barley", "Poppyseed", "Dandelion", "Hag", "Barbarian", "Enchanted Prince",
        // Pretty
        "Trinket", "Winklet", "Snugglebutt", "Ribbon", "Keepsake", "Navigator",
        "Flutter", "Cuddler", "Poem", "Snuggler", "Petal", "Blush", "Softie", "Ballad",
        "Hush", "Cooer", "Glance", "Pulse", "Tremble", "Quiver", "Toe-tapper", "Bobblehead",
        "Baby", "Angel", "Peanut", "Messenger", "Carrier", "Noodle", "Muffin", "Pudding",
        "Biscuit", "Waffle", "Crumb", "Pretzel", "Nestseeker", "Park Dweller", "Squab",
        // Urban
        "Greaseball", "Chimney", "Underpass", "Streetlamp", "Warehouseman", "Skyliner", "Scramble",
        "Turnpike", "Breadthief", "Bagelfinder", "Loafer", "Puddle Hopper", "Fountain Diver",
        "Frystealer", "Trashbucket", "Plop", "Snacklord", "Crumb", "Pooplet", "Breadbag", "Plopper",
        "Wingdealer", "Biscuit", "Curbster", "Poopster", "Roofboy", "Antennaboy", "Greaseball",
        "Skyrat (non-derogatory)", "Zoomie", "Skatebirder", "Loaf", "Sidewalk Guardian", "Bus Stop Menace",
        "Potato", "Pickle", "Agent", "Spy", "Government Drone", "Hamburger",
        // Surreal
        "Mirage", "Constellation", "Inkling", "Twilight", "Pinecone", "Waddler", "Strutter",
        "Glimmer", "Fade", "Spark", "Shade", "Silhouette", "Ripple", "Omen", "Haunt", "Whisper",
        "Memory", "Prism", "Blink", "Flicker", "Glint", "Pudge", "Nugget", "Busybody"
    ];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    const titleElement = document.querySelector(".bird-title");
    titleElement.textContent = `${randomAdjective} ${randomNoun}`;

    const catContainer = document.querySelector(".cat");
    const THRESHOLD = 10;

    if (!localStorage.getItem("userButtons")) {
        localStorage.setItem("userButtons", JSON.stringify(savedButtons));
    }

    let isSettingsVisible = false;

    function toggleSettingsVisibility() {
        isSettingsVisible = !isSettingsVisible;

        // Toggle visibility of the "Add Shortcut" and "Reset Shortcuts" buttons
        addButton.classList.toggle("hidden", !isSettingsVisible);
        resetButton.classList.toggle("hidden", !isSettingsVisible);
        fontButton.classList.toggle("hidden", !isSettingsVisible);

        // Toggle visibility of all "Remove" buttons
        const removeButtons = document.querySelectorAll(".remove-button");
        removeButtons.forEach((btn) => btn.classList.toggle("hidden", !isSettingsVisible));
    }

    settingsButton.addEventListener("click", toggleSettingsVisibility);

    function renderButtons() {
        userButtonsContainer.innerHTML = ""; // Clear existing buttons

        savedButtons.forEach((button, index) => {
            const buttonContainer = document.createElement("div"); // Container for the button and remove button
            buttonContainer.style.display = "flex";
            buttonContainer.style.alignItems = "center";
            buttonContainer.style.gap = "10px";
            buttonContainer.setAttribute("draggable", "true"); // Make the container draggable
            buttonContainer.dataset.index = index; // Store the index as a data attribute

            const btn = document.createElement("button");
            btn.textContent = button.label;
            btn.addEventListener("mousedown", (e) => {
                if (e.button === 0) {
                    // Left click: open in the same tab
                    window.location.href = button.url;
                } else if (e.button === 1) {
                    // Middle click: open in a new tab
                    window.open(button.url, "_blank");
                }
            });

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "X";
            removeBtn.classList.add("remove-button", "hidden"); // Add "hidden" class initially
            removeBtn.style.backgroundColor = "#ff4d4d"; // Red color for remove button
            removeBtn.style.color = "white";
            removeBtn.style.border = "none";
            removeBtn.style.borderRadius = "5px";
            removeBtn.style.padding = "5px 10px";
            removeBtn.style.cursor = "pointer";

            removeBtn.addEventListener("click", () => {
                savedButtons.splice(index, 1); // Remove the button from the array
                localStorage.setItem("userButtons", JSON.stringify(savedButtons)); // Update localStorage
                renderButtons(); // Re-render the buttons
            });

            buttonContainer.appendChild(btn);
            buttonContainer.appendChild(removeBtn);
            userButtonsContainer.appendChild(buttonContainer);

            // Drag-and-drop event listeners
            buttonContainer.addEventListener("dragstart", handleDragStart);
            buttonContainer.addEventListener("dragover", handleDragOver);
            buttonContainer.addEventListener("drop", handleDrop);
        });
    }

    addButton.addEventListener("click", () => {
        const label = prompt("Enter button label:");
        const url = prompt("Enter URL for the shortcut:");
        if (label && url) {
            savedButtons.push({ label, url });
            localStorage.setItem("userButtons", JSON.stringify(savedButtons));
            renderButtons();
        }
    });

    resetButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset all shortcuts? This action cannot be undone.")) {
            // Clear localStorage and reinitialize with popular domains
            savedButtons = [...popularDomains];
            localStorage.setItem("userButtons", JSON.stringify(savedButtons));
            renderButtons(); // Re-render the buttons
        }
    });

    // Render buttons on page load
    renderButtons();

    // Function to cycle through font families
    function cycleFontFamily() {
        currentFontIndex = (currentFontIndex + 1) % fontFamilies.length; // Cycle to the next font
        const selectedFont = fontFamilies[currentFontIndex];
        document.documentElement.style.setProperty("--font-family", selectedFont);
        localStorage.setItem("fontIndex", currentFontIndex); // Save the selected font index
    }

    // Add event listener to the font button
    fontButton.addEventListener("click", cycleFontFamily);

    function handleHover(e) {
        const { clientX, clientY, currentTarget } = e;
        const { clientWidth, clientHeight } = currentTarget;
        const offsetLeft = currentTarget.getBoundingClientRect().left;
        const offsetTop = currentTarget.getBoundingClientRect().top;
    
        const horizontal = (clientX - offsetLeft) / clientWidth;
        const vertical = (clientY - offsetTop) / clientHeight;
    
        const rotateX = (THRESHOLD / 2 - vertical * THRESHOLD).toFixed(2);
        const rotateY = (horizontal * THRESHOLD - THRESHOLD / 2).toFixed(2);
    
        // Apply only the rotation and scale transformations
        currentTarget.style.transform = `
            perspective(${clientWidth}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(0.8)
        `;
    }
    
    function resetStyles(e) {
        // Reset only the rotation and scale transformations
        e.currentTarget.style.transform = `
            perspective(${e.currentTarget.clientWidth}px)
            rotateX(0deg)
            rotateY(0deg)
            scale(0.7)
        `;
    }

    let draggedIndex = null;

    function handleDragStart(event) {
        draggedIndex = event.currentTarget.dataset.index; // Store the index of the dragged item
        event.dataTransfer.effectAllowed = "move";
    }

    function handleDragOver(event) {
        event.preventDefault(); // Allow dropping
        event.dataTransfer.dropEffect = "move";
    }

    function handleDrop(event) {
        event.preventDefault();
        const droppedIndex = event.currentTarget.dataset.index; // Get the index of the drop target

        // Reorder the savedButtons array
        const [movedItem] = savedButtons.splice(draggedIndex, 1); // Remove the dragged item
        savedButtons.splice(droppedIndex, 0, movedItem); // Insert it at the new position

        // Update localStorage and re-render the buttons
        localStorage.setItem("userButtons", JSON.stringify(savedButtons));
        renderButtons();
    }

    // Add event listeners to the .cat div
    catContainer.addEventListener("mousemove", handleHover);
    catContainer.addEventListener("mouseleave", resetStyles);

    const iframeLinks = [
        "https://macaulaylibrary.org/asset/634338890/embed",
        "https://macaulaylibrary.org/asset/635697221/embed",
        "https://macaulaylibrary.org/asset/635697066/embed",
        "https://macaulaylibrary.org/asset/635696434/embed",
        "https://macaulaylibrary.org/asset/635695714/embed",
        "https://macaulaylibrary.org/asset/635696072/embed",
        "https://macaulaylibrary.org/asset/279264501/embed",
        "https://macaulaylibrary.org/asset/614294678/embed",
        "https://macaulaylibrary.org/asset/269115571/embed",
        "https://macaulaylibrary.org/asset/251813461/embed",
        "https://macaulaylibrary.org/asset/509730541/embed",
        "https://macaulaylibrary.org/asset/612363509/embed",
        "https://macaulaylibrary.org/asset/506528321/embed",
        "https://macaulaylibrary.org/asset/136516461/embed",
        "https://macaulaylibrary.org/asset/414719881/embed",
        "https://macaulaylibrary.org/asset/165443581/embed",
        "https://macaulaylibrary.org/asset/206163971/embed",
        "https://macaulaylibrary.org/asset/206020181/embed",
        "https://macaulaylibrary.org/asset/402927041/embed",
        "https://macaulaylibrary.org/asset/575722701/embed",
        "https://macaulaylibrary.org/asset/155407441/embed",
        "https://macaulaylibrary.org/asset/287287741/embed",
        "https://macaulaylibrary.org/asset/47132441/embed",
        "https://macaulaylibrary.org/asset/47132491/embed",
        "https://macaulaylibrary.org/asset/34481461/embed",
        "https://macaulaylibrary.org/asset/456698091/embed",
        "https://macaulaylibrary.org/asset/222764491/embed",
        "https://macaulaylibrary.org/asset/634588330/embed",
        "https://macaulaylibrary.org/asset/634581415/embed",
        "https://macaulaylibrary.org/asset/634579567/embed",
        "https://macaulaylibrary.org/asset/634579110/embed",
        "https://macaulaylibrary.org/asset/634577542/embed",
        "https://macaulaylibrary.org/asset/634576514/embed",
        "https://macaulaylibrary.org/asset/634586136/embed",
        "https://macaulaylibrary.org/asset/634338785/embed",
        "https://macaulaylibrary.org/asset/634587331/embed",
        "https://macaulaylibrary.org/asset/634586448/embed",
        "https://macaulaylibrary.org/asset/634343551/embed",
        "https://macaulaylibrary.org/asset/634344244/embed",
        "https://macaulaylibrary.org/asset/634345756/embed",
        "https://macaulaylibrary.org/asset/634353584/embed",
        "https://macaulaylibrary.org/asset/634353992/embed",
        "https://macaulaylibrary.org/asset/634351266/embed",
        "https://macaulaylibrary.org/asset/634350657/embed",
        "https://macaulaylibrary.org/asset/634350580/embed",
        "https://macaulaylibrary.org/asset/634349788/embed",
        "https://macaulaylibrary.org/asset/634349479/embed",
        "https://macaulaylibrary.org/asset/634349682/embed",
        "https://macaulaylibrary.org/asset/634349213/embed",
        "https://macaulaylibrary.org/asset/634349183/embed",
        "https://macaulaylibrary.org/asset/634348189/embed",
        "https://macaulaylibrary.org/asset/634338279/embed",
        "https://macaulaylibrary.org/asset/634336866/embed",
        "https://macaulaylibrary.org/asset/634336521/embed",
        "https://macaulaylibrary.org/asset/634336355/embed",
        "https://macaulaylibrary.org/asset/634334939/embed",
        "https://macaulaylibrary.org/asset/634334837/embed",
        "https://macaulaylibrary.org/asset/634333148/embed",
        "https://macaulaylibrary.org/asset/634332923/embed",
        "https://macaulaylibrary.org/asset/634332383/embed",
        "https://macaulaylibrary.org/asset/634332348/embed",
        "https://macaulaylibrary.org/asset/634330041/embed",
        "https://macaulaylibrary.org/asset/634329541/embed",
        "https://macaulaylibrary.org/asset/634328727/embed",
        "https://macaulaylibrary.org/asset/634328724/embed",
        "https://macaulaylibrary.org/asset/634325923/embed",
        "https://macaulaylibrary.org/asset/634325610/embed",
        "https://macaulaylibrary.org/asset/634322411/embed",
        "https://macaulaylibrary.org/asset/634322425/embed",
        "https://macaulaylibrary.org/asset/634320257/embed",
        "https://macaulaylibrary.org/asset/634318613/embed",
        "https://macaulaylibrary.org/asset/634318771/embed",
        "https://macaulaylibrary.org/asset/634317538/embed",
        "https://macaulaylibrary.org/asset/634314813/embed",
        "https://macaulaylibrary.org/asset/634314839/embed",
        "https://macaulaylibrary.org/asset/634350657/embed",
        "https://macaulaylibrary.org/asset/634349183/embed",
        "https://macaulaylibrary.org/asset/634347552/embed",
        "https://macaulaylibrary.org/asset/634341660/embed",
        "https://macaulaylibrary.org/asset/634347730/embed",
        "https://macaulaylibrary.org/asset/634346491/embed",
        "https://macaulaylibrary.org/asset/634340281/embed",
        "https://macaulaylibrary.org/asset/634340085/embed",
        "https://macaulaylibrary.org/asset/634298813/embed",
        "https://macaulaylibrary.org/asset/634299501/embed",
        "https://macaulaylibrary.org/asset/634280482/embed",
        "https://macaulaylibrary.org/asset/634280318/embed",
        "https://macaulaylibrary.org/asset/634277587/embed",
        "https://macaulaylibrary.org/asset/634278537/embed",
        "https://macaulaylibrary.org/asset/634278547/embed",
        "https://macaulaylibrary.org/asset/634277215/embed",
        "https://macaulaylibrary.org/asset/634276172/embed",
        "https://macaulaylibrary.org/asset/634275610/embed",
        "https://macaulaylibrary.org/asset/634275878/embed",
        "https://macaulaylibrary.org/asset/634275877/embed",
        "https://macaulaylibrary.org/asset/634274591/embed",
        "https://macaulaylibrary.org/asset/634273945/embed",
        "https://macaulaylibrary.org/asset/634273816/embed",
        "https://macaulaylibrary.org/asset/634273817/embed",
        "https://macaulaylibrary.org/asset/634273617/embed",
        "https://macaulaylibrary.org/asset/634270942/embed",
        "https://macaulaylibrary.org/asset/634270963/embed",
        "https://macaulaylibrary.org/asset/634270804/embed",
        "https://macaulaylibrary.org/asset/634256496/embed",
        "https://macaulaylibrary.org/asset/634247768/embed",
        "https://macaulaylibrary.org/asset/634256497/embed",
        "https://macaulaylibrary.org/asset/634256279/embed",
        "https://macaulaylibrary.org/asset/634249203/embed",
        "https://macaulaylibrary.org/asset/634280754/embed",
        "https://macaulaylibrary.org/asset/634023388/embed",
        "https://macaulaylibrary.org/asset/634021813/embed",
        "https://macaulaylibrary.org/asset/634021814/embed",
        "https://macaulaylibrary.org/asset/634020979/embed",
        "https://macaulaylibrary.org/asset/634019460/embed",
        "https://macaulaylibrary.org/asset/634017965/embed",
        "https://macaulaylibrary.org/asset/634017007/embed",
        "https://macaulaylibrary.org/asset/634017395/embed",
        "https://macaulaylibrary.org/asset/634026231/embed",
        "https://macaulaylibrary.org/asset/634032576/embed",
        "https://macaulaylibrary.org/asset/634025868/embed",
        "https://macaulaylibrary.org/asset/634024353/embed",
        "https://macaulaylibrary.org/asset/634051263/embed",
        "https://macaulaylibrary.org/asset/634051266/embed",
        "https://macaulaylibrary.org/asset/634051261/embed",
        "https://macaulaylibrary.org/asset/634047621/embed",
        "https://macaulaylibrary.org/asset/634045798/embed",
        "https://macaulaylibrary.org/asset/634044808/embed",
        "https://macaulaylibrary.org/asset/634043556/embed",
        "https://macaulaylibrary.org/asset/634179931/embed",
        "https://macaulaylibrary.org/asset/634178476/embed",
        "https://macaulaylibrary.org/asset/634173131/embed",
        "https://macaulaylibrary.org/asset/634171118/embed",
        "https://macaulaylibrary.org/asset/634176686/embed",
        "https://macaulaylibrary.org/asset/634168775/embed",
        "https://macaulaylibrary.org/asset/634168623/embed",
        "https://macaulaylibrary.org/asset/634168054/embed",
        "https://macaulaylibrary.org/asset/634161111/embed",
        "https://macaulaylibrary.org/asset/634163040/embed",
        "https://macaulaylibrary.org/asset/634162560/embed",
        "https://macaulaylibrary.org/asset/634155793/embed",
        "https://macaulaylibrary.org/asset/634152578/embed",
        "https://macaulaylibrary.org/asset/634152460/embed",
        "https://macaulaylibrary.org/asset/634151434/embed",
        "https://macaulaylibrary.org/asset/634147042/embed",
        "https://macaulaylibrary.org/asset/634110784/embed",
        "https://macaulaylibrary.org/asset/634102720/embed",
        "https://macaulaylibrary.org/asset/634102816/embed",
        "https://macaulaylibrary.org/asset/634100170/embed",
        "https://macaulaylibrary.org/asset/634096123/embed",
        "https://macaulaylibrary.org/asset/634096122/embed",
        "https://macaulaylibrary.org/asset/634087151/embed",
        "https://macaulaylibrary.org/asset/634087150/embed",
        "https://macaulaylibrary.org/asset/634090357/embed",
        "https://macaulaylibrary.org/asset/634089742/embed",
        "https://macaulaylibrary.org/asset/634086695/embed",
        "https://macaulaylibrary.org/asset/634084726/embed",
        "https://macaulaylibrary.org/asset/634084318/embed",
        "https://macaulaylibrary.org/asset/634218619/embed",
        "https://macaulaylibrary.org/asset/634215011/embed",
        "https://macaulaylibrary.org/asset/634211003/embed",
        "https://macaulaylibrary.org/asset/634208701/embed",
        "https://macaulaylibrary.org/asset/634195806/embed",
        "https://macaulaylibrary.org/asset/634195211/embed",
        "https://macaulaylibrary.org/asset/634182423/embed",
        "https://macaulaylibrary.org/asset/634182424/embed",
        "https://macaulaylibrary.org/asset/634207582/embed",
        "https://macaulaylibrary.org/asset/634240822/embed",
        "https://macaulaylibrary.org/asset/634241753/embed",
        "https://macaulaylibrary.org/asset/634223550/embed",
        "https://macaulaylibrary.org/asset/633404026/embed",
        "https://macaulaylibrary.org/asset/633404025/embed",
        "https://macaulaylibrary.org/asset/633486602/embed",
        "https://macaulaylibrary.org/asset/633486603/embed",
        "https://macaulaylibrary.org/asset/633486962/embed",
        "https://macaulaylibrary.org/asset/633448508/embed",
        "https://macaulaylibrary.org/asset/633448507/embed",
        "https://macaulaylibrary.org/asset/633446602/embed",
        "https://macaulaylibrary.org/asset/633504017/embed",
        "https://macaulaylibrary.org/asset/633493180/embed",
        "https://macaulaylibrary.org/asset/633489765/embed",
        "https://macaulaylibrary.org/asset/633489763/embed",
        "https://macaulaylibrary.org/asset/633539268/embed",
        "https://macaulaylibrary.org/asset/633533474/embed",
        "https://macaulaylibrary.org/asset/633529644/embed",
        "https://macaulaylibrary.org/asset/633529453/embed",
        "https://macaulaylibrary.org/asset/633507348/embed",
        "https://macaulaylibrary.org/asset/633584544/embed",
        "https://macaulaylibrary.org/asset/633582644/embed",
        "https://macaulaylibrary.org/asset/633551336/embed",
        "https://macaulaylibrary.org/asset/633610977/embed",
        "https://macaulaylibrary.org/asset/633606040/embed",
        "https://macaulaylibrary.org/asset/633605786/embed",
        "https://macaulaylibrary.org/asset/633603442/embed",
        "https://macaulaylibrary.org/asset/633595809/embed",
        "https://macaulaylibrary.org/asset/633593683/embed",
        "https://macaulaylibrary.org/asset/633622359/embed",
        "https://macaulaylibrary.org/asset/633633816/embed",
        "https://macaulaylibrary.org/asset/633619097/embed",
        "https://macaulaylibrary.org/asset/633614173/embed",
        "https://macaulaylibrary.org/asset/633612436/embed",
        "https://macaulaylibrary.org/asset/633612442/embed",
        "https://macaulaylibrary.org/asset/633656146/embed",
        "https://macaulaylibrary.org/asset/633653658/embed",
        "https://macaulaylibrary.org/asset/633653659/embed",
        "https://macaulaylibrary.org/asset/633651284/embed",
        "https://macaulaylibrary.org/asset/633681800/embed",
        "https://macaulaylibrary.org/asset/633674640/embed",
        "https://macaulaylibrary.org/asset/633671746/embed",
        "https://macaulaylibrary.org/asset/633667782/embed",
        "https://macaulaylibrary.org/asset/633664864/embed",
        "https://macaulaylibrary.org/asset/633660151/embed",
        "https://macaulaylibrary.org/asset/633683429/embed",
        "https://macaulaylibrary.org/asset/633683200/embed",
        "https://macaulaylibrary.org/asset/633713936/embed",
        "https://macaulaylibrary.org/asset/633710562/embed",
        "https://macaulaylibrary.org/asset/633712671/embed",
        "https://macaulaylibrary.org/asset/633689795/embed",
        "https://macaulaylibrary.org/asset/633734948/embed",
        "https://macaulaylibrary.org/asset/633730983/embed",
        "https://macaulaylibrary.org/asset/633728260/embed",
        "https://macaulaylibrary.org/asset/633728252/embed",
        "https://macaulaylibrary.org/asset/633726760/embed",
        "https://macaulaylibrary.org/asset/633717596/embed",
        "https://macaulaylibrary.org/asset/633722700/embed",
        "https://macaulaylibrary.org/asset/633715642/embed",
        "https://macaulaylibrary.org/asset/633715641/embed",
        "https://macaulaylibrary.org/asset/633773647/embed",
        "https://macaulaylibrary.org/asset/633778233/embed",
        "https://macaulaylibrary.org/asset/633778235/embed",
        "https://macaulaylibrary.org/asset/633778154/embed",
        "https://macaulaylibrary.org/asset/633758183/embed",
        "https://macaulaylibrary.org/asset/633799251/embed",
        "https://macaulaylibrary.org/asset/633848479/embed",
        "https://macaulaylibrary.org/asset/633842101/embed",
        "https://macaulaylibrary.org/asset/633805125/embed",
        "https://macaulaylibrary.org/asset/633816433/embed",
        "https://macaulaylibrary.org/asset/633898376/embed",
        "https://macaulaylibrary.org/asset/633897551/embed",
        "https://macaulaylibrary.org/asset/633894976/embed",
        "https://macaulaylibrary.org/asset/633897434/embed",
        "https://macaulaylibrary.org/asset/633897437/embed",
        "https://macaulaylibrary.org/asset/633896937/embed",
        "https://macaulaylibrary.org/asset/633896937/embed",
        "https://macaulaylibrary.org/asset/633861676/embed",
        "https://macaulaylibrary.org/asset/633860023/embed",
        "https://macaulaylibrary.org/asset/633912880/embed",
        "https://macaulaylibrary.org/asset/633911838/embed",
        "https://macaulaylibrary.org/asset/633911622/embed",
        "https://macaulaylibrary.org/asset/633910432/embed",
        "https://macaulaylibrary.org/asset/633910363/embed",
        "https://macaulaylibrary.org/asset/633910368/embed",
        "https://macaulaylibrary.org/asset/633910034/embed",
        "https://macaulaylibrary.org/asset/633909180/embed",
        "https://macaulaylibrary.org/asset/633919212/embed",
        "https://macaulaylibrary.org/asset/633922796/embed",
        "https://macaulaylibrary.org/asset/633915424/embed",
        "https://macaulaylibrary.org/asset/633915423/embed",
        "https://macaulaylibrary.org/asset/633958092/embed",
        "https://macaulaylibrary.org/asset/633948896/embed",
        "https://macaulaylibrary.org/asset/633952017/embed",
        "https://macaulaylibrary.org/asset/633963950/embed",
        "https://macaulaylibrary.org/asset/633962553/embed",
        "https://macaulaylibrary.org/asset/633963226/embed",
        "https://macaulaylibrary.org/asset/633960854/embed",
        "https://macaulaylibrary.org/asset/633979851/embed",
        "https://macaulaylibrary.org/asset/633974567/embed",
        "https://macaulaylibrary.org/asset/633980885/embed",
        "https://macaulaylibrary.org/asset/633980603/embed",
        "https://macaulaylibrary.org/asset/633980491/embed",
        "https://macaulaylibrary.org/asset/633986302/embed",
        "https://macaulaylibrary.org/asset/634012154/embed",
        "https://macaulaylibrary.org/asset/633983757/embed",
        "https://macaulaylibrary.org/asset/633981205/embed",
        "https://macaulaylibrary.org/asset/633981180/embed",
        "https://macaulaylibrary.org/asset/425794241/embed",
        "https://macaulaylibrary.org/asset/262654071/embed",
        "https://macaulaylibrary.org/asset/395028571/embed",
        "https://macaulaylibrary.org/asset/631841278/embed",
        "https://macaulaylibrary.org/asset/632265828/embed",
        "https://macaulaylibrary.org/asset/615710649/embed",
        "https://macaulaylibrary.org/asset/359075791/embed",
        "https://macaulaylibrary.org/asset/617181756/embed",
        "https://macaulaylibrary.org/asset/616142530/embed",
        "https://macaulaylibrary.org/asset/613162868/embed",
        "https://macaulaylibrary.org/asset/610332432/embed",
        "https://macaulaylibrary.org/asset/539829341/embed",
        "https://macaulaylibrary.org/asset/394764031/embed",
        "https://macaulaylibrary.org/asset/472108031/embed",
        "https://macaulaylibrary.org/asset/633013130/embed",
        "https://macaulaylibrary.org/asset/629841960/embed",
        "https://macaulaylibrary.org/asset/622521693/embed",
        "https://macaulaylibrary.org/asset/619217972/embed",
        "https://macaulaylibrary.org/asset/618482370/embed",
        "https://macaulaylibrary.org/asset/618477343/embed",
        "https://macaulaylibrary.org/asset/329035011/embed",
        "https://macaulaylibrary.org/asset/309323281/embed",
        "https://macaulaylibrary.org/asset/214163131/embed",
        "https://macaulaylibrary.org/asset/313591691/embed",
        "https://macaulaylibrary.org/asset/617616732/embed",
        "https://macaulaylibrary.org/asset/456189161/embed",
        "https://macaulaylibrary.org/asset/627389565/embed",
        "https://macaulaylibrary.org/asset/586005601/embed",
        "https://macaulaylibrary.org/asset/529384601/embed",
        "https://macaulaylibrary.org/asset/621437175/embed",
        "https://macaulaylibrary.org/asset/622698529/embed",
        "https://macaulaylibrary.org/asset/620057068/embed",
        "https://macaulaylibrary.org/asset/616377613/embed",
        "https://macaulaylibrary.org/asset/614489028/embed",
        "https://macaulaylibrary.org/asset/612840271/embed",
        "https://macaulaylibrary.org/asset/473392731/embed",
        "https://macaulaylibrary.org/asset/616938723/embed",
        "https://macaulaylibrary.org/asset/463908271/embed",
        "https://macaulaylibrary.org/asset/427438601/embed",
        "https://macaulaylibrary.org/asset/393551141/embed",
        "https://macaulaylibrary.org/asset/412869601/embed",
        "https://macaulaylibrary.org/asset/271680491/embed",
        "https://macaulaylibrary.org/asset/325857381/embed",
        "https://macaulaylibrary.org/asset/573404701/embed",
        "https://macaulaylibrary.org/asset/616668841/embed",
        "https://macaulaylibrary.org/asset/422001181/embed",
        "https://macaulaylibrary.org/asset/412942561/embed",
        "https://macaulaylibrary.org/asset/392687611/embed",
        "https://macaulaylibrary.org/asset/477380141/embed",
        "https://macaulaylibrary.org/asset/631235677/embed",
        "https://macaulaylibrary.org/asset/317779071/embed",
        "https://macaulaylibrary.org/asset/621410915/embed",
        "https://macaulaylibrary.org/asset/242810601/embed",
        "https://macaulaylibrary.org/asset/488643331/embed",
        "https://macaulaylibrary.org/asset/459487111/embed",
        "https://macaulaylibrary.org/asset/324759211/embed",
        "https://macaulaylibrary.org/asset/366420791/embed",
        "https://macaulaylibrary.org/asset/317779221/embed",
        "https://macaulaylibrary.org/asset/394063951/embed",
        "https://macaulaylibrary.org/asset/366420801/embed",
        "https://macaulaylibrary.org/asset/273920171/embed",
        "https://macaulaylibrary.org/asset/631576566/embed",
        "https://macaulaylibrary.org/asset/628930282/embed",
        "https://macaulaylibrary.org/asset/615986538/embed",
        "https://macaulaylibrary.org/asset/496682331/embed",
        "https://macaulaylibrary.org/asset/609162164/embed",
        "https://macaulaylibrary.org/asset/338850341/embed",
        "https://macaulaylibrary.org/asset/220653801/embed",
        "https://macaulaylibrary.org/asset/210163311/embed",
        "https://macaulaylibrary.org/asset/456189071/embed",
        "https://macaulaylibrary.org/asset/405374571/embed",
        "https://macaulaylibrary.org/asset/298647581/embed",
        "https://macaulaylibrary.org/asset/630546743/embed",
        "https://macaulaylibrary.org/asset/218255971/embed",
        "https://macaulaylibrary.org/asset/366420411/embed",
        "https://macaulaylibrary.org/asset/391057341/embed",
        "https://macaulaylibrary.org/asset/319186601/embed",
        "https://macaulaylibrary.org/asset/631319052/embed",
        "https://macaulaylibrary.org/asset/618991126/embed",
        "https://macaulaylibrary.org/asset/619617067/embed",
        "https://macaulaylibrary.org/asset/255072771/embed",
        "https://macaulaylibrary.org/asset/544349991/embed",
        "https://macaulaylibrary.org/asset/611318390/embed",
        "https://macaulaylibrary.org/asset/423542121/embed",
        "https://macaulaylibrary.org/asset/565431231/embed",
        "https://macaulaylibrary.org/asset/199350551/embed",
        "https://macaulaylibrary.org/asset/433443901/embed",
        "https://macaulaylibrary.org/asset/616359162/embed",
        "https://macaulaylibrary.org/asset/608270860/embed",
        "https://macaulaylibrary.org/asset/466997421/embed",
        "https://macaulaylibrary.org/asset/413968351/embed",
        "https://macaulaylibrary.org/asset/356113781/embed",
        "https://macaulaylibrary.org/asset/334498341/embed",
        "https://macaulaylibrary.org/asset/631099947/embed",
        "https://macaulaylibrary.org/asset/613970305/embed",
        "https://macaulaylibrary.org/asset/628055208/embed",
        "https://macaulaylibrary.org/asset/633727871/embed",
        "https://macaulaylibrary.org/asset/578298151/embed",
        "https://macaulaylibrary.org/asset/473060081/embed",
        "https://macaulaylibrary.org/asset/459629651/embed",
        "https://macaulaylibrary.org/asset/502922841/embed",
        "https://macaulaylibrary.org/asset/614576470/embed",
        "https://macaulaylibrary.org/asset/622121162/embed",
        "https://macaulaylibrary.org/asset/633587278/embed",
        "https://macaulaylibrary.org/asset/141808371/embed",
        "https://macaulaylibrary.org/asset/626398303/embed",
        "https://macaulaylibrary.org/asset/221209461/embed",
        "https://macaulaylibrary.org/asset/257990761/embed",
        "https://macaulaylibrary.org/asset/160260931/embed",
        "https://macaulaylibrary.org/asset/146684391/embed",
        "https://macaulaylibrary.org/asset/148236341/embed",
        "https://macaulaylibrary.org/asset/257990691/embed",
        "https://macaulaylibrary.org/asset/75826151/embed",
        "https://macaulaylibrary.org/asset/627413139/embed",
        "https://macaulaylibrary.org/asset/284390461/embed",
        "https://macaulaylibrary.org/asset/630451413/embed",
        "https://macaulaylibrary.org/asset/614652092/embed",
        "https://macaulaylibrary.org/asset/593845401/embed",
        "https://macaulaylibrary.org/asset/148931051/embed",
        "https://macaulaylibrary.org/asset/204241831/embed",
        "https://macaulaylibrary.org/asset/466674191/embed",
        "https://macaulaylibrary.org/asset/206000531/embed",
        "https://macaulaylibrary.org/asset/356730541/embed",
        "https://macaulaylibrary.org/asset/103888411/embed",
        "https://macaulaylibrary.org/asset/162302271/embed",
        "https://macaulaylibrary.org/asset/149790201/embed",
        "https://macaulaylibrary.org/asset/220282001/embed",
        "https://macaulaylibrary.org/asset/204074081/embed",
        "https://macaulaylibrary.org/asset/157345921/embed",
        "https://macaulaylibrary.org/asset/468518171/embed",
        "https://macaulaylibrary.org/asset/925471811/embed",
        "https://macaulaylibrary.org/asset/301756691/embed",
        "https://macaulaylibrary.org/asset/279638641/embed",
        "https://macaulaylibrary.org/asset/208259691/embed",
        "https://macaulaylibrary.org/asset/630359988/embed",
        "https://macaulaylibrary.org/asset/484041761/embed",
        "https://macaulaylibrary.org/asset/622144358/embed",
        "https://macaulaylibrary.org/asset/631218666/embed",
        "https://macaulaylibrary.org/asset/631218713/embed",
        "https://macaulaylibrary.org/asset/625872282/embed",
        "https://macaulaylibrary.org/asset/623741350/embed",
        "https://macaulaylibrary.org/asset/625872984/embed",
        "https://macaulaylibrary.org/asset/555663011/embed",
        "https://macaulaylibrary.org/asset/55566581/embed",
        "https://macaulaylibrary.org/asset/88850151/embed",
        "https://macaulaylibrary.org/asset/89293331/embed",
        "https://macaulaylibrary.org/asset/139062371/embed",
        "https://macaulaylibrary.org/asset/82992061/embed",
        "https://macaulaylibrary.org/asset/621517796/embed",
        "https://macaulaylibrary.org/asset/298444971/embed",
        "https://macaulaylibrary.org/asset/138828961/embed",
        "https://macaulaylibrary.org/asset/356827141/embed",
        "https://macaulaylibrary.org/asset/136492401/embed",
        "https://macaulaylibrary.org/asset/85106131/embed",
        "https://macaulaylibrary.org/asset/277870031/embed",
        "https://macaulaylibrary.org/asset/391559311/embed",
        "https://macaulaylibrary.org/asset/238115891/embed",
        "https://macaulaylibrary.org/asset/382447011/embed",
        "https://macaulaylibrary.org/asset/269189221/embed",
        "https://macaulaylibrary.org/asset/632935269/embed",
        "https://macaulaylibrary.org/asset/627071769/embed",
        "https://macaulaylibrary.org/asset/616567339/embed",
        "https://macaulaylibrary.org/asset/102468761/embed",
        "https://macaulaylibrary.org/asset/206163971/embed",
        "https://macaulaylibrary.org/asset/318213621/embed",
        "https://macaulaylibrary.org/asset/44108391/embed",
        "https://macaulaylibrary.org/asset/105676011/embed",
        "https://macaulaylibrary.org/asset/93155401/embed",
        "https://macaulaylibrary.org/asset/628952644/embed",
        "https://macaulaylibrary.org/asset/427645481/embed",
        "https://macaulaylibrary.org/asset/170175791/embed",
        "https://macaulaylibrary.org/asset/97927581/embed",
        "https://macaulaylibrary.org/asset/629078317/embed",
        "https://macaulaylibrary.org/asset/614195248/embed",
        "https://macaulaylibrary.org/asset/474189411/embed",
        "https://macaulaylibrary.org/asset/449016521/embed",
        "https://macaulaylibrary.org/asset/470815531/embed",
        "https://macaulaylibrary.org/asset/629078316/embed",
        "https://macaulaylibrary.org/asset/174693901/embed",
        "https://macaulaylibrary.org/asset/172151101/embed",
        "https://macaulaylibrary.org/asset/290380121/embed",
        "https://macaulaylibrary.org/asset/159084061/embed",
        "https://macaulaylibrary.org/asset/384955821/embed",
        "https://macaulaylibrary.org/asset/172151091/embed",
        "https://macaulaylibrary.org/asset/210163521/embed",
        "https://macaulaylibrary.org/asset/443752771/embed",
        "https://macaulaylibrary.org/asset/23034881/embed",
        "https://macaulaylibrary.org/asset/68352471/embed",
        "https://macaulaylibrary.org/asset/238520141/embed",
        "https://macaulaylibrary.org/asset/188620411/embed",
        "https://macaulaylibrary.org/asset/116009761/embed",
        "https://macaulaylibrary.org/asset/237543011/embed",
        "https://macaulaylibrary.org/asset/163907381/embed",
        "https://macaulaylibrary.org/asset/626577286/embed",
        "https://macaulaylibrary.org/asset/62486261/embed",
        "https://macaulaylibrary.org/asset/498287111/embed",
        "https://macaulaylibrary.org/asset/136965941/embed",
        "https://macaulaylibrary.org/asset/589055731/embed",
        "https://macaulaylibrary.org/asset/40829431/embed",
        "https://macaulaylibrary.org/asset/503655151/embed",
        "https://macaulaylibrary.org/asset/633948649/embed",
        "https://macaulaylibrary.org/asset/173295601/embed",
        "https://macaulaylibrary.org/asset/177801311/embed",
        "https://macaulaylibrary.org/asset/503655551/embed",
        "https://macaulaylibrary.org/asset/269212431/embed",
        "https://macaulaylibrary.org/asset/402927041/embed",
        "https://macaulaylibrary.org/asset/373499451/embed",
        "https://macaulaylibrary.org/asset/243565671/embed",
        "https://macaulaylibrary.org/asset/205150331/embed",
        "https://macaulaylibrary.org/asset/47132441/embed",
        "https://macaulaylibrary.org/asset/335904731/embed",
        "https://macaulaylibrary.org/asset/622233296/embed",
        "https://macaulaylibrary.org/asset/574321821/embed",
        "https://macaulaylibrary.org/asset/613074102/embed",
        "https://macaulaylibrary.org/asset/626089669/embed",
        "https://macaulaylibrary.org/asset/451175211/embed",
        "https://macaulaylibrary.org/asset/206014871/embed",
        "https://macaulaylibrary.org/asset/206020181/embed",
        "https://macaulaylibrary.org/asset/206020001/embed",
        "https://macaulaylibrary.org/asset/206020081/embed",
        "https://macaulaylibrary.org/asset/489771121/embed",
        "https://macaulaylibrary.org/asset/489770261/embed",
        "https://macaulaylibrary.org/asset/206105151/embed",
        "https://macaulaylibrary.org/asset/619833432/embed",
        "https://macaulaylibrary.org/asset/198068391/embed",
        "https://macaulaylibrary.org/asset/512912721/embed",
        "https://macaulaylibrary.org/asset/167547201/embed",
        "https://macaulaylibrary.org/asset/560148411/embed",
        "https://macaulaylibrary.org/asset/237426991/embed",
        "https://macaulaylibrary.org/asset/336868001/embed",
        "https://macaulaylibrary.org/asset/519563301/embed",
        "https://macaulaylibrary.org/asset/419812231/embed",
        "https://macaulaylibrary.org/asset/535836881/embed",
        "https://macaulaylibrary.org/asset/615991978/embed",
        "https://macaulaylibrary.org/asset/618060810/embed",
        "https://macaulaylibrary.org/asset/159883911/embed",
        "https://macaulaylibrary.org/asset/299835201/embed",
        "https://macaulaylibrary.org/asset/446569811/embed",
        "https://macaulaylibrary.org/asset/625519528/embed",
        "https://macaulaylibrary.org/asset/61127231/embed",
        "https://macaulaylibrary.org/asset/206943101/embed",
        "https://macaulaylibrary.org/asset/206943091/embed",
        "https://macaulaylibrary.org/asset/456698091/embed",
        "https://macaulaylibrary.org/asset/415058091/embed",
        "https://macaulaylibrary.org/asset/485907071/embed",
        "https://macaulaylibrary.org/asset/491118891/embed",
        "https://macaulaylibrary.org/asset/548742591/embed",
        "https://macaulaylibrary.org/asset/601879281/embed",
        "https://macaulaylibrary.org/asset/611394347/embed",
        "https://macaulaylibrary.org/asset/614524892/embed",
        "https://macaulaylibrary.org/asset/311398141/embed",
        "https://macaulaylibrary.org/asset/257611301/embed",
        "https://macaulaylibrary.org/asset/581067481/embed",
        "https://macaulaylibrary.org/asset/200372261/embed",
        "https://macaulaylibrary.org/asset/570358071/embed",
        "https://macaulaylibrary.org/asset/468518171/embed",
        "https://macaulaylibrary.org/asset/629565180/embed",
        "https://macaulaylibrary.org/asset/634162766/embed",
        "https://macaulaylibrary.org/asset/631902881/embed",
        "https://macaulaylibrary.org/asset/630845409/embed",
        "https://macaulaylibrary.org/asset/629565196/embed",
        "https://macaulaylibrary.org/asset/634359514/embed",
        "https://macaulaylibrary.org/asset/634358377/embed",
        "https://macaulaylibrary.org/asset/634355218/embed",
        "https://macaulaylibrary.org/asset/634586023/embed",
        "https://macaulaylibrary.org/asset/634586024/embed",
        "https://macaulaylibrary.org/asset/634585817/embed",
        "https://macaulaylibrary.org/asset/634585008/embed",
        "https://macaulaylibrary.org/asset/634585041/embed",
        "https://macaulaylibrary.org/asset/634584720/embed",
        "https://macaulaylibrary.org/asset/634584409/embed",
        "https://macaulaylibrary.org/asset/634583981/embed",
        "https://macaulaylibrary.org/asset/634584419/embed",
        "https://macaulaylibrary.org/asset/634584483/embed"

    ];

    function setRandomTitle() {

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
