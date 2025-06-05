export class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        
        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.frictionCoefficient = 0.95;
        this.bounceCoefficient = 0.3;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    updatePhysics(canvasWidth, canvasHeight) {
        this.velocityX += this.accelerationX * 0.5;
        this.velocityY += this.accelerationY * 0.5;

        this.velocityX *= this.frictionCoefficient;
        this.velocityY *= this.frictionCoefficient;

        this.x += this.velocityX;
        this.y += this.velocityY;

        this.handleWallCollisions(canvasWidth, canvasHeight);
    }

    handleWallCollisions(canvasWidth, canvasHeight) {
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.velocityX = -this.velocityX * this.bounceCoefficient;
        }
        if (this.x + this.radius > canvasWidth) {
            this.x = canvasWidth - this.radius;
            this.velocityX = -this.velocityX * this.bounceCoefficient;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocityY = -this.velocityY * this.bounceCoefficient;
        }
        if (this.y + this.radius > canvasHeight) {
            this.y = canvasHeight - this.radius;
            this.velocityY = -this.velocityY * this.bounceCoefficient;
        }
    }

    setTiltAcceleration(accelerationX, accelerationY) {
        this.accelerationX = accelerationX;
        this.accelerationY = accelerationY;
    }

    resetToRandomPosition(canvasWidth, canvasHeight) {
        this.x = Math.random() * (canvasWidth - 2 * this.radius) + this.radius;
        this.y = Math.random() * (canvasHeight - 2 * this.radius) + this.radius;
        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
    }
}



