let particles = [];

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-container');
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    clear();
    for (let particle of particles) {
        particle.update();
        particle.display();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.size = random(3, 8);
        this.color = color(random(200, 255), random(200, 255), random(200, 255), 150);
    }

    update() {
        this.pos.add(this.vel);
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    }

    display() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pdfLinks = document.querySelectorAll('.btn[data-pdf]');
    const modal = document.getElementById('pdf-viewer');
    const modalClose = modal.querySelector('.close');
    const pdfContainer = document.getElementById('pdf-container');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    pdfLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfUrl = link.getAttribute('data-pdf');
            openPdfViewer(pdfUrl);
        });
    });

    modalClose.addEventListener('click', closePdfViewer);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePdfViewer();
        }
    });

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    function openPdfViewer(pdfUrl) {
        modal.style.display = 'block';
        PDFObject.embed(pdfUrl, pdfContainer, {
            height: '100%',
            pdfOpenParams: {
                view: 'FitV',
                page: '1'
            }
        });
    }

    function closePdfViewer() {
        modal.style.display = 'none';
        pdfContainer.innerHTML = '';
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation on scroll
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

    // Particle interaction with mouse
    document.addEventListener('mousemove', (e) => {
        let mouseX = e.clientX;
        let mouseY = e.clientY;
        particles.forEach(particle => {
            let d = dist(mouseX, mouseY, particle.pos.x, particle.pos.y);
            if (d < 100) {
                particle.vel = p5.Vector.sub(particle.pos, createVector(mouseX, mouseY));
                particle.vel.setMag(random(2, 5));
            }
        });
    });
});