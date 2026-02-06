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
        const titles = { recent: "Recent Sightings", "recent-notable": "Recent Notable Sightings" };
        title.innerHTML = `${titles[this.dataType]} for <span id="title-loc">${this.location}</span>`;
        this.renderBirds(this.birds);
    }
    async renderBirds(birds) {
        const birdsHTML = await Promise.all(birds.map(async bird => {
            const imgUrl = await getWikiBirdPics(bird);
            console.log(imgUrl);
            const privLoc = bird.locationPrivate ? "Yes" : "No";
            return (
                `<li class="bird">
                <img src="${imgUrl}" alt="${bird.comName}" width="150" />
                <h4>${bird.comName}</h4>
                <div class="bird-info"><p><strong>Scientific name:</strong> <em>${bird.sciName}</em></p>
                <p><strong>Date observed:</strong> ${formatDate(bird.obsDt)}</p>
                <p><strong>Location seen:</strong> ${bird.locName}</p>
                <p><strong>Latitude:</strong> ${bird.lat}</p>
                <p><strong>Longitude:</strong> ${bird.lng}</p>
                <p><strong>Private Location:</strong> ${privLoc}
                <p><strong>Number spotted:</strong> ${bird.howMany ?? "unknown"}</p>
                <p><a href = "https://ebird.org/species/${bird.speciesCode}" target="blank">Learn More about ${bird.comName}</a></p>
                </div>
                <button class="seen-bird">I've seen this bird</button>

                </li>`
            )
        }));
        this.listElement.innerHTML = birdsHTML.join("");
    }
}
    

