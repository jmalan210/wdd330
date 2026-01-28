import { loadHeaderFooter, getCoordinates, getBirdData } from "./utils.mjs";

loadHeaderFooter();

const form = document.getElementById("loc-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const locationInput = document.getElementById("location").value;
    console.log(locationInput);
    const coordinates = await getCoordinates(locationInput);
    console.log(coordinates);

    if (!coordinates) {
        console.log("Location not found");
        return;
    }

    console.log("Coordinates:", coordinates.lat, coordinates.lon);
    const birds = await getBirdData(coordinates.lat, coordinates.lon);
    console.log(birds)
});

