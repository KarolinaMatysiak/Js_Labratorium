import {  registerNoteFormEventListener } from './form.js'; 
import { displayNotes } from './notes.js';


function init(){
    registerNoteFormEventListener()
    displayNotes()
}

init();






