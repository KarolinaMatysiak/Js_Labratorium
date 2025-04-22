export class Game{
    constructor(){
        this.canvas = null
        this.ctx = null
        this.ballArray = []
    }

    init(){
        this.canvasSetup()
        this.drawCanvas()
        this.registerDeviceMoveEventListener()
    }

    canvasSetup(){
        const container = document.getElementById('mainContainer')

        this.canvas = document.createElement("canvas")
        this.canvas.width = 500
        this.canvas.height = 500
        this.ctx = this.canvas.getContext("2d")
        container.appendChild(this.canvas)
    }

    drawCanvas(){
        const canvasWidth = this.canvas.width
        const canvasHeight = this.canvas.height

        this.ctx.fillStyle = "rgb(243, 207, 198)"
        this.ctx.fillRect(0,0, canvasWidth,canvasHeight)
        this.ctx.strokeStyle="rgb(224, 191, 184)"
        this.ctx.lineWidth= 5
        this.ctx.strokeRect(0,0,canvasWidth,canvasHeight)
    }

    registerDeviceMoveEventListener(){
        window.addEventListener('deviceorientation', onDeviceMove)
    }
    
    
}


 function onDeviceMove(e){

console.log(e)
}

