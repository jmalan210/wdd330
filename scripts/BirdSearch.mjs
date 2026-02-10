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
        title.innerHTML = ``;
      
        const birdHTML = this.renderBird(details);
        this.listElement.innerHTML = birdHTML;
        return details;
       
    }

    renderBird(details) {
        const sentences = details.extract?.match(/[^\.!\?]+[\.!\?]+/g) || [];
        const firstFive = sentences.slice(0, 500).join(' ');

            return (
                `<li class="searchedBird">
                        <h4>${details.title}</h4>
                        <img src="${details.thumbnail?.source || 'images/placeholder.svg'}" alt="${details.title}" width="300" />
                        <p>${firstFive}</p>
                        <button class="seen-bird">I've seen this bird</button>
        
                        </li>`
        )
        
    }
    
    }
