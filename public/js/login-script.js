document.addEventListener("DOMContentLoaded", () => {
    const langToggle = document.getElementById("langToggle");
    const langText = document.getElementById("langText");
    const rootHtml = document.getElementById("rootHtml");
    const loginGateForm = document.getElementById("loginGateForm");

    // 🌐 قائمة بجميع العناصر التي تحتاج للترجمة الفورية عند قلب الواجهة
    const translatableElements = [
        { id: 'txtTitle', attr: 'title' },
        { id: 'txtSubtitle', attr: 'subtitle' },
        { id: 'lblEmail', attr: 'email' },
        { id: 'lblPassword', attr: 'password' },
        { id: 'txtRemember', attr: 'remember' },
        { id: 'txtForgot', attr: 'forgot' },
        { id: 'btnSubmit', attr: 'submit' },
        { id: 'txtFooterHelp', attr: 'footer' },
        { id: 'txtNodeBadge', attr: 'badge' },
        { id: 'txtVisualTitle', attr: 'vtitle' },
        { id: 'txtVisualDesc', attr: 'vdesc' },
        { id: 'txtCardStatus', attr: 'vstatus' }
    ];

    // دالة لتحديث نصوص الواجهة والاتجاهات بناءً على اللغة المحددة
    function setLanguage(lang) {
        if (lang === "ar") {
            rootHtml.setAttribute("lang", "ar");
            rootHtml.setAttribute("dir", "rtl");
            if (langText) langText.textContent = "English"; 

            translatableElements.forEach(el => {
                const element = document.getElementById(el.id);
                if (element) element.textContent = element.getAttribute("data-ar");
            });
        } else {
            rootHtml.setAttribute("lang", "en");
            rootHtml.setAttribute("dir", "ltr");
            if (langText) langText.textContent = "العربية";

            translatableElements.forEach(el => {
                const element = document.getElementById(el.id);
                if (element) element.textContent = element.getAttribute("data-en");
            });
        }
        // 💾 حفظ لغة المستخدم المختارة في الذاكرة
        localStorage.setItem("portal_preferred_lang", lang);
    }

    // فحص إذا كان المستخدم قد اختار لغة مسبقاً، وإلا نعتمد الإنجليزية كافتراضي
    const savedLanguage = localStorage.getItem("portal_preferred_lang") || "en";
    setLanguage(savedLanguage);

    // حدث الضغط على زر التبديل
    if (langToggle) {
        langToggle.addEventListener("click", () => {
            const currentLang = rootHtml.getAttribute("lang");
            const nextLang = currentLang === "en" ? "ar" : "en";
            setLanguage(nextLang);
        });
    }

    // ======================================================================
    // 🔐 حل مشكلة الربط والانتقال التلقائي إلى واجهة الـ Dashboard الموحدة
    // ======================================================================
    if (loginGateForm) {
        loginGateForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // منع إعادة تحميل الصفحة الافتراضي

            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const submitBtn = document.getElementById("btnSubmit");

            if (!emailInput || !passwordInput) return;

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                alert("Please fill in all required authentication fields.");
                return;
            }

            // تحويل الزر إلى حالة التحميل ليعطي طابعاً احترافياً تكتيكياً أثناء الفحص
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Verifying Security Credentials...";

            try {
                // إرسال طلب التحقق الآمن إلى خادم الـ Express المركزي
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    console.log(`[AUTH SUCCESS] Token established for node: ${data.user.email}`);
                    
                    // 💾 حقن كائن الجلسة المشفرة في الـ sessionStorage ليتعرف عليه الـ RBAC في الداشبورد
                    sessionStorage.setItem("currentUser", JSON.stringify(data.user));
                    
                    // 🚀 الانتقال الفوري والمؤمن إلى لوحة التحكم والعمليات الزجاجية الشاملة
                    window.location.href = "dashboard.html";
                } else {
                    // عرض رسالة الخطأ القادمة مباشرة من السيرفر (سواءً حساب غير موجود أو كلمة مرور خاطئة)
                    alert(data.message || "Authentication failed. Invalid clearance assets.");
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            } catch (error) {
                console.error("Security Pipeline Authentication Error:", error);
                alert("Connection refused: Critical node authentication server offline.");
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});