import BirdOfDay from "./BirdOfDay.mjs";
import { loadHeaderFooter, initHamburgerMenu } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    loadHeaderFooter();
    await loadBirdOfTheDay();
    initHamburgerMenu();
})


async function loadBirdOfTheDay() {
    try {
        //checks cache to see if there is already a bird for today
        const todayDate = new Date().toISOString().slice(0, 10);
        const stored = JSON.parse(localStorage.getItem('birdOfTheDay') || '{}');
        let bird;
        if (stored.date === todayDate) {
            bird = stored.bird;
        } else {
            const res = await fetch("https://server-4abf.onrender.com/api/us-notable-birds");
            if (!res) throw new Error("Failed to fetch bird");

            bird = await res.json();
            localStorage.setItem('birdOfTheDay', JSON.stringify({ date: todayDate, bird }));
        }
        const birdDiv = document.getElementById("birdOfDay");
        const bod = new BirdOfDay(bird, birdDiv);
        await bod.init();

    } catch (err) {
        console.error(err);
        document.getElementById("birdOfDay").textContent = "Error loading bird";
    }
} 