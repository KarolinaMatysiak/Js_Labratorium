export class Hole {
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = "black";
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color;
        ctx.fill()
        ctx.closePath()
    }

    isBallInHole(ball) {
        const dx = ball.x - this.x
        const dy = ball.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < (this.radius - ball.radius / 2)
    }
}
