export class Ball {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.lastTiltY = null;
        this.lastTiltX = null;
        this.initTiltX = null;
    }

    setY(newY, canvasHeight) {
        
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }

    recalculateY(tiltY, canvasHeight) {

//         const sensitivity = 15

//         const startingPoint = 90

       
//         this.x += tiltX

//         if(tiltY<startingPoint)
//         {
//             this.y += tiltY
//         }

//         else if(tiltY>90)
//         {
// this.y -= tiltY
//         }
        


//         // Ograniczenie, żeby kulka nie wychodziła poza canvas
//         this.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.x))
//        

            // sytuacja kiedy startowy kat to 90 stopni
            const minTilt = 45;
            const maxTilt = 135;
            if(!this.lastTiltY) {
                this.lastTiltY = tiltY;
                return;
            }

            const diff = tiltY - this.lastTiltY;
            if (Math.abs(diff) > maxTilt - minTilt) {
                this.lastTiltY = tiltY;
                return;
            }

            const diffRate = diff / (maxTilt - minTilt);
            const translation = canvasHeight * diffRate;

            this.lastTiltY = tiltY;
            this.y = Math.max(this.radius, Math.min(canvasHeight - this.radius, this.y + translation))
    }

    recalculateX(tiltX, canvasWidth) {
 
        //         // Ograniczenie, żeby kulka nie wychodziła poza canvas
        //         this.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.x))
        //        
                    let tiltXNormalized = tiltX + 90;

                    if(!this.lastTiltX || !this.initTiltX) {
                        this.lastTiltX = tiltXNormalized;
                        this.initTiltX = tiltXNormalized;
                        return;
                    }
        
                    // gamma jest od -90 d0 90
                    // rozwazamy tylko sytuacje kiedy startowy kat to 0 stopni

                    // pozwalamy ruszac telefonem tylko o 90 stopni zeby nie krecic za bardzo
                    const allowedTiltDiff = 90;
                    // const minTilt = this.initTiltX - 45;
                    // const maxTilt = this.initTiltX + 45;
                    // if (tiltXNormalized < minTilt || tiltXNormalized > maxTilt) {
                    //     return;
                    // }
        
                    const diff = tiltXNormalized - this.lastTiltX;
                    // if (Math.abs(diff) > allowedTiltDiff) {
                    //     this.lastTiltX = tiltXNormalized;
                    //     return;
                    // }

                    if (Math.abs(diff) > 5 ) {
                        tiltXNormalized = diff > 0 ? this.lastTiltX + 1 : this.lastTiltX - 1;
                        this.lastTiltX = tiltXNormalized;
                    }
        
                    const diffRate = diff / allowedTiltDiff;
                    const translation = canvasWidth * diffRate;
        
                    this.lastTiltX = tiltXNormalized;
                    this.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.x + translation))
            }
}


