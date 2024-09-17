document.addEventListener('DOMContentLoaded', () => {
    const pdfLinks = document.querySelectorAll('.btn[data-pdf]');
    const modal = document.getElementById('pdf-viewer');
    const modalClose = modal.querySelector('.close');
    const pdfContainer = document.getElementById('pdf-container');

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
});