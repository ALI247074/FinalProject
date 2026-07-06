document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Pure Dynamic Language Switcher (EN / AR Toggle) Engine ---
    const langToggle = document.getElementById('langToggle');
    const langBtnTxt = langToggle.querySelector('.btn-txt');
    const txtElements = document.querySelectorAll('.data-txt');

    langToggle.addEventListener('click', () => {
        const isEn = document.documentElement.getAttribute('dir') === 'ltr';

        if (isEn) {
            // Transform interface properties to Arabic RTL State
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
            langBtnTxt.textContent = 'English';

            // Loop through DOM data fields converting nodes cleanly
            txtElements.forEach(el => {
                if (el.hasAttribute('data-ar')) {
                    el.textContent = el.getAttribute('data-ar');
                }
            });
        } else {
            // Revert interface properties to Standard English LTR State
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'en');
            langBtnTxt.textContent = 'العربية';

            txtElements.forEach(el => {
                if (el.hasAttribute('data-en')) {
                    el.textContent = el.getAttribute('data-en');
                }
            });
        }

        // Refresh the active dynamic tab context matching language orientation state
        refreshActiveTabContent();
    });

    // --- 2. High Contrast View Engine for Visually Impaired Users ---
    const contrastToggle = document.getElementById('contrastToggle');
    contrastToggle.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const isActive = document.body.classList.contains('high-contrast');
        contrastToggle.querySelector('.btn-txt').textContent = isActive ? 'Normal Vision' : 'High Contrast';
    });

    // --- 3. Dynamic Interactive Medical Standards Tab Switching Mechanism ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contentTitle = document.querySelector('.feature-content-box h3');
    const contentText = document.querySelector('.feature-content-box p');
    const contentIcon = document.querySelector('.icon-box-lg i');

    // Enhanced centralized cross-language dictionary mapping tab nodes perfectly
    const tabData = {
        'en': {
            'HIPAA Security Rule': {
                title: 'HIPAA Security Rule Compliance',
                text: 'Enforces absolute dynamic privilege boundaries on personal electronic health records (eEHR). Every request transaction automatically logs active user cryptographic certificates via immutable auditing blocks.',
                icon: 'fa-file-shield'
            },
            'ISO 27001 Cryptography': {
                title: 'ISO 27001 Global Cryptography Cipher',
                text: 'Employs mathematical transit and rest protection standard matrix nodes. Fully ensures zero-knowledge storage profiles across the public GENESIS framework databases.',
                icon: 'fa-key'
            },
            'HL7 Interoperability': {
                title: 'HL7 Interoperability Interface Data Streams',
                text: 'Facilitates flawless structural data transfers across distinct international health frameworks, keeping real-time user accounting pipelines unified.',
                icon: 'fa-network-wired'
            }
        },
        'ar': {
            'معيار هيبا الطبي لحماية البيانات': {
                title: 'الامتثال الكامل لقانون حماية البيانات الطبي (HIPAA)',
                text: 'يفرض حدوداً صارمة وديناميكية للصلاحيات على السجلات الصحية الإلكترونية المحمية للمرضى، حيث تسجل كل عملية فحص أو تعديل ضمن حزم تدقيق غير قابلة للتزوير برمجياً.',
                icon: 'fa-file-shield'
            },
            'معيار أيزو ٢٧٠٠١ للتشفير': {
                title: 'معيار التشفير العالمي الآمن ISO 27001',
                text: 'يوظف مصفوفة متقدمة من معايير الحماية الرياضية للبيانات أثناء النقل والراحة، مما يضمن تماماً ملفات تخزين المعرفة الصفرية عبر قواعد بيانات جينيسيس.',
                icon: 'fa-key'
            },
            'معيار المقاييس الصحية HL7': {
                title: 'تكامل تدفق البيانات السريرية المشترك HL7',
                text: 'يسهل النقل الهيكلي السلس للبيانات الطبية بين الأنظمة الصحية الدولية المختلفة، مع الحفاظ على وحدة وتكامل حسابات المرضى في الوقت الفعلي.',
                icon: 'fa-network-wired'
            }
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateTabDisplay(this.textContent.trim());
        });
    });

    function updateTabDisplay(tabCategory) {
        const currentLang = document.documentElement.getAttribute('dir') === 'rtl' ? 'ar' : 'en';
        const dataset = tabData[currentLang][tabCategory];

        if (dataset) {
            const box = document.querySelector('.feature-content-box');
            box.style.opacity = '0.3';
            setTimeout(() => {
                contentTitle.textContent = dataset.title;
                contentText.textContent = dataset.text;
                contentIcon.className = `fa-solid ${dataset.icon}`;
                box.style.opacity = '1';
            }, 200);
        }
    }

    function refreshActiveTabContent() {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            updateTabDisplay(activeTab.textContent.trim());
        }
    }

    // --- 4. High-Performance Intersection Observer for Smooth Scroll Reveals ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-down');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. Floating Responsive Mobile Navigation Controller ---
    const menuToggle = document.querySelector('.menu-toggle');
    const glassMenu = document.querySelector('.glass-menu');

    if (menuToggle && glassMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            glassMenu.classList.toggle('active');
        });
    }
});