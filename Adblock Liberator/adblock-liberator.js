console.log("Adblock Liberator Loaded!");

/**************************************
 * Globals
***************************************/
let _height = null;
function getOriginalHeight() {
    return _height;
}

function setOriginalHeight(playerElement) {
    if (playerElement.offsetHeight) {
        _height = playerElement.offsetHeight;
        console.log(playerElement.offsetHeight)
    }
}

let _currentUrl = null;

function getCurrentUrl() {
    return _currentUrl;
}

function setCurrentUrl() {
    _currentUrl = window.location.href;
    console.log("Current URL set to: " + _currentUrl);
}

let _currentPlayer = null;
let _isNewPlayerNeeded = false;
function shouldRenewIFramePlayer() {
    return _isNewPlayerNeeded;
}

function resetCurrentPlayer() {
    if (_currentPlayer == null)
        return;

    _currentPlayer.remove();
    _isNewPlayerNeeded = true;
    console.log("CurrentPlayer reset", _currentPlayer)
}

function setCurrentPlayer(player) {
    _currentPlayer = player
    _isNewPlayerNeeded = false;
}

/**************************************
 * Script
***************************************/

function createIframePlayer() {
    // Fetch the element by its ID
    const playerElement = document.getElementById("player");

    // Check if the element exists before removing its contents
    if (playerElement) {
        playerElement.innerHTML = "";
        console.log("Removed current youtube player");

        // Create the new player
        // Create the div with the specified class
        const newPlayer = document.createElement("div");
        newPlayer.id = "new-player-container"
        newPlayer.className = "style-scope ytd-watch-flexy";
        newPlayer.style.height = "100%";

        // Create the iframe element
        const embedUrl = window.location.href.replace("watch?v=", "embed/");
        const iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.src = `${embedUrl}?autoplay=1`;
        iframe.title = "YouTube video player";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;


        newPlayer.appendChild(iframe);
        playerElement.appendChild(newPlayer);
        playerElement.style.height = `${getOriginalHeight()}px`;

        setCurrentPlayer(newPlayer);
        console.log("Iframe added to the element!");
    } else {
        console.log("Player element Not Found");
    }
}

/**************************************
 * Oberserve Page changes
***************************************/

function ObserveChanges() {
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (getCurrentUrl() != window.location.href) {
                setCurrentUrl();
                resetCurrentPlayer();
            }
            const isVideo = getCurrentUrl().toLowerCase().includes("watch");
            // Check for the presence of the player element
            const elementToRemove = document.getElementById("player");
            const errorElement = document.getElementById("error-screen");
            if (elementToRemove && (errorElement || shouldRenewIFramePlayer())  && isVideo) {
                setOriginalHeight(elementToRemove);
                console.log("Player element found. Executing onPageLoad.");
                createIframePlayer();
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });
}

// Create a MutationObserver
ObserveChanges();