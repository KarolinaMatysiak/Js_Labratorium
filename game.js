import { Ball } from "./ball.js"
import { Hole } from "./hole.js"

export class Game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.ball = null;
        this.hole = null;
        this.score = 0;
        this.isGameFinished = false;
        this.initialDeviceGamma = null;
        this.initialDeviceBeta = null;
        this.scoreDisplay = null;
        this.scoreHistory = null;
        this.attemptStartTime = Date.now();
    }

    initialize() {
        this.setupCanvas();
        this.setupScoreDisplay();
        this.setupScoreHistory();
        this.createGameObjects();
        this.setupDeviceOrientationHandler();
        this.setupWindowResizeHandler();
        this.startGameLoop();
    }

    setupCanvas() {
        const container = document.getElementById('mainContainer');
        
        const gameArea = document.createElement('div');
        gameArea.style.display = 'flex';
        gameArea.style.alignItems = 'flex-start';
        gameArea.style.gap = '20px';

        this.canvas = document.createElement("canvas");
        this.canvas.width = Math.min(window.innerWidth, 500);
        this.canvas.height = Math.min(window.innerHeight, 400);
        this.canvas.style.border = '3px solid black';
        this.context = this.canvas.getContext("2d");
        
        gameArea.appendChild(this.canvas);
        container.appendChild(gameArea);
    }

    setupScoreDisplay() {
        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.style.fontSize = '24px';
        this.scoreDisplay.style.fontFamily = 'Arial';
        this.scoreDisplay.style.padding = '10px';
        this.scoreDisplay.style.border = '3px solid black';
        this.scoreDisplay.style.backgroundColor = 'white';
        this.updateScoreDisplay();
        
        const gameArea = this.canvas.parentElement;
        gameArea.appendChild(this.scoreDisplay);
    }

    setupScoreHistory() {
        this.scoreHistory = document.createElement('div');
        this.scoreHistory.style.fontSize = '16px';
        this.scoreHistory.style.fontFamily = 'Arial';
        this.scoreHistory.style.padding = '10px';
        this.scoreHistory.style.border = '3px solid black';
        this.scoreHistory.style.backgroundColor = 'white';
        this.scoreHistory.style.minWidth = '200px';
        this.scoreHistory.style.maxHeight = '400px';
        this.scoreHistory.style.overflowY = 'auto';
        this.scoreHistory.innerHTML = '<h3 style="margin-top: 0">Score History</h3>';
        
        const gameArea = this.canvas.parentElement;
        gameArea.appendChild(this.scoreHistory);
    }

    updateScoreDisplay() {
        const currentTime = (Date.now() - this.attemptStartTime) / 1000;
        this.scoreDisplay.innerHTML = `
            <div>Score: ${this.score}</div>
        `;
    }

    addScoreRecord(timeElapsed) {
        const recordElement = document.createElement('div');
        recordElement.style.marginBottom = '10px';
        recordElement.style.padding = '5px';
        recordElement.style.backgroundColor = '#f0f0f0';
        recordElement.style.borderRadius = '5px';
        
        const seconds = (timeElapsed / 1000).toFixed(2);
        recordElement.innerHTML = `
            <div>Score ${this.score}: ${seconds}s</div>
        `;
        
        this.scoreHistory.appendChild(recordElement);
        this.scoreHistory.scrollTop = this.scoreHistory.scrollHeight;
    }

    createGameObjects() {
        const ballRadius = 35;
        this.ball = new Ball(0, 0, ballRadius, "blue");
        this.ball.resetToRandomPosition(this.canvas.width, this.canvas.height);

        const holeRadius = 60;
        this.hole = new Hole(0, 0, holeRadius);
        this.placeHoleRandomly();
        this.attemptStartTime = Date.now();
    }

    placeHoleRandomly() {
        this.hole.x = Math.random() * (this.canvas.width - 2 * this.hole.radius) + this.hole.radius;
        this.hole.y = Math.random() * (this.canvas.height - 2 * this.hole.radius) + this.hole.radius;
    }

    setupDeviceOrientationHandler() {
        window.addEventListener('deviceorientation', (event) => {
            if (this.initialDeviceGamma === null && this.initialDeviceBeta === null) {
                this.initialDeviceGamma = event.gamma;
                this.initialDeviceBeta = event.beta;
                return;
            }

            const accelerationX = (event.gamma - this.initialDeviceGamma) / 100;
            const accelerationY = (event.beta - this.initialDeviceBeta) / 100;
            
            this.ball.setTiltAcceleration(accelerationX, accelerationY);
        });
    }

    setupWindowResizeHandler() {
        window.addEventListener('resize', () => {
            this.canvas.width = Math.min(window.innerWidth, 500);
            this.canvas.height = Math.min(window.innerHeight, 400);
            this.placeHoleRandomly();
            this.ball.resetToRandomPosition(this.canvas.width, this.canvas.height);
        });
    }

    startGameLoop() {
        if (this.isGameFinished) return;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ball.updatePhysics(this.canvas.width, this.canvas.height);
        
        const dx = this.ball.x - this.hole.x;
        const dy = this.ball.y - this.hole.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.hole.radius) {
            this.handleHoleCollision();
        }

        this.hole.draw(this.context);
        this.ball.draw(this.context);
        this.updateScoreDisplay();

        requestAnimationFrame(() => this.startGameLoop());
    }

    handleHoleCollision() {
        const timeElapsed = Date.now() - this.attemptStartTime;
        this.addScoreRecord(timeElapsed);
        
        this.score += 1;
        
        if (this.hole.radius > 25) {
            this.hole.radius -= 1;
        }
        this.placeHoleRandomly();
        this.attemptStartTime = Date.now();
       
    }

    
}



