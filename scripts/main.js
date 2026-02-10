import BirdOfDay from "./BirdOfDay.mjs";
import { loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    loadHeaderFooter();
    await loadBirdOfTheDay();
})


async function loadBirdOfTheDay() {
    try {
        const res = await fetch("https://server-4abf.onrender.com/api/us-notable-birds");
        if (!res) throw new Error("Failed to fetch bird");

        const bird = await res.json();
        // console.log("Fetched bird:", bird);
        const birdDiv = document.getElementById("birdOfDay");
        const bod = new BirdOfDay(bird, birdDiv);
        await bod.init();

    } catch (err) {
        console.error(err);
        document.getElementById("birdOfDay").textContent = "Error loading bird";
    }
} 