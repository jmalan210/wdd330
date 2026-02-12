import { formatDate, getWikiBirdPics } from "./utils.mjs";


export default class BirdList {
    constructor(dataSource, listElement, location, dataType) {
        this.location = location;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.dataType = dataType;
    }

    async init(lat, lon) {
        let birds = await this.dataSource(lat, lon);
        const speciesList = new Set();
        birds = birds.filter(bird => {
            if (speciesList.has(bird.speciesCode)) return false;
            speciesList.add(bird.speciesCode);
            return true;
        });
        birds = birds.slice(0, 10);
        this.birds = birds;
        const title = document.getElementById("list-title");
        const titles = { recent: "Recent Sightings", recentNotable: "Recent Notable Sightings" };
        title.innerHTML = `<h4>${titles[this.dataType]} for <span id="title-loc">${this.location}</span><h4>
        <p id="subtitle">Click <img src="images/binoculars.svg" alt="binoculars" width="50"> for more information!</p>`;
        this.renderBirds(this.birds);
    }
    async renderBirds(birds) {
        const birdsHTML = await Promise.all(birds.map(async bird => {
            const imgUrl = await getWikiBirdPics(bird);
            console.log(imgUrl);
            const privLoc = bird.locationPrivate ? "Yes" : "No";
            return (
                `<li class="bird">
                <div class="flip-card-inner">

                <div class="flip-card-front">
                <h4>${bird.comName}</h4>
                <img src="${imgUrl}" alt="${bird.comName}" class="flip-img"/>
                <img src="/images/binoculars.svg" alt="flip card" class="binocBtn"/>
                </div>

                <div class="bird-info flip-card-back">
                <div class="info-wrap">
                <p><strong>Scientific name:</strong> <em>${bird.sciName}</em></p>
                <p><strong>Date observed:</strong> ${formatDate(bird.obsDt)}</p>
                <p><strong>Location seen:</strong> ${bird.locName}</p>
                <p><strong>Latitude:</strong> ${bird.lat}</p>
                <p><strong>Longitude:</strong> ${bird.lng}</p>
                <p><strong>Private Location:</strong> ${privLoc}</p>
                <p><strong>Number spotted:</strong> ${bird.howMany ?? "unknown"}</p>
                <p><a href = "https://ebird.org/species/${bird.speciesCode}" target="blank">Learn More about ${bird.comName}</a></p>
                </div>
                <button class="seen-bird">I've seen this bird</button>
                 <img src="./images/back-arrow.svg" alt="back arrow" class="flip-back">
                 </div>
                
                 </div>
                </li>`
            )
        }));
        this.listElement.innerHTML = birdsHTML.join("");
    }
}
    

