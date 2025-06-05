import {Game} from "./game.js"

window.onStartButton = onStartButton

function onStartButton() {
    const startButton = document.getElementById('startBtn');
    if (startButton.style.display !== "none") {
        const game = new Game();
        game.initialize();
        startButton.style.display = "none";
    }
}