class Ball {
    constructor(x, y, radius, canvas) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.canvas = canvas;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2; 
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        ctx.closePath();
    }

    update() {
 
        this.x += this.dx;
        this.y += this.dy;

 
        if (this.x + this.radius > this.canvas.width) {
            this.x = this.canvas.width - this.radius;
            this.dx = -Math.abs(this.dx); 
        } else if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.dx = Math.abs(this.dx); 
        }

        if (this.y + this.radius > this.canvas.height) {
            this.y = this.canvas.height - this.radius;
            this.dy = -Math.abs(this.dy); 
        } else if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.dy = Math.abs(this.dy); 
        }
    }
}

class Animation {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.balls = [];
        this.isRunning = false;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;


        this.ballCountSlider = document.getElementById('ballCount');
        this.ballCountValue = document.getElementById('ballCountValue');
        this.connectionDistanceSlider = document.getElementById('connectionDistance');
        this.connectionDistanceValue = document.getElementById('connectionDistanceValue');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.fpsCounter = document.getElementById('fpsCounter');

        this.setupEventListeners();
        this.resizeCanvas();
        this.initializeBalls();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());

        this.ballCountSlider.addEventListener('input', (e) => {
            this.ballCountValue.textContent = e.target.value;
            if (!this.isRunning) {
                this.initializeBalls();
            }
        });

        this.connectionDistanceSlider.addEventListener('input', (e) => {
            this.connectionDistanceValue.textContent = e.target.value + '%';
        });

        this.startBtn.addEventListener('click', () => this.toggleAnimation());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.6;
        if (!this.isRunning) {
            this.initializeBalls();
            this.draw();
        }
    }

    initializeBalls() {
        const ballCount = parseInt(this.ballCountSlider.value);
        this.balls = [];
        
        for (let i = 0; i < ballCount; i++) {
            const radius = 5;
            const x = Math.random() * (this.canvas.width - radius * 2) + radius;
            const y = Math.random() * (this.canvas.height - radius * 2) + radius;
            this.balls.push(new Ball(x, y, radius, this.canvas));
        }
    }

    drawConnections() {
        const maxDistance = (this.canvas.width * parseInt(this.connectionDistanceSlider.value)) / 100;
        
        this.ctx.strokeStyle = 'rgb(52, 152, 219)'; 
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let i = 0; i < this.balls.length; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                const dx = this.balls[i].x - this.balls[j].x;
                const dy = this.balls[i].y - this.balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    this.ctx.moveTo(this.balls[i].x, this.balls[i].y);
                    this.ctx.lineTo(this.balls[j].x, this.balls[j].y);
                }
            }
        }
        this.ctx.stroke();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
   
        this.drawConnections();
        
   
        this.balls.forEach(ball => {
            ball.draw(this.ctx);
            if (this.isRunning) {
                ball.update();
            }
        });

 
        this.frameCount++;
        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;

        if (elapsed >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.fpsCounter.textContent = `FPS: ${this.fps}`;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }

        if (this.isRunning) {
            requestAnimationFrame(() => this.draw());
        }
    }

    toggleAnimation() {
        this.isRunning = !this.isRunning;
        this.startBtn.textContent = this.isRunning ? 'Stop' : 'Start';
        
        if (this.isRunning) {
            this.lastTime = performance.now();
            this.frameCount = 0;
            this.draw();
        }
    }

    reset() {
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        this.initializeBalls();
        this.draw();
    }
}


window.addEventListener('load', () => {
    new Animation();
}); 