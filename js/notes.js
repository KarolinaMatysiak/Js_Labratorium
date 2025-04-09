let notes = [];

//akcja ratunkowa na odswiezenie strony
const storedNotes = localStorage.getItem("notes");
if (storedNotes) {
  notes = JSON.parse(storedNotes);
}

export function saveNotes(note) {
  if (!note) {
    return;
  }

  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
}

export function displayNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    const noteHeader = document.createElement("div");
    const noteTitle = document.createElement("h3");
    const noteContent = document.createElement("p");
    const noteTags = document.createElement("span");

    noteElement.className = "notes";
    noteContent.className = "notes-content";
    noteHeader.className = "note-header";
    noteElement.style.backgroundColor = note.noteColor;

    noteTitle.textContent = `${note.noteTitle.charAt(0).toUpperCase() + note.noteTitle.slice(1)}`;
    noteContent.textContent = note.noteContent;
    noteTags.textContent =  `#${note.noteTags.replace(/ /g, '_')}`;

    noteHeader.append(noteTitle, noteTags);

    noteElement.replaceChildren(noteHeader, noteContent);

    notesContainer.appendChild(noteElement);

    registerNoteClickEvent(noteElement);
  });
}

function registerNoteClickEvent(noteElement) {
  noteElement.addEventListener("click", () => {
    const content = noteElement.querySelector(".notes-content");

    if (noteElement.classList.contains("expanded")) {
        content.scrollTop = 0; 
      }
    noteElement.classList.toggle("expanded");
  });
}



// export const getNotesFromStorage = () => JSON.parse(localStorage.getItem("notes")) || [];

// // Usuwanie notatki
// export const deleteNote = (index) => {
//     let notes = getNotes();
//     notes.splice(index, 1);
//     saveNotes(notes);
// };

// // Dodawanie nowej notatki
// export const addNote = (newNote) => {
//     let notes = getNotes();
//     if (newNote.pinned) {
//         notes.unshift(newNote); // Dodaj na początek, jeśli przypięta
//     } else {
//         notes.push(newNote);    // Dodaj na koniec, jeśli nieprzypięta
//     }
//     saveNotes(notes);
// };

// export const pinNote = (index) => {
//     let notes = getNotes();  // Pobierz wszystkie notatki
//     const note = notes[index]; // Zidentyfikuj notatkę według indeksu
//     note.pinned = true;  // Zmieniamy status na przypięty
//     saveNotes(notes);  // Zapisujemy zaktualizowaną tablicę notatek w localStorage
//     renderNotes();  // Renderujemy notatki ponownie, żeby pokazać zmiany
// };

// // Renderowanie notatek
// export const renderNotes = () => {
//     const notesContainer = document.getElementById("notesContainer");
//     notesContainer.innerHTML = ""; // Wyczyść zawartość

//     let notes = getNotes();
//     // Sortujemy notatki alfabetycznie (np. według tytułu)
//     notes.sort((a, b) => a.title.localeCompare(b.title));

//     notes.forEach((note, index) => {
//         const noteElement = document.createElement("div");
//         noteElement.classList.add("note");
//         if (note.pinned) {
//             noteElement.classList.add("pinned");  // Wizualne przypięcie
//         }
//         noteElement.style.backgroundColor = note.color;
//         noteElement.innerHTML = `
//             <h3>${note.title}</h3>
//             <p>${note.content}</p>
//             <small>${new Date(note.createdDate).toLocaleString()}</small>
//             <button class="delete-btn" data-index="${index}">Usuń</button>
//             <button class="pin-btn" data-index="${index}">Przypnij</button> <!-- Przycisk przypinania -->
//         `;
//         notesContainer.appendChild(noteElement);
//     });

//     // Event listener do usuwania notatek
//     document.querySelectorAll(".delete-btn").forEach(button => {
//         button.addEventListener("click", function () {
//             const index = this.getAttribute("data-index");
//             deleteNote(index);
//             renderNotes();  // Po usunięciu notatki ponownie renderujemy
//         });
//     });

//     // Event listener do przypinania notatek
//     document.querySelectorAll(".pin-btn").forEach(button => {
//         button.addEventListener("click", function () {
//             const index = this.getAttribute("data-index");
//             pinNote(index); // Wywołanie funkcji pinNote
//         });
//     });
// };
