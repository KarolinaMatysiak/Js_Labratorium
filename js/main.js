import {  registerNoteFormSubmitEventListener } from './form.js'; 
import { displayNotes } from './notes.js';


function init(){
    registerNoteFormSubmitEventListener()
    displayNotes()
}

init();






