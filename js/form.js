import {saveNotes} from './notes.js'


export function registerNoteFormEventListener(){
    
    const form = document.getElementById("noteForm");
    
    form.addEventListener("submit", (event) => handleNoteFormSubmitData(event));

}

function handleNoteFormSubmitData(event) {

    // event.preventDefault();
    const formData = new FormData(event.target)
    const formProps = Object.fromEntries(formData);
    
    saveNotes(formProps);
}

