import { formatDate, getReadableLocation, getWikiBirdDetails, getWikiBirdPics } from "./utils.mjs";
export default class BirdOfDay {

    constructor(bird, birdDiv ) {
        this.bird = bird;
        this.birdDiv = birdDiv;
    }

    async init() {
        if (!this.bird) return;
        await this.renderBird(this.bird);
    }

    async renderBird(bird) {
        let locationName = "Unknown location";

        if (bird.lat && bird.lng) {
            locationName = await getReadableLocation(bird.lat, bird.lng);
        }

        const imgUrl = await getWikiBirdPics(bird);
       

        const birdHTML =
         `
         
         <h2>Bird of the Day</h2>
        <div id="bodImg"><img src=${imgUrl}></div>
        <div>
        
        <h3>${bird.comName}</h3>
        <p><strong>Scientific Name:</strong> <em>${bird.sciName}</em></p>
        <p><strong>Date Observed:</strong> ${formatDate(bird.obsDt)}</p>
        <p><strong>Location Observed:</strong> ${bird.locName}</p>
        <p><strong>Address:</strong> ${locationName};
        <p><strong>Latitude:</strong> ${bird.lat}</p>
        <p><strong>Longitude:</strong> ${bird.lng}</p>
        <p><strong>Number Observed:</strong> ${bird.howMany}</p>
        <p><a href = "https://ebird.org/species/${bird.speciesCode}" target="blank">Learn More about ${bird.comName}</a></p>
                </div>
        `;
        
        this.birdDiv.innerHTML = birdHTML;
        
    }
}