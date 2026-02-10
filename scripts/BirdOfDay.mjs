import { formatDate, getReadableLocation, getWikiBirdPics, getWikiExtractByName, wikiTitleCase } from "./utils.mjs";
export default class BirdOfDay {

    constructor(bird, birdDiv ) {
        this.bird = bird;
        this.birdDiv = birdDiv;
    }

    async init() {
        console.log("BirdOfDay.init called. bird =", this.bird);
        if (!this.bird) return;
        await this.renderBird(this.bird);
    }

    async renderBird(bird) {
        console.log("renderBird called for:", bird.comName);

        let locationName = "Unknown location";

        if (bird.lat && bird.lng) {
            locationName = await getReadableLocation(bird.lat, bird.lng);
        }

        const imgUrl = await getWikiBirdPics(bird);

        
        let blurb = await getWikiExtractByName(wikiTitleCase(bird.comName));
        if (!blurb || blurb.length < 50 || blurb.includes("may refer to")) {
            blurb = await getWikiExtractByName(bird.sciName);
        }
        const sentences = blurb.match(/[^\.!\?]+[\.!\?]+/g) || [];
        const truncatedBlurb = sentences.slice(0, 3).join(' ');

        console.log(bird.comName);
        console.log(blurb);

        const birdHTML =
         `
        <h2>Bird of the Day</h2>
        <div id="bodImg"><img src="${imgUrl}" alt="${bird.comName}"></div>
        <div>
        
        <h3>${bird.comName}</h3>
        <p>${truncatedBlurb}</p>
        <p><strong>Scientific Name:</strong> <em>${bird.sciName}</em></p>
        <p><strong>Date Observed:</strong> ${formatDate(bird.obsDt)}</p>
        <p><strong>Location Observed:</strong> ${bird.locName}</p>
        <p><strong>Address:</strong> ${locationName}</p>
        <p><strong>Latitude:</strong> ${bird.lat}</p>
        <p><strong>Longitude:</strong> ${bird.lng}</p>
        <p><strong>Number Observed:</strong> ${bird.howMany}</p>
        
        <p><a href = "https://ebird.org/species/${bird.speciesCode}" target="blank">Learn More about ${bird.comName}</a></p>
                </div>
        `;
        
        this.birdDiv.innerHTML = birdHTML;
        
    }
}