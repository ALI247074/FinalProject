document.addEventListener("DOMContentLoaded", () => {
    const langToggle = document.getElementById("langToggle");
    const langText = document.getElementById("langText");
    const rootHtml = document.getElementById("rootHtml");
    const loginGateForm = document.getElementById("loginGateForm");


    const registerModalOverlay = document.getElementById("registerModalOverlay");
    const txtRegisterTrigger = document.getElementById("txtRegisterTrigger");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const registerGateForm = document.getElementById("registerGateForm");


    const translatableElements = [
        { id: 'txtTitle' },
        { id: 'txtSubtitle' },
        { id: 'lblEmail' },
        { id: 'lblPassword' },
        { id: 'txtRemember' },
        { id: 'txtForgot' },
        { id: 'btnSubmit' },
        { id: 'txtFooterHelp' },
        { id: 'txtNodeBadge' },
        { id: 'txtVisualTitle' },
        { id: 'txtVisualDesc' },
        { id: 'txtCardStatus' },
        { id: 'txtRegisterTrigger' },
        { id: 'txtModalTitle' },
        { id: 'txtModalSubtitle' },
        { id: 'lblRegName' },
        { id: 'lblRegEmail' },
        { id: 'lblRegPassword' },
        { id: 'btnRegisterSubmit' }
    ];


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

        localStorage.setItem("portal_preferred_lang", lang);
    }


    const savedLanguage = localStorage.getItem("portal_preferred_lang") || "en";
    setLanguage(savedLanguage);


    if (langToggle) {
        langToggle.addEventListener("click", () => {
            const currentLang = rootHtml.getAttribute("lang");
            const nextLang = currentLang === "en" ? "ar" : "en";
            setLanguage(nextLang);
        });
    }


    if (txtRegisterTrigger) {
        txtRegisterTrigger.addEventListener("click", () => {
            const rName = document.getElementById("regFullName");
            const rEmail = document.getElementById("regEmail");
            const rPassword = document.getElementById("regPassword");

            if (rName) rName.value = "";
            if (rEmail) rEmail.value = "";
            if (rPassword) rPassword.value = "";

            registerModalOverlay.classList.add("active");
        });
    }


    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", () => {
            registerModalOverlay.classList.remove("active");
        });
    }


    if (registerModalOverlay) {
        registerModalOverlay.addEventListener("click", (e) => {
            if (e.target === registerModalOverlay) {
                registerModalOverlay.classList.remove("active");
            }
        });
    }


    if (loginGateForm) {
        loginGateForm.addEventListener("submit", async(e) => {
            e.preventDefault();

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

            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Verifying Security Credentials...";

            try {
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
                    sessionStorage.setItem("currentUser", JSON.stringify(data.user));


                    window.location.href = "dashboard.html";
                } else {
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


    if (registerGateForm) {
        registerGateForm.addEventListener("submit", async(e) => {
            e.preventDefault();

            const nameInput = document.getElementById("regFullName");
            const emailInput = document.getElementById("regEmail");
            const passwordInput = document.getElementById("regPassword");
            const regSubmitBtn = document.getElementById("btnRegisterSubmit");

            if (!nameInput || !emailInput || !passwordInput) return;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            const originalBtnText = regSubmitBtn.textContent;
            regSubmitBtn.disabled = true;
            regSubmitBtn.textContent = "Provisioning Local Node...";

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    console.log(`[REGISTRATION SUCCESS] Local User Node initialized: ${data.user.email}`);


                    const userPayload = data.user || { name, email, role: "Local" };
                    if (!userPayload.role) userPayload.role = "Local";

                    sessionStorage.setItem("currentUser", JSON.stringify(userPayload));


                    window.location.href = "dashboard.html";
                } else {
                    alert(data.message || "Registration failed. Database node rejection.");
                    regSubmitBtn.disabled = false;
                    regSubmitBtn.textContent = originalBtnText;
                }
            } catch (error) {
                console.error("Security Pipeline Registration Error:", error);
                alert("Connection refused: Security server core cannot finalize node mapping.");
                regSubmitBtn.disabled = false;
                regSubmitBtn.textContent = originalBtnText;
            }
        });
    }
});