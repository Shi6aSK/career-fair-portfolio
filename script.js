let shapes = [];
let minDistance = 100; 

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-container');
    for (let i = 0; i < 200; i++) {
        shapes.push(new Shape());
    }
}

function draw() {
    clear();
    for (let shape of shapes) {
        shape.update();
        shape.display();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Shape {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().mult(random(0.2, 0.8));
        this.acc = createVector(0, 0);
        this.size = random(10, 30);
        this.shapeType = random(['circle', 'triangle', 'square']);
        this.color = color(
            random(200, 255),
            random(200, 255),
            random(200, 255),
            random(100, 200)
        );
    }

    update() {
        let mouse = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(mouse, this.pos);
        let distance = dir.mag();

        if (distance < minDistance) {
            dir.setMag(0.5); 
        } else {
            dir.setMag(0);
        }
        this.acc = dir;

        this.vel.add(this.acc);
        this.vel.limit(2);
        this.pos.add(this.vel);

        this.checkCollisions();

        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    }

    checkCollisions() {
        for (let other of shapes) {
            if (other !== this) {
                let distBetween = p5.Vector.dist(this.pos, other.pos);
                let combinedSize = (this.size + other.size) / 2;

                if (distBetween < combinedSize) {
                    let pushAway = p5.Vector.sub(this.pos, other.pos);
                    pushAway.setMag(0.5); 
                    this.vel.add(pushAway);
                }
            }
        }
    }

    display() {
        noStroke();
        fill(this.color);
        push();
        translate(this.pos.x, this.pos.y);
        rotate(frameCount * 0.02);
        if (this.shapeType === 'circle') {
            ellipse(0, 0, this.size);
        } else if (this.shapeType === 'triangle') {
            triangle(0, -this.size / 2, -this.size / 2, this.size / 2, this.size / 2, this.size / 2);
        } else if (this.shapeType === 'square') {
            rectMode(CENTER);
            rect(0, 0, this.size, this.size);
        }
        pop();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.content-item').forEach(item => {
        observer.observe(item);
    });
});
