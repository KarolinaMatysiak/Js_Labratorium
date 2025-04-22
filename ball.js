export class Ball {
    constructor(x,y, xVel, yVel, radius, color){
        this.x = x
        this.y = y
        this.xVel = xVel
        this.yVel = yVel
        this.radius = radius
        this.color = color
    }

    createRandomNumber(min,max){
        return Math.floor(Math.random()*(max-min)+min)
    }

    createBalls(numberOfBalls){
   

        for(let i; i< numberOfBalls; i++)
        {
            let x = this.createRandomNumber(50,this.canvas.with - 50)
            let y = this.createRandomNumber(50,this.canvas.height - 50)
            let ball= new Ball(x,y,)
        }

    }
}

