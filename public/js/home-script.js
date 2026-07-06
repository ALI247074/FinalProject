document.addEventListener('DOMContentLoaded', () => {

    // --- 1. محرك تبديل اللغة التلقائي الثنائي (EN / AR Toggle) ---
    const langToggle = document.getElementById('langToggle');
    const langBtnTxt = langToggle.querySelector('.btn-txt');
    const txtElements = document.querySelectorAll('.data-txt');

    langToggle.addEventListener('click', () => {
        const isEn = document.documentElement.getAttribute('dir') === 'ltr';

        if (isEn) {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
            langBtnTxt.textContent = 'English';

            txtElements.forEach(el => {
                if (el.hasAttribute('data-ar')) {
                    el.textContent = el.getAttribute('data-ar');
                }
            });
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'en');
            langBtnTxt.textContent = 'العربية';

            txtElements.forEach(el => {
                if (el.hasAttribute('data-en')) {
                    el.textContent = el.getAttribute('data-en');
                }
            });
        }

        // تحديث المحتوى التفاعلي للتبويب النشط ليطابق اتجاه ولغة الصفحة الجديدة
        refreshActiveTabContent();
    });

    // --- 2. محرك وضع التباين العالي لذوي الاحتياجات البصرية ---
    const contrastToggle = document.getElementById('contrastToggle');
    contrastToggle.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const isActive = document.body.classList.contains('high-contrast');
        contrastToggle.querySelector('.btn-txt').textContent = isActive ? 'Normal Vision' : 'High Contrast';
    });

    // --- 3. محرك التبويب التفاعلي المخصص للمحاور والمهارات الأكاديمية ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contentTitle = document.querySelector('.feature-content-box h3');
    const contentText = document.querySelector('.feature-content-box p');
    const contentIcon = document.querySelector('.icon-box-lg i');

    // قاموس مخصص بالكامل ومطابق بدقة للهوية الشخصية والتعليمية الجديدة
    const tabData = {
        'en': {
            'Academic Focus': {
                title: 'Information Security & Compliance',
                text: 'Focusing on academic research and projects related to risk management and the development of system security infrastructure, as well as aligning software architectures with global information security standards such as ISO 27000.',
                icon: 'fa-user-shield'
            },
            'Technical Skills': {
                title: 'Full-Stack Development & Cryptography',
                text: 'Proficient in engineering modern fluid interfaces utilizing advanced CSS 3/HTML 5 logical properties, combined with robust backend validation environments and encryption methodologies in some projects which i work on it.',
                icon: 'fa-code'
            },
            'Future Vision': {
                title: 'Innovating Secure Digital Infrastructure',
                text: 'Aiming to spearhead pioneering developments in securing medical and institutional telemetry platforms, providing absolute resilience against evolving operational vulnerabilities.',
                icon: 'fa-lightbulb'
            }
        },
        'ar': {
            'التركيز الأكاديمي': {
                title: 'أمن المعلومات والحوكمة والامتثال',
                text: 'التركيز على البحوث الأكاديمية والمشاريع المتعلقة بإدارة المخاطر وبناء البنى التحتية الأمنية للأنظمة، ومطابقة الهياكل البرمجية مع معايير أمن المعلومات العالمية كأيزو 27000.',
                icon: 'fa-user-shield'
            },
            'المهارات التقنية': {
                title: 'تطوير الواجهات المتكاملة والأنظمة المشفرة',
                text: 'متمكن من هندسة واجهات المستخدم الحديثة والمعمارية المعقدة باستخدام خصائص التصميم المنطقية، مع ربطها بحلقات التحقق الخلفية الآمنة كما يحدث في بعض المشاريع التي اعمل عليها',
                icon: 'fa-code'
            },
            'الرؤية المستقبلية': {
                title: 'ابتكار بنى تحتية رقمية آمنة ومقاومة للاختراق',
                text: 'أطمح لقيادة المشاريع التقنية الهادفة لتأمين منصات نقل البيانات الحساسة وحمايتها بشكل مطلق ضد الثغرات والتهديدات السيبرانية الناشئة.',
                icon: 'fa-lightbulb'
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

    // تشغيل التبويب الأول افتراضياً عند التحميل الأول للصفحة
    refreshActiveTabContent();

    // --- 4. محرك الرصد (Intersection Observer) للظهور والانعكاس الانسيابي عند التمرير ---
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

    // --- 5. متحكم القائمة الزجاجية الجانبية لأجهزة الجوال ---
    const menuToggle = document.querySelector('.menu-toggle');
    const glassMenu = document.querySelector('.glass-menu');

    if (menuToggle && glassMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            glassMenu.classList.toggle('active');
        });
    }
});