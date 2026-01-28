import { formatDate } from "./utils.mjs";

function birdListTemplate(bird) {
    
    return `
    <li class= "bird-li">
        
        <h4>${bird.comName}</h4>
        <div><p><strong>Scientific name:</strong> <em>${bird.sciName}</em></p>
        <p><strong>Date observed:</strong> ${formatDate(bird.obsDt)}</p>
        <p><strong>Location seen:</strong> ${bird.locName}</p>
        <p><strong>Number spotted:</strong> ${bird.howMany ?? "unknown"}</p>
        <a href = "https://ebird.org/species/${bird.speciesCode}" target="blank">Learn More about ${bird.comName}</a>
        </div>
        <div><button>I've seen this bird</button></div>
    </li>
        `;
}

export default class BirdList {
    constructor(dataSource, listElement, location) {
        this.location = location;
        this.dataSource = dataSource;
        this.listElement = listElement
    }

    async init(lat, lon) {
        this.birds = await this.dataSource(lat, lon);
        const title = document.getElementById('list-title');
        title.textContent = `Birds seen near ${this.location} in the last 30 days:`;
        this.render();
    }
    render() {
        this.listElement.innerHTML = "";
        this.birds.forEach(bird => {
            this.listElement.innerHTML += birdListTemplate(bird);
        });
    }
    
    
    
    }

    
    

