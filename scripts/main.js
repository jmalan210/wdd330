import BirdOfDay from "./BirdOfDay.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();
loadBirdOfTheDay();

async function loadBirdOfTheDay() {
    try {
        const res = await fetch("https://server-4abf.onrender.com/api/us-notable-birds");
        if (!res) throw new Error("Failed to fetch bird");

        const bird = await res.json();
        const birdDiv = document.getElementById("birdOfDay");
        const bod = new BirdOfDay(bird, birdDiv);
        await bod.init(bird, birdDiv);

    } catch (err) {
        console.error(err);
        document.getElementById("birdOfDay").textContent = "Error loading bird";
    }
} 