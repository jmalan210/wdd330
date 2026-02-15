import { formatDate, getWikiBirdPics } from "./utils.mjs";

export default class BirdLibrary {

    constructor(listElement) {
        this.listElement = listElement;
        this.birds = JSON.parse(localStorage.getItem("seenBirds")) || [];

        this.listElement.addEventListener("click", e => {
            if (e.target.classList.contains("remove-bird")) {
                this.removeBirdFromLibrary(e.target.dataset.code);
            }
        })

    }
    
    async render() {
        this.listElement.innerHTML = "";

         if (this.birds.length === 0) {
        this.listElement.innerHTML = `No birds stored yet!`;
        return;
        }
        for (const b of this.birds) {
               
                const birdListItem = document.createElement("li");
                birdListItem.classList.add("seenBirdLi");
                
                const birdImg = await getWikiBirdPics(b);
                
                const existingNotes = b.notes
                    ? b.notes
                        .map((note, index) =>
                            `<li data-note-index="${index}">
                            <strong>${formatDate(new Date(note.date))}: </strong> ${note.text}: 
                            <button class="delete-note">X</button></li>`).join("") : "";
            
            birdListItem.innerHTML = `
                        <div class="card-header">
                        <button class="remove-bird" data-code=${b.speciesCode}>X</button>
                        <h4><strong>${b.comName}</strong></h4>
                        <div></div>
                        </div>
                        <div class="bird-lib-info">
                        <img src="${birdImg}" alt="${b.comName}" width="150">
                       <p><strong>Scientific Name:</strong><em> ${b.sciName}</em></p>
                       <p><strong>Date Recorded:</strong> ${formatDate(b.dateRecorded)}</p>
                       <p><strong>Notes:</strong></p>
                       <ul id="notes-${b.speciesCode}">${existingNotes}</ul>
                       <textarea id="note-${b.speciesCode}" class="note-text-area" placeholder="enter notes about this sighting"></textarea>
                       <button id="save-${b.speciesCode}" class="save-note">Save Note</button>
                       </div>
                       
                    `
                    this.listElement.appendChild(birdListItem);
                    
                    birdListItem.querySelector(`#save-${b.speciesCode}`).addEventListener("click", () => {
                        this.saveNoteForBird(b.speciesCode);
                    });
            
                   
            
                const notesList = birdListItem.querySelector(`#notes-${b.speciesCode}`);
                notesList.addEventListener("click", e => {
                if (e.target.classList.contains("delete-note")) {
                const li = e.target.closest("li");
                const noteIndex = li.dataset.noteIndex;
                this.deleteNoteForBird(b.speciesCode, noteIndex)
            }
        });
        }
        
    }
    
    removeBirdFromLibrary(speciesCode) {
        const li = this.listElement.querySelector(`.remove-bird[data-code="${speciesCode}"]`).closest("li");
        li.classList.add("removing");
        setTimeout(() => {
            this.birds = this.birds.filter(b => b.speciesCode !== speciesCode);
            this.updateLocalStorage();
            li.remove();

        }, 500);
       


    }

    saveNoteForBird(speciesCode) {
        
        const bird = this.birds.find(b => b.speciesCode === speciesCode);
        if (!bird) return;
    
        const textarea = document.getElementById(`note-${speciesCode}`);
        const noteText = textarea.value.trim();
        if (!noteText) return;
    
        if (!bird.notes) bird.notes = [];
        const note = {
            text: noteText,
            date: new Date().toISOString()
    
        };
        
        bird.notes.push(note);
    
        this.updateLocalStorage();
        this.renderNotes(bird);
    
        textarea.value = "";
    
    }

    deleteNoteForBird(speciesCode, noteIndex) {
    
    const bird = this.birds.find(b => b.speciesCode === speciesCode);
    if (!bird || !bird.notes) return;

    bird.notes.splice(Number(noteIndex), 1);
        this.updateLocalStorage();
        this.renderNotes(bird);

       
}

     renderNotes(bird) {
            const notesList = document.getElementById(`notes-${bird.speciesCode}`);
            notesList.innerHTML = "";
            bird.notes.forEach((note, index) => {
                const li = document.createElement("li");
                li.dataset.noteIndex = index;
                li.innerHTML = `<strong>${formatDate(new Date(note.date))}:</strong> ${note.text} <button class="delete-note">X</button>`;
                notesList.appendChild(li);
            })
            
    }

        updateLocalStorage() {
            localStorage.setItem("seenBirds", JSON.stringify(this.birds));
        }

}