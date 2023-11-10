console.log("Adblock Liberator Loaded!");

/**************************************
 * Globals
***************************************/
var _height = null;
function getOriginalHeight() {
    return _height;
}

function setOriginalHeight(playerElement) {
    if (playerElement.offsetHeight) {
        _height = playerElement.offsetHeight;
        console.log(playerElement.offsetHeight)
    }
}

var _currentUrl = null;

function getCurrentUrl() {
    return _currentUrl;
}

function setCurrentUrl() {
    _currentUrl = window.location.href;
    console.log("Current URL set to: " + _currentUrl);
}

/**************************************
 * Script
***************************************/

function onPageLoad() {
    // Fetch the element by its ID
    let playerElement = document.getElementById("player");

    // Check if the element exists before removing its contents
    if (playerElement) {
        playerElement.innerHTML = "";
        console.log("Removed current youtube player");

        // Create the new player
        // Create the div with the specified class
        let newPlayer = document.createElement("div");
        newPlayer.id = "new-player-container"
        newPlayer.className = "style-scope ytd-watch-flexy";
        newPlayer.style.height = "100%";

        // Create the iframe element
        let embedUrl = window.location.href.replace("watch?v=", "embed/");
        let iframe = document.createElement("iframe");
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
        console.log("Iframe added to the element!");
    } else {
        console.log("Player element Not Found");
    }
}

/**************************************
 * Oberserve Page changes
***************************************/

function ObserveChanges() {
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            let isVideo = window.location.href.toLowerCase().includes("watch")

            // Check for the presence of the player element
            let elementToRemove = document.getElementById("player");
            if (elementToRemove && isVideo) {
                if(getCurrentUrl() != window.location.href){
                    setOriginalHeight(elementToRemove);
                    setCurrentUrl()
                    console.log("Player element found. Executing onPageLoad.");
                    onPageLoad();
                }
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });
}

// Create a MutationObserver
ObserveChanges();