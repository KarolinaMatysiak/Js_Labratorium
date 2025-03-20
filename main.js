document.addEventListener("DOMContentLoaded", function() {
    const noteForm = document.getElementById("noteForm");
    const notesContainer = document.getElementById("notesContainer");

    function getNotes() {
        return JSON.parse(localStorage.getItem("notes")) || [];
    }

    function saveNotes(notes) {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function renderNotes() {
        notesContainer.innerHTML = "";
        let notes = getNotes();
        notes.sort((a, b) => b.pinned - a.pinned); 
        notes.forEach((note, index) => {
            const noteElement = document.createElement("div");
            noteElement.classList.add("note");
            if (note.pinned) {
                noteElement.classList.add("pinned");
            }
            noteElement.style.backgroundColor = note.color;
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <small>${new Date(note.createdDate).toLocaleString()}</small>
                <button class="delete-btn" data-index="${index}">Usuń</button>
            `;
            notesContainer.appendChild(noteElement);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                deleteNote(index);
            });
        });
    }

    function deleteNote(index) {
        let notes = getNotes();
        notes.splice(index, 1);
        saveNotes(notes);
        renderNotes();
    }

    noteForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const color = document.getElementById("color").value;
        const pinned = document.getElementById("pinned").checked;
        const newNote = {
            title,
            content,
            color,
            pinned,
            createdDate: Date.now()
        };
        let notes = getNotes();
        if (pinned) {
            notes.unshift(newNote); 
        } else {
            notes.push(newNote);
        }
        saveNotes(notes);
        renderNotes();
        noteForm.reset();
    });

    renderNotes();
});