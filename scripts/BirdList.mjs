import { formatDate, getWikiBirdData } from "./utils.mjs";


export default class BirdList {
    constructor(dataSource, listElement, location, dataType) {
        this.location = location;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.dataType = dataType;
    }

    async init(lat, lon) {
        this.birds = await this.dataSource(lat, lon);
        const title = document.getElementById("list-title");
        const titles = { recent: "Recent Sightings", "recent-notable": "Recent Notable Sightings" };
        title.textContent = `${titles[this.dataType]} for ${this.location}`;
        this.renderBirds(this.birds);
    }
    async renderBirds(birds) {
        const birdsHTML = await Promise.all(birds.map(async bird => {
            const imgUrl = await getWikiBirdData(bird);
            return (
                `<li class="bird">
                <img src="${imgUrl}" alt="${bird.comName}" width="150" />
                <h4>${bird.comName}</h4>
                <div><p><strong>Scientific name:</strong> <em>${bird.sciName}</em></p>
                <p><strong>Date observed:</strong> ${formatDate(bird.obsDt)}</p>
                <p><strong>Location seen:</strong> ${bird.locName}</p>
                <p><strong>Number spotted:</strong> ${bird.howMany ?? "unknown"}</p>
                <a href = "https://ebird.org/species/${bird.speciesCode}" target="blank">Learn More about ${bird.comName}</a>
                </div>
                <button class="seen-bird">I've seen this bird</button>

                </li>`
            )
        }));
        this.listElement.innerHTML = birdsHTML.join("");
    }
}
    

