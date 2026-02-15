import BirdLibrary from "./BirdLibrary.mjs";
import { displayHotspotLibrary, loadHeaderFooter } from "./utils.mjs";


const favSpotsLink = document.getElementById("fav-hot-spots");
const HotspotLib = document.getElementById("fav-spots");



document.addEventListener("DOMContentLoaded", async () => {
    loadHeaderFooter();
    const birdLib = document.getElementById("bird-library");
    const birdLibrary = new BirdLibrary(birdLib);
    const HotspotLib = document.getElementById("fav-spots");
    HotspotLib.innerHTML = ``;
    displayHotspotLibrary(HotspotLib);

    await birdLibrary.render();
})


