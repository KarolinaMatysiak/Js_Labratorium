import {Game} from "./game.js"

window.onStartButton = onStartButton

let gameStarted=false;
function onStartButton(){

    if(!gameStarted)
    {
        gameStarted = true;
        const game = new Game()
        game.init()

        const btn = document.getElementById('startBtn')
        btn.style.display="none"
    }
}




















