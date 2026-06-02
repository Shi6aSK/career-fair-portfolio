const SHAPE_COUNT = 75;
const LABEL_COUNT = 28;
const CURSOR_RADIUS = 150;
const LABEL_BOUND_RADIUS_FACTOR = 0.45;
const LABEL_RADIUS_MULTIPLIER = 0.65;
const LABEL_FONT = 'Turret Road';

const shapePalette = [
    [232, 93, 4, 160],
    [244, 140, 6, 150],
    [255, 120, 30, 140],
    [200, 65, 0, 130],
    [255, 170, 60, 120],
    [160, 160, 160, 80]
];

const labelSymbols = [
    'C++', 'Python', 'Java', 'Rust', 'Go', 'Kotlin', 'Swift', 'TypeScript', 'Σ', '∫', 'Δ',
    'λ', 'π', 'Ω', 'F=ma', 'E=mc²', 'ħ', '∂/∂t', 'AI', 'ML', 'LLM', 'DL', 'EdgeAI',
    'IoT', '5G', 'Web3', 'Blockchain', 'ZeroTrust', 'Quantum', 'QKD', 'AR', 'VR',
    'XR', 'DevOps', 'MLOps', 'SRE', 'CI/CD', 'Serverless', 'Cloud', 'Kubernetes',
    'Docker', 'Microservices', 'Observability', 'DataOps', '∇', '∑', '{}', '∞'
];

let shapes = [];
let labels = [];

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-container');
    pixelDensity(1);
    frameRate(36);
    textFont(LABEL_FONT);
    textStyle(BOLD);

    if (document.fonts && document.fonts.load) {
        document.fonts
            .load('800 1em "Turret Road"')
            .then(() => textFont(LABEL_FONT))
            .catch(() => textFont(LABEL_FONT));
    }

    for (let i = 0; i < SHAPE_COUNT; i++) {
        shapes.push(new Shape());
    }
    for (let i = 0; i < LABEL_COUNT; i++) {
        labels.push(new FloatingLabel());
    }
}

function draw() {
    clear();
    updateShapes();
    resolveCollisions();
    renderShapes();
    updateLabels();
    resolveLabelCollisions();
    renderLabels();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function updateShapes() {
    const mouseInside = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    const cursorVec = mouseInside ? createVector(mouseX, mouseY) : null;

    for (let i = 0; i < shapes.length; i++) {
        shapes[i].update(cursorVec);
    }
}

function renderShapes() {
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].display();
    }
}

function updateLabels() {
    const mouseInside = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    for (let i = 0; i < labels.length; i++) {
        labels[i].update(mouseInside);
    }
}

function renderLabels() {
    textAlign(CENTER, CENTER);
    for (let i = 0; i < labels.length; i++) {
        labels[i].display();
    }
}

class Shape {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.baseSpeed = random(0.45, 1);
        this.vel = p5.Vector.random2D().setMag(this.baseSpeed);
        this.acc = createVector(0, 0);
        this.size = random(14, 32);
        this.shapeType = random(['circle', 'triangle', 'square']);
        this.color = color(...random(shapePalette));
    }

    update(cursorVec) {
        if (cursorVec) {
            const dir = p5.Vector.sub(cursorVec, this.pos);
            const distSq = dir.magSq();
            if (distSq < CURSOR_RADIUS * CURSOR_RADIUS) {
                dir.normalize().mult(2);
                this.acc = dir;
            } else {
                this.acc.mult(0.5);
            }
        } else {
            this.acc.mult(0.5);
        }

        this.vel.add(this.acc);
        if (this.vel.magSq() > 0.0001) {
            this.vel.setMag(this.baseSpeed);
        } else {
            this.vel = p5.Vector.random2D().setMag(this.baseSpeed);
        }
        this.pos.add(this.vel);

        if (this.pos.x < -60 || this.pos.x > width + 60) {
            this.vel.x *= -1;
        }
        if (this.pos.y < -60 || this.pos.y > height + 60) {
            this.vel.y *= -1;
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
        } else {
            rectMode(CENTER);
            rect(0, 0, this.size, this.size);
        }
        pop();
    }
}

