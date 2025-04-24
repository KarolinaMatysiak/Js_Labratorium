import { Ball } from "./ball.js"
import { Hole } from "./hole.js"

export class Game{
    constructor(){
        this.canvas = null
        this.ctx = null
        this.ball = null
        this.hole = null
        this.startTime = null
        this.endTime = null
        this.tiltX = 0
        this.tiltY = 0
        this.scores = []
    }

    init(){
        this.gameCanvasSetup()
        this.gameObjSetup()
        this.registerDeviceMoveEventListener()
        this.startTime = new Date()
        this.runGameTick()
    }

    gameCanvasSetup(){
        const container = document.getElementById('mainContainer')

        this.canvas = document.createElement("canvas")
        this.canvas.width = 500
        this.canvas.height = 500
        this.ctx = this.canvas.getContext("2d")
        container.appendChild(this.canvas)
    }

    gameObjSetup() {
        const ballRadius = 20
        const ballX = this.getRandom(ballRadius, this.canvas.width - ballRadius)
        const ballY = this.getRandom(ballRadius, this.canvas.height - ballRadius)
        this.ball = new Ball(ballX, ballY, ballRadius, "purple")

        const holeRadius = 25;
        const holeX = this.getRandom(holeRadius, this.canvas.width - holeRadius)
        const holeY = this.getRandom(holeRadius, this.canvas.height - holeRadius)
        this.hole = new Hole(holeX, holeY, holeRadius)
    }

    draw(){
        this.drawBackground();
        this.hole.draw(this.ctx)
        this.ball.draw(this.ctx)
    }

    // TODO extract to the background class
    //not finished
    drawBackground() {
        const w = this.canvas.width
        const h = this.canvas.height

        this.ctx.fillStyle = "rgb(243, 207, 198)"
        this.ctx.fillRect(0, 0, w, h)

        this.ctx.strokeStyle = "rgb(224, 191, 184)"
        this.ctx.lineWidth = 5
        this.ctx.strokeRect(0, 0, w, h)
    }

    // TODO find better name for single game tick - one round of event loop
    //not finished
    runGameTick() {
        this.draw()

        if (this.hole.isBallInHole(this.ball)) {
            this.endGame()
        } else {
            requestAnimationFrame(() => this.runGameTick())
        }
    }



    registerDeviceMoveEventListener(){
        window.addEventListener('deviceorientation', (e) => {
            const tiltX  = e.gamma || 0
            const tiltY = e.beta || 0 
            const tiltZ = e.alpha || 0     

            this.ball.recalculateY(tiltY, this.canvas.height)
            this.ball.recalculateX(tiltX,tiltZ, this.canvas.width)
        })
    }

 

    endGame() {
        this.endTime = new Date();
        const timeTaken = ((this.endTime - this.startTime) / 1000).toFixed(2);
    
        this.scores.push(timeTaken);
    

        let scoresList = document.getElementById('scoresList');
    

        if (!scoresList) {
            scoresList = document.createElement('ul');
            scoresList.id = 'scoresList';
            document.getElementById('mainContainer').appendChild(scoresList);
        }
    

        scoresList.innerHTML = '';
        this.scores.forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `Rekord ${index + 1}: ${score} sekund`;
            scoresList.appendChild(li);
        });
    
        setTimeout(() => {
            this.resetGame();
        }, 1000);
    }

    
    

    // TODO extract to separate helpers class
    //not finished
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }

    resetGame() {
        this.gameObjSetup();
        this.startTime = new Date();
        this.runGameTick();
    }
}


