import { loadHeaderFooter, getCoordinates, getBirdData } from "./utils.mjs";
import BirdList from "./BirdList.mjs";

loadHeaderFooter();

const form = document.getElementById("loc-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const locationInput = document.getElementById("location").value;
    if (!location) {
        return;
    }
    const coordinates = await getCoordinates(locationInput);
    if (!coordinates) {
        console.error("Location not found");
        return;
    }
    const birdList = new BirdList(getBirdData, document.querySelector("#bird-list"), locationInput);
    await birdList.init(coordinates.lat, coordinates.lon);
  
});

