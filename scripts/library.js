import BirdLibrary from "./BirdLibrary.mjs";
import HotspotLibrary from "./HotspotLibrary.mjs"
import { loadHeaderFooter } from "./utils.mjs";



document.addEventListener("DOMContentLoaded", async () => {
    loadHeaderFooter();
    const birdLib = document.getElementById("bird-library");
    const birdLibrary = new BirdLibrary(birdLib);
    const hotspotLib = document.getElementById("fav-spots");
    const hotspotLibrary = new HotspotLibrary(hotspotLib);

    await birdLibrary.render();
    await hotspotLibrary.render();
})


