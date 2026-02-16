import BirdLibrary from "./BirdLibrary.mjs";
import HotspotLibrary from "./HotspotLibrary.mjs"
import { loadHeaderFooter, initHamburgerMenu } from "./utils.mjs";



document.addEventListener("DOMContentLoaded", async () => {
    loadHeaderFooter();
    initHamburgerMenu();
    const birdLib = document.getElementById("bird-library");
    const birdLibrary = new BirdLibrary(birdLib);
    const hotspotLib = document.getElementById("fav-spots");
    const hotspotLibrary = new HotspotLibrary(hotspotLib);

    await birdLibrary.render();
    await hotspotLibrary.render();

    function libraryCollapse() {
        const sections = document.querySelectorAll(".library-section");
        const isMobile = window.innerWidth < 800;
        sections.forEach(section => {
            section.open = !isMobile;
        });
    }

    libraryCollapse();
    window.addEventListener("resize", libraryCollapse);
})


