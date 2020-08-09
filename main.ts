const enum BallShape {
    Circle,
    Square
}

interface Vector {
    dx: number;
    dy: number;
}

class Ball {
    x: number;
    y: number;
    size: number;
    velocity: Vector;
    shape: BallShape;
    element: HTMLDivElement;

    constructor(x: number, y: number, size: number, shape: BallShape, velocity: Vector) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.shape = shape;
        this.velocity = velocity
        this.element = document.createElement('div');
        document.getElementById('screen').appendChild(this.element);
    }

    draw() {
        switch (this.shape) {
            case BallShape.Circle:
                this.element.style.borderRadius = '50%'
            case BallShape.Square:
                this.element.style.height = this.size.toString() + 'px';
                this.element.style.width = this.size.toString() + 'px';
                this.element.style.position = 'fixed';
                this.element.style.backgroundColor = '#61e861';
                this.element.style.top = (this.y - this.size/2).toString() + 'px';
                this.element.style.left = (this.x - this.size/2).toString() + 'px';
        }
    }

    update() {
        this.x += this.velocity.dx;
        this.y += this.velocity.dy;
    }

    getBounds() {
        return {
            left: this.x - (this.size/2),
            right: this.x + (this.size/2),
            top: this.y - (this.size/2),
            bottom: this.y + (this.size/2)
        };
    }
}

const TAU = 2*Math.PI; // because professionals have standards
const paddleSize: number = 3;
const speed = 3;
const paddleVelocityInfluence = 0.025;
let score = 0;
let highscore;
let height: number;
let width: number;
let scoreFlag: boolean = true;
let lastScrollY: number;
let scrollYVelocity: number = 0;
let lastScrollX: number;
let scrollXVelocity: number = 0;

document.addEventListener('DOMContentLoaded', main);

window.addEventListener('resize', resize);

function main() {
    resize()

    const mainBall = new Ball(window.innerWidth/2, window.innerHeight/2, 50, BallShape.Square, 
                              generateVectorWithRandomAngle(1/12, 2/12, speed));
    mainBall.draw()

    highscore = parseInt(document.getElementById('highscore').innerHTML, 10); // so it can be set in PHP

    // sometimes it doesn't work without the 10ms delay
    setTimeout(() => {
        document.body.scrollTop = height/2 - window.innerHeight/paddleSize;
        document.body.scrollLeft = width/2 - window.innerWidth/paddleSize;
    }, 10);

    lastScrollY = document.body.scrollTop;
    lastScrollX = document.body.scrollLeft;

    const loop = setInterval(() => {
        mainBall.update();
        mainBall.draw();

        scrollVelocity();

        const bounds = mainBall.getBounds();
        if (bounds.left > window.innerWidth || bounds.top > window.innerHeight) {
            mainBall.x = window.innerWidth/2;
            mainBall.y = window.innerHeight/2;
            mainBall.velocity = generateVectorWithRandomAngle(1/12, 2/12, speed);
            scoreFlag = true;
            if (score > highscore){
                setHighscore(score);
            }
            setScore(0);
            document.body.scrollTop = height/2 - window.innerHeight/paddleSize;
            document.body.scrollLeft = width/2 - window.innerWidth/paddleSize;
            return;
        }
        if (bounds.right >= window.innerWidth - 7 /*&& bounds.right < window.innerWidth*/) {
            const sbBoundsVertical = getScrollbarBoundsVertical(false);
            if (bounds.bottom > sbBoundsVertical.top && bounds.top < sbBoundsVertical.bottom) {
                if (mainBall.velocity.dx > 0) {
                    mainBall.velocity = changeMagnitudeOfVector(mainBall.velocity, 0.5);
                    mainBall.velocity.dx = -mainBall.velocity.dx;
                    mainBall.velocity.dy += scrollYVelocity * paddleVelocityInfluence;
                    if (scoreFlag) {
                        setScore(score + 1);
                        scoreFlag = false;
                    }
                    // mainBall.x = Math.min(mainBall.x, window.innerWidth - 7 - mainBall.size/2);
                }
            }
        }
        if (bounds.bottom >= window.innerHeight - 7 /*&& bounds.bottom < window.innerHeight*/) {
            const sbBoundsHorizontal = getScrollbarBoundsHorizontal(false);
            if (bounds.right > sbBoundsHorizontal.left && bounds.left < sbBoundsHorizontal.right) {
                if (mainBall.velocity.dy > 0) {
                    mainBall.velocity = changeMagnitudeOfVector(mainBall.velocity, 0.5);
                    mainBall.velocity.dy = -mainBall.velocity.dy;
                    mainBall.velocity.dx += scrollXVelocity * paddleVelocityInfluence;
                    if (scoreFlag) {
                        setScore(score + 1);
                        scoreFlag = false;
                    }
                    // mainBall.y = Math.min(mainBall.y, window.innerHeight - 7 - mainBall.size/2);
                }
            }
        }

        // make the whole top/left sides bouncy
        if (bounds.left <= 0) {
            mainBall.velocity = changeMagnitudeOfVector(mainBall.velocity, 0.5);
            mainBall.velocity.dx = -mainBall.velocity.dx;
            scoreFlag = true;
        }
        if (bounds.top <= 0) {
            mainBall.velocity = changeMagnitudeOfVector(mainBall.velocity, 0.5);
            mainBall.velocity.dy = -mainBall.velocity.dy;
            scoreFlag = true;
        }
    }, 10)
}

