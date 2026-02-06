import { getWikiBirdDetails } from "./utils.mjs";

export default class BirdSearch {
    constructor(dataSource, listElement) {
        this.dataSource = dataSource;
        this.listElement = listElement;
        
    }

    async init(searchInput) {
        let birds = await this.dataSource(searchInput);
        if (!birds.length) return;

        const bird = birds[0];
        const pageId = bird.pageid;
        const details = await getWikiBirdDetails(pageId);
        const title = document.getElementById("list-title");
        title.innerHTML = `${bird.title}`
      
        const birdHTML = this.renderBird(details);
        this.listElement.innerHTML = birdHTML;
        
       
    }

    renderBird(details) {

            return (
                `<li class="bird">
                        <img src="${details.thumbnail.source}" alt="${details.title}" width="150" />
                        <h4>${details.title}</h4>
                        <div class="bird-info">
                        <p>${details.extract}</p>
                        </div>
                        <button class="seen-bird">I've seen this bird</button>
        
                        </li>`
        )
        
    }
    
    }