class FloatingLabel {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.baseSpeed = random(0.45, 0.95);
        this.vel = p5.Vector.random2D().setMag(this.baseSpeed);
        this.symbol = random(labelSymbols);
        this.size = random(26, 46);
        const paletteColor = random(shapePalette);
        this.tint = color(...paletteColor);
    }

    update(mouseInside) {
        if (mouseInside) {
            const dir = createVector(mouseX - this.pos.x, mouseY - this.pos.y);
            const distSq = dir.magSq();
            if (distSq < (CURSOR_RADIUS * 0.85) * (CURSOR_RADIUS * 0.85)) {
                dir.normalize().mult(1.1);
                this.vel.add(dir);
            }
        }

        if (this.vel.magSq() > 0.0001) {
            this.vel.setMag(this.baseSpeed);
        } else {
            this.vel = p5.Vector.random2D().setMag(this.baseSpeed);
        }
        this.pos.add(this.vel);
        confineLabel(this);

        if (this.pos.x < -80 || this.pos.x > width + 80) {
            this.vel.x *= -1;
        }
        if (this.pos.y < -80 || this.pos.y > height + 80) {
            this.vel.y *= -1;
        }
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        textFont(LABEL_FONT);
        textSize(this.size);
        fill(this.tint);
        text(this.symbol, 0, 0);
        noFill();
        const circleColor = color(red(this.tint), green(this.tint), blue(this.tint), 0);
        stroke(circleColor);
        strokeWeight(1);
        ellipse(0, 0, this.size * 1.35);
        pop();
    }
}

function confineLabel(label) {
    if (width === 0 || height === 0) return;

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const dx = label.pos.x - centerX;
    const dy = label.pos.y - centerY;
    const distSq = dx * dx + dy * dy;
    if (distSq === 0) {
        return;
    }

    const maxRadius = min(width, height) * LABEL_BOUND_RADIUS_FACTOR;
    const maxRadiusSq = maxRadius * maxRadius;

    if (distSq > maxRadiusSq) {
        const dist = sqrt(distSq);
        const scale = maxRadius / dist;
        label.pos.x = centerX + dx * scale;
        label.pos.y = centerY + dy * scale;

        const normalX = dx / dist;
        const normalY = dy / dist;
        const dot = label.vel.x * normalX + label.vel.y * normalY;
        label.vel.x -= 2 * dot * normalX;
        label.vel.y -= 2 * dot * normalY;
    }
}

function resolveLabelCollisions() {
    for (let i = 0; i < labels.length; i++) {
        const a = labels[i];
        for (let j = i + 1; j < labels.length; j++) {
            const b = labels[j];
            const dx = a.pos.x - b.pos.x;
            const dy = a.pos.y - b.pos.y;
            const minDist = labelRadius(a) + labelRadius(b);
            const distSq = dx * dx + dy * dy;
            if (distSq > minDist * minDist) continue;
            let dist = sqrt(distSq);
            let nx;
            let ny;
            if (dist === 0) {
                const angle = random(TWO_PI);
                nx = cos(angle);
                ny = sin(angle);
                dist = 0.0001;
            } else {
                nx = dx / dist;
                ny = dy / dist;
            }
            const overlap = minDist - dist;
            if (overlap <= 0) continue;
            const push = overlap * 0.5;

            a.pos.x += nx * push;
            a.pos.y += ny * push;
            b.pos.x -= nx * push;
            b.pos.y -= ny * push;

            a.vel.x += nx * 0.2;
            a.vel.y += ny * 0.2;
            b.vel.x -= nx * 0.2;
            b.vel.y -= ny * 0.2;

            a.vel.setMag(a.baseSpeed);
            b.vel.setMag(b.baseSpeed);

            confineLabel(a);
            confineLabel(b);
        }
    }
}

function labelRadius(label) {
    return label.size * LABEL_RADIUS_MULTIPLIER;
}

function resolveCollisions() {
    for (let i = 0; i < shapes.length; i++) {
        const a = shapes[i];
        for (let j = i + 1; j < shapes.length; j++) {
            const b = shapes[j];
            const dx = a.pos.x - b.pos.x;
            const dy = a.pos.y - b.pos.y;
            const distSq = dx * dx + dy * dy;
            const limit = (a.size + b.size) * 0.5;
            if (distSq === 0 || distSq > limit * limit) continue;

            const dist = sqrt(distSq);
            const overlap = limit - dist;
            const nx = dx / dist;
            const ny = dy / dist;
            const offset = overlap * 0.5;

            a.pos.x += nx * offset;
            a.pos.y += ny * offset;
            b.pos.x -= nx * offset;
            b.pos.y -= ny * offset;

            a.vel.x += nx * 0.45;
            a.vel.y += ny * 0.45;
            b.vel.x -= nx * 0.45;
            b.vel.y -= ny * 0.45;

            a.vel.setMag(a.baseSpeed);
            b.vel.setMag(b.baseSpeed);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
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

    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    nav.classList.remove('active');
                }
            });
        });
    }
});