function scrollVelocity() {
    scrollXVelocity = document.body.scrollLeft - lastScrollX;
    scrollYVelocity = document.body.scrollTop - lastScrollY;
    lastScrollX = document.body.scrollLeft;
    lastScrollY = document.body.scrollTop;
}

function changeMagnitudeOfVector(vector: Vector, dMagnitude: number) {
    const currentMagnitude = Math.sqrt(Math.pow(vector.dx, 2) + Math.pow(vector.dy, 2));
    const newMagnitude = currentMagnitude + dMagnitude;
    const unitVector: Vector = { dx: vector.dx/currentMagnitude, dy: vector.dy/currentMagnitude };
    return { dx: unitVector.dx * newMagnitude, dy: unitVector.dy * newMagnitude };
}

function setHighscore(newHighscore) {
    highscore = newHighscore;
    document.getElementById('highscore').innerHTML = highscore.toString();
    document.cookie = 'highscore=' + highscore + ';expires=Fri, 31-Dec-9999 23:59:59 GMT';
}

function setScore(newScore) {
    score = newScore;
    document.getElementById('score').innerHTML = score.toString();
}

function resize() {
    height = window.innerHeight*paddleSize;
    width = window.innerWidth*paddleSize;
    document.getElementById('size').style.height = height.toString() + 'px';
    document.getElementById('size').style.width = width.toString() + 'px';

    // document.getElementById
}

function generateVectorWithRandomAngle(min: number, max: number, magnitude: number) {
    const angleFraction = min + (Math.random() * (max-min));
    const angle = TAU * angleFraction;
    return generateVectorWithAngle(angle, magnitude);
}

function generateVectorWithAngle(angle: number, magnitude: number) {
    return { dx: magnitude*Math.cos(angle), dy: magnitude*Math.sin(angle) }
}

function getScrollbarBoundsVertical(asPercent: boolean) {
    const scrollbarSize = window.innerHeight/paddleSize;
    const scrollAmount = document.body.scrollTop/paddleSize;
    if (asPercent) {
        return { top: scrollAmount/window.innerHeight, bottom: (scrollAmount + scrollbarSize)/window.innerHeight }
    }
    return { top: scrollAmount, bottom: scrollAmount + scrollbarSize }
}

function getScrollbarBoundsHorizontal(asPercent: boolean) {
    const scrollbarSize = window.innerWidth/paddleSize;
    const scrollAmount = document.body.scrollLeft/paddleSize;
    if (asPercent) {
        return { left: scrollAmount/window.innerWidth, right: (scrollAmount + scrollbarSize)/window.innerWidth }
    }
    return { left: scrollAmount, right: scrollAmount + scrollbarSize }
}
