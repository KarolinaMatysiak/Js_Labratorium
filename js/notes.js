let notes = [];

//akcja ratunkowa na odswiezenie strony
const storedNotes = localStorage.getItem("notes");
if (storedNotes) {
  notes = JSON.parse(storedNotes);
}

export function saveNotesData(note) {
  if (!note) {
    return;
  }

  notes.push({ ...note, id: crypto.randomUUID(), pinned: note.pinned ?? false});
  localStorage.setItem("notes", JSON.stringify(notes));
}

export function displayNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  notes.forEach((note) => {
    const noteContainer = createNoteElement(note);
    notesContainer.appendChild(noteContainer);
  });
}

function createNoteElement(note) {
  const noteContainer = document.createElement("div");
  const headerElement = createHeaderElement(note);
  const noteContentElement = createNoteContentElement(note);
  const buttonsContainer = createButtonsElement(note);

  noteContainer.className = "notes";
  noteContainer.style.backgroundColor = note.noteColor;

  noteContainer.replaceChildren(
    buttonsContainer,
    headerElement,
    noteContentElement
  );

  registerNoteClickEvent(noteContainer);

  return noteContainer;
}

function createHeaderElement(note) {
  const noteHeader = document.createElement("div");
  const noteTitle = document.createElement("h3");
  const noteTags = document.createElement("span");

  noteHeader.className = "note-header";
  noteTitle.textContent = `${
    note.noteTitle.charAt(0).toUpperCase() + note.noteTitle.slice(1)
  }`;
  noteTags.textContent = `#${note.noteTags.toLowerCase().replace(/ /g, "_")}`;

  noteHeader.append(noteTitle, noteTags);

  return noteHeader;
}

function createNoteContentElement(note) {
  const noteContent = document.createElement("p");

  noteContent.className = "notes-content";
  noteContent.textContent = note.noteContent;

  return noteContent;
}

function createButtonsElement(note) {
  const deleteBtn = createDeleteButton(note);
  const pinBtn = createPinButton(note);
  const buttonsContainer = document.createElement("div");

  buttonsContainer.className = "note-buttons-container";

  buttonsContainer.append(pinBtn, deleteBtn);

  return buttonsContainer;
}

function createDeleteButton(note) {
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "note-buttons";
  deleteBtn.id = note.id;

  const deleteBtnImg = document.createElement("img");
  deleteBtnImg.src = "../styles/assets/trash_607318.png";
  deleteBtnImg.alt = "delete";
  deleteBtnImg.width = 11;

  deleteBtn.appendChild(deleteBtnImg);

  deleteBtn.addEventListener("click", deleteNote);

  return deleteBtn;
}

function deleteNote(event) {
  const noteId = event.currentTarget.id;
  const index = notes.findIndex((note) => note.id === noteId);
  if (index === -1) {
    return;
  }

  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes()
}

function createPinButton(note) {
  const pinBtn = document.createElement("button");
  pinBtn.id = note.id;
  pinBtn.className = "note-buttons";

  if (note.pinned) {
    pinBtn.classList.add("pinned");
  }

  const pinBtnImg = document.createElement("img");
  pinBtnImg.src = "../styles/assets/pin_12060883.png";
  pinBtnImg.alt = "pin";
  pinBtnImg.width = 11;

  pinBtn.appendChild(pinBtnImg);

  pinBtn.addEventListener("click", pinNoteToTop);

  return pinBtn;
}

function pinNoteToTop(event) {
  const noteId = event.currentTarget.id;
  const index = notes.findIndex((note) => note.id === noteId);
  if (index === -1) return;

  notes[index].pinned = !notes[index].pinned;

  const [deletedNote] = notes.splice(index, 1);

  if (deletedNote.pinned) {
    notes.unshift(deletedNote);
  } else {
    notes.push(deletedNote);
  }

  localStorage.setItem("notes", JSON.stringify(notes));

  displayNotes();
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

