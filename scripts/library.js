import { displayBirdLibrary, displayHotspotLibrary, loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    loadHeaderFooter();
   
})

const birdLink = document.getElementById("birds-seen");
const birdLib = document.getElementById("bird-library");

birdLink.addEventListener("click", () => {
    birdLib.innerHTML = ``;
    displayBirdLibrary(birdLib);

});

const favSpotsLink = document.getElementById("fav-hot-spots");
const HotspotLib = document.getElementById("fav-spots");

favSpotsLink.addEventListener("click", () => {
    HotspotLib.innerHTML = ``;
    displayHotspotLibrary(HotspotLib);
});