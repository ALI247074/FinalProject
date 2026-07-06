document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Tab Switching Privileges Logic (RBAC Component) ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contentTitle = document.querySelector('.feature-content-box h3');
    const contentText = document.querySelector('.feature-content-box p');
    const contentIcon = document.querySelector('.icon-box-lg i');

    const tabData = {
        'Consultants & Physicians': {
            title: 'Consultants & Physicians',
            text: 'Grants fully privileged read and write access bounds to comprehensive patient electronic health charts, supporting clinical telemetry auditing and dynamic encrypted electronic signature signing matrices.',
            icon: 'fa-user-md'
        },
        'Nursing & EMS Staff': {
            title: 'Nursing & EMS Staff',
            text: 'Provides strict situational access to patient vital indicators, dynamic medication lists, and triage logging matrices without exposing core underlying clinical diagnosis charts or deep genetic data assets.',
            icon: 'fa-user-nurse'
        },
        'Hospital Administration': {
            title: 'Hospital Administration & Security Audit',
            text: 'Full overarching visibility into enterprise system operation histories, real-time query log accounting streams (Audit Logs), credential management, and access scope provisioning loops.',
            icon: 'fa-shield-halved'
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const category = this.textContent.trim();
            if (tabData[category]) {
                const box = document.querySelector('.feature-content-box');
                box.style.opacity = '0.5';
                setTimeout(() => {
                    contentTitle.textContent = tabData[category].title;
                    contentText.textContent = tabData[category].text;
                    contentIcon.className = `fa-solid ${tabData[category].icon}`;
                    box.style.opacity = '1';
                }, 200);
            }
        });
    });

    // --- 2. Scroll Reveal Framework (Intersection Observer Implementation) ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-down');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. Authorization Request Form Modal Controller Engine ---
    const modal = document.getElementById('getStartedModal');
    const successModal = document.getElementById('successModal');
    const topSuccess = document.getElementById('topSuccess');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.querySelector('.close-modal');
    const successClose = document.querySelector('.success-close');
    const closeTop = document.querySelector('.close-top');
    const modalForm = document.querySelector('.modal-form');

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (modal) modal.classList.add('open');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }

    if (successClose) {
        successClose.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    if (closeTop) {
        closeTop.addEventListener('click', () => {
            topSuccess.classList.remove('active');
        });
    }

    // Modal Submission Validation and Simulated Success Pipeline
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (modal) modal.classList.remove('open');

            // Activate structural top success message strip
            if (topSuccess) topSuccess.classList.add('active');

            // Instantiation trigger for full modal success window overlay
            setTimeout(() => {
                if (successModal) successModal.classList.add('active');
            }, 600);
        });
    }

    // Close Modals via Outside Backdrop Click Patterns
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    // --- 4. Responsive Floating Glass Menu Toggle Controller ---
    const menuToggle = document.querySelector('.menu-toggle');
    const glassMenu = document.querySelector('.glass-menu');

    if (menuToggle && glassMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            glassMenu.classList.toggle('active');
        });
    }
});