//منع تصعيد الصلاحيات عن طريق ثغرة 
//Broken Access Control
(function enforceImmediateAccessControl() {

    const currentSession = sessionStorage.getItem("currentUser");

    //توجيه الغير مصرح له بالدخول واخراجه 
    if (!currentSession) {

        window.location.replace("error.html");
        return;
    }

    try {

        const account = JSON.parse(currentSession);
        //في حال كان المستخدم الذي يحاول تسجيل الدخول احد هذه الصلاحيات ف يتم ادخاله حسب صلاحيته للنظام
        const validRoles = ["admin", "consultant", "pharmacist", "doctor", "auditor", "local", "public"];

        if (!account || !account.role || !validRoles.includes(account.role.trim().toLowerCase())) {
            window.location.replace("error.html");
            return;
        }
    } catch (e) {

        sessionStorage.clear();
        window.location.replace("error.html");
        return;
    }
})();


const translations = {
    en: {
        brandTitle: 'Care<span class="silver-tint">Shield</span>',
        brandSubtitle: 'Secured Node Control',
        menuAdminAccounts: 'Managing employee accounts',
        menuAdminSettings: 'FeedBack & Critical issues',
        menuAdminLogs: 'Complete System Monitoring Archive',
        menuAdminAi: 'AI Engine',
        menuLocal: 'Local Insights Layer',
        menuConsultant: 'Advisor List',
        menuDoctor: 'Doctor List',
        menuPharmacist: 'Pharmacist List',
        menuAuditor: 'Auditor List',
        identityManagementTitle: 'Identity Management',
        accountConfigBtn: 'Account Configuration',
        terminateSessionBtn: 'Terminate Session',
        workspaceTitle: 'Real-Time Clinical Data Operations',
        workspaceDesc: 'Role-Based Access Control (RBAC Enforcer Layer Matrix Active).',
        nodeStatusLabel: 'Node.js Core:',
        nodeStatusValue: 'Online',
        roomAdminTitle: 'Security Administrator Center',
        roomAdminHeading: 'Welcome Back, System Administrator',
        roomAdminDesc: 'Utilize the administrative shell located on the left menu panel to initiate AI model inspections, provision access tokens, or audit system event trails logs.',
        roomConsultantTitle: 'Clinical Consultant Vault',
        roomConsultantHeading: 'Medical Governance Active',
        roomConsultantDesc: 'Privileged workspace environment authorized for writing diagnostic reports, analyzing electronic health charts (EHR), and coordinating team decisions.',
        roomDoctorTitle: 'Nursing Operations Bay',
        roomDoctorHeading: 'Patient Care Monitor',
        roomDoctorDesc: 'Authorized telemetry operational panel for real-time validation of patient vitals logs, physiological changes tracking, and logging active treatment courses.',
        roomPharmacistTitle: 'Pharmacy Verification Terminal',
        roomPharmacistHeading: 'Secure Dispensary Matrix',
        roomPharmacistDesc: 'Cryptographic validation center for scanning approved physician digital signatures, managing asset distribution loops, and evaluating formulation cross-conflicts.',
        roomLocalTitle: 'Public Insights & General Terminal',
        roomLocalHeading: 'General Information Node Active',
        roomLocalDesc: 'Welcome to the restricted public tier of CareShield. Your current clearance level limits your operational view to non-PHI compliance metrics and baseline system infrastructure parameters.',
        modalConfigTitle: 'Account Configuration',
        modalConfigSubtitle: 'Modify security parameters dynamically',
        labelFullName: 'Full Name (Read-Only Matrix)',
        labelEmail: 'Core Network Email Address',
        labelPassword: 'New Alpha-Numeric Secret Password',
        btnCommitChanges: 'Commit Changes To Node',
        welcomeSub: 'Secure Node Session Initialized',
        btnAccessDashboard: 'Access Dashboard',
        btnExit: 'Exit',
        contrastText: 'High Contrast'
    },
    ar: {
        brandTitle: 'درع<span class="silver-tint">الرعاية</span>',
        brandSubtitle: 'التحكم الآمن في العقدة',
        menuAdminAccounts: 'إدارة حسابات الموظفين',
        menuAdminSettings: 'التغذية الراجعة والمشكلات الحرجة',
        menuAdminLogs: 'أرشيف مراقبة النظام الكامل المتكامل',
        menuAdminAi: 'محرك الذكاء الاصطناعي',
        menuLocal: 'طبقة الرؤى المحلية',
        menuConsultant: 'قائمة المستشارين',
        menuDoctor: 'قائمة الممرضين',
        menuPharmacist: 'قائمة الصيادلة',
        menuAuditor: 'قائمة المدققين',
        identityManagementTitle: 'إدارة الهوية',
        accountConfigBtn: 'تكوين الحساب الشخصي',
        terminateSessionBtn: 'إنهاء الجلسة الآمنة',
        workspaceTitle: 'عمليات البيانات السريرية الفورية',
        workspaceDesc: 'نظام التحكم في الوصول المستند إلى الأدوار (طبقة فرض RBAC نشطة).',
        nodeStatusLabel: 'نواة Node.js:',
        nodeStatusValue: 'متصل',
        roomAdminTitle: 'مركز مسؤول الأمان والتحكم',
        roomAdminHeading: 'مرحباً بك مجدداً، مسؤول النظام',
        roomAdminDesc: 'استخدم الغلاف الإداري الموجود في القائمة الجانبية لبدء فحص نماذج الذكاء الاصطناعي، أو تعيين توكنات الوصول، أو تدقيق سجلات الأحداث.',
        roomConsultantTitle: 'قبو المستشار السريري',
        roomConsultantHeading: 'الحوكمة الطبية نشطة',
        roomConsultantDesc: 'بيئة عمل مميزة ومصرحة لكتابة التقارير التشخيصية، وتحليل السجلات الصحية الإلكترونية، وتنسيق قرارات الفريق الميداني.',
        roomDoctorTitle: 'جناح العمليات التمريضية',
        roomDoctorHeading: 'شاشة رعاية المرضى',
        roomDoctorDesc: 'لوحة تشغيل معتمدة للتحقق الفوري من العلامات الحيوية، ومتابعة التغيرات الفسيولوجية، وتوثيق الخطط العلاجية النشطة.',
        roomPharmacistTitle: 'محطة التحقق الصيدلاني',
        roomPharmacistHeading: 'مصفوفة صرف الأدوية الآمنة',
        roomPharmacistDesc: 'مركز التدقيق التشفيري لمسح التوقيعات الرقمية للأطباء، وإدارة دورات المخزون الدوائي، وتقييم تداخلات التركيبات.',
        roomLocalTitle: 'بوابة الرؤى المحلية والمحطة المحلية',
        roomLocalHeading: 'عقدة المعلومات المحلية نشطة',
        roomLocalDesc: 'مرحباً بك في الطبقة المحلية المقيدة لنظام CareShield. يحد مستوى تصريحك الحالي من صلاحياتك لتشمل مقاييس الامتثال المحلية ومؤشرات البنية التحتية فقط.',
        modalConfigTitle: 'إعدادات الحساب الشخصي',
        modalConfigSubtitle: 'تعديل المعلمات الأمنية ديناميكياً لتأمين العقدة',
        labelFullName: 'الاسم الكامل (مصفوفة محمية للقراءة فقط)',
        labelEmail: 'عنوان البريد الإلكتروني للشبكة الأساسية',
        labelPassword: 'كلمة المرور السرية الأبجدية الرقمية الجديدة',
        btnCommitChanges: 'تطبيق التغييرات وتحديث العقدة',
        welcomeSub: 'تم بدء جلسة العقدة المؤمنة بنجاح',
        btnAccessDashboard: 'لوحة التحكم',
        btnExit: 'خروج آمن',
        contrastText: 'التباين العالي'
    }
};

function updateLanguageDOM(lang) {
    const rootHtml = document.getElementById("rootHtml");
    if (rootHtml) {
        rootHtml.setAttribute("lang", lang);
        rootHtml.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    }

    document.querySelectorAll("[data-i18n]").forEach(elem => {
        const key = elem.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            elem.innerHTML = translations[lang][key];
        }
    });

    const displayLangLabel = document.getElementById("displayLangLabel");
    if (displayLangLabel) {
        displayLangLabel.textContent = lang === "en" ? "العربية" : "English";
    }

    const passField = document.getElementById("configFieldPassword");
    if (passField) {
        passField.placeholder = lang === "en" ?
            "Leave blank to maintain current hash integrity" :
            "اتركه فارغاً للحفاظ على سلامة الهاش الحالي";
    }

    const currentSession = sessionStorage.getItem("currentUser");
    if (currentSession) {
        const account = JSON.parse(currentSession);

        const displayRole = account.role ? account.role.charAt(0).toUpperCase() + account.role.slice(1).toLowerCase() : "Local";

        const userRoleElem = document.getElementById("sessionUserRole");
        if (userRoleElem) {
            userRoleElem.textContent = lang === "en" ?
                `Clearance Profile: ${displayRole}` :
                `ملف التصريح: ${displayRole}`;
        }

        const welcomeHeaderTitle = document.getElementById("welcomeHeaderTitle");
        if (welcomeHeaderTitle) {
            welcomeHeaderTitle.innerHTML = lang === "en" ?
                `Welcome, <span style="color: #00ff66; text-shadow: 0 0 10px rgba(0,255,102,0.3);">${account.name}</span>` :
                `مرحباً بك، <span style="color: #00ff66; text-shadow: 0 0 10px rgba(0,255,102,0.3);">${account.name}</span>`;
        }

        const welcomeModalDesc = document.getElementById("welcomeModalDesc");
        if (welcomeModalDesc) {
            const roleDescEn = {
                "Admin": "Root access granted. You can now manage User Accounts, adjust System Settings, monitor Security Logs, and interact with the AI Medical Core Module.",
                "Consultant": "Consultant Terminal initialized. Access to the clinical consulting room, patient medical charts, and the secure administrative feedback channel is active.",
                "Doctor": "Doctor Terminal active. You have operational access to the patient vitals tracking room and live telemetry logs.",
                "Pharmacist": "Pharmacist Terminal synchronized. Your access is calibrated for the medication ledgers and pharmacy inventory systems and AI Medical Core Module.",
                "Auditor": "Compliance Terminal initialized. Your session is dedicated exclusively to the system Auditor management matrix.",
                "Local": "Local Insights Layer active. Your session is restricted to viewing baseline system parameters and local network node metrics.",
                "Public": "Local Insights Layer active. Your session is restricted to viewing baseline system parameters and local network node metrics."
            };

            const roleDescAr = {
                "Admin": "تم منح صلاحية الوصول الكاملة (Root). يمكنك الآن إدارة حسابات المستخدمين، وضبط إعدادات النظام، ومراقبة سجلات الأمان، والتفاعل مع وحدة الذكاء الاصطناعي الطبية الأساسية.",
                "Consultant": "تم تشغيل محطة المستشار. صلاحية الوصول إلى غرفة الاستشارات السريرية والملفات الطبية للمرضى بالإضافة إلى قناة المحادثة والمشكلات الحرجة نشطة الآن.",
                "Doctor": "محطة الممرض نشطة. لديك صلاحية تشغيلية للوصول إلى غرفة تتبع العلامات الحيوية للمرضى وسجلات القياس عن بُعد المباشرة.",
                "Pharmacist": "تم مزامنة محطة الصيدلي. تم معايرة صلاحية وصولك لدفاتر الأدوية وأنظمة مخزون الصيدلية ووحدة الذكاء الاصطناعي الطبية الأساسية.",
                "Auditor": "تم تشغيل محطة الامتثال. تم تخصيص جلستك حصرياً للوحة تحكم مصفوفة تدقيق النظام العامة.",
                "Local": "طبقة الرؤى المحلية نشطة. جلستك مقيدة بعرض معلمات النظام الأساسية ومؤشرات البنية التحتية المحلية للعقدة فقط.",
                "Public": "طبقة الرؤى المحلية نشطة. جلستك مقيدة بعرض معلمات النظام الأساسية ومؤشرات البنية التحتية المحلية للعقدة فقط."
            };

            const descSource = lang === "en" ? roleDescEn : roleDescAr;
            welcomeModalDesc.textContent = descSource[displayRole] || (lang === "en" ? "Secure terminal session established." : "تم إنشاء جلسة طرفية آمنة.");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const currentSession = sessionStorage.getItem("currentUser");

    if (!currentSession) {
        alert("Access Denied. Please authenticate via the security login portal first.");
        window.location.href = "login.html";
        return;
    }

    const account = JSON.parse(currentSession);
    document.getElementById("sessionUserName").textContent = account.name;

    const clearanceBadge = document.getElementById("sessionClearanceLevel");
    if (clearanceBadge) {
        clearanceBadge.textContent = account.clearance || "LVL-0";
    }

    const feedbackBadgeElement = document.getElementById("feedbackBadge");
    const sidebarFeedbackMenu = document.getElementById("menu-admin-settings");

    function clearNotificationBadge(maxId) {
        if (maxId !== undefined) {
            localStorage.setItem(`lastSeenMessageId_${account.email}`, maxId);
        }
        if (feedbackBadgeElement) {
            feedbackBadgeElement.style.display = "none";
            feedbackBadgeElement.textContent = "0";
        }
    }

    if (account && (account.role && (account.role.toLowerCase() === 'admin' || account.role.toLowerCase() === 'consultant'))) {
        if (!localStorage.getItem(`lastSeenMessageId_${account.email}`)) {
            fetch('/api/compliance/messages')
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.messages.length > 0) {
                        const maxId = Math.max(...data.messages.map(m => m.id));
                        localStorage.setItem(`lastSeenMessageId_${account.email}`, maxId);
                    } else {
                        localStorage.setItem(`lastSeenMessageId_${account.email}`, '0');
                    }
                }).catch(err => console.error("Error registering initial message token:", err));
        }
    }

    if (sidebarFeedbackMenu) {
        sidebarFeedbackMenu.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveViewportSegments();
            document.getElementById("room-admin-feedback-view").style.display = "block";
            fetchAndRenderComplianceMessages();

            fetch('/api/compliance/messages')
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.messages.length > 0) {
                        const maxId = Math.max(...data.messages.map(m => m.id));
                        clearNotificationBadge(maxId);
                    } else {
                        clearNotificationBadge(0);
                    }
                }).catch(err => console.error(err));
        });
    }

    if (account && (account.role && (account.role.toLowerCase() === 'admin' || account.role.toLowerCase() === 'consultant'))) {
        setInterval(async() => {
            try {
                const feedbackRoom = document.getElementById("room-admin-feedback-view");
                const isRoomOpen = feedbackRoom && feedbackRoom.style.display === "block";
                const lastSeenId = parseInt(localStorage.getItem(`lastSeenMessageId_${account.email}`) || 0);

                const response = await fetch(`/api/compliance/messages/unread?last_id=${lastSeenId}&email=${account.email}&role=${account.role}`);
                const data = await response.json();

                if (data.success) {
                    if (isRoomOpen) {
                        fetchAndRenderComplianceMessages();
                    } else {
                        if (data.unreadCount > 0 && feedbackBadgeElement) {
                            feedbackBadgeElement.textContent = data.unreadCount;
                            feedbackBadgeElement.style.display = "flex";
                        } else if (feedbackBadgeElement) {
                            feedbackBadgeElement.style.display = "none";
                        }
                    }
                }
            } catch (err) {
                console.error("Polling synchronization link failure:", err);
            }
        }, 3000);
    }



    let currentLang = localStorage.getItem("dashboardLang") || "en";
    updateLanguageDOM(currentLang);

    const languageToggleBtn = document.getElementById("languageToggleBtn");
    if (languageToggleBtn) {
        languageToggleBtn.addEventListener("click", () => {
            currentLang = currentLang === "en" ? "ar" : "en";
            localStorage.setItem("dashboardLang", currentLang);
            updateLanguageDOM(currentLang);
        });
    }

    let highContrastActive = localStorage.getItem("highContrastMode") === "true";
    if (highContrastActive) {
        document.documentElement.classList.add("high-contrast-mode");
    }

    const highContrastToggleBtn = document.getElementById("highContrastToggleBtn");
    if (highContrastToggleBtn) {
        highContrastToggleBtn.addEventListener("click", () => {
            highContrastActive = !highContrastActive;
            localStorage.setItem("highContrastMode", highContrastActive);
            if (highContrastActive) {
                document.documentElement.classList.add("high-contrast-mode");
            } else {
                document.documentElement.classList.remove("high-contrast-mode");
            }
        });
    }

    enforceStrictRoleMenus(account.role);

    const globalLogoutAction = () => {
        sessionStorage.clear();
        window.location.href = "login.html";
    };

    document.getElementById("systemLogoutBtn").addEventListener("click", (e) => {
        e.preventDefault();
        globalLogoutAction();
    });

    const welcomeOverlay = document.getElementById("welcomeSystemOverlay");
    const closeWelcomeBtn = document.getElementById("closeWelcomeModalBtn");
    const welcomeLogoutBtn = document.getElementById("welcomeLogoutBtn");

    if (!sessionStorage.getItem("welcomeInterfaceShown")) {
        if (welcomeOverlay) {
            welcomeOverlay.style.display = "flex";
        }
        sessionStorage.setItem("welcomeInterfaceShown", "true");
    }

    if (closeWelcomeBtn) {
        closeWelcomeBtn.addEventListener("click", () => {
            welcomeOverlay.style.display = "none";
        });
    }

    if (welcomeLogoutBtn) {
        welcomeLogoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            globalLogoutAction();
        });
    }


    const overlay = document.getElementById("accountConfigOverlay");
    const openBtn = document.getElementById("triggerAccountConfigBtn");
    const closeBtn = document.getElementById("closeConfigModalBtn");
    const configForm = document.getElementById("accountConfigSystemForm");
    const feedbackLog = document.getElementById("configFormStatusFeedback");

    if (openBtn) {
        openBtn.addEventListener("click", (e) => {
            e.preventDefault();
            feedbackLog.className = "modal-terminal-log";
            feedbackLog.style.display = "none";
            document.getElementById("configFieldPassword").value = "";

            const latestSessionData = JSON.parse(sessionStorage.getItem("currentUser"));
            document.getElementById("configFieldFullName").value = latestSessionData.name;
            document.getElementById("configFieldEmail").value = latestSessionData.email;

            overlay.style.display = "flex";
        });
    }

    if (closeBtn) closeBtn.addEventListener("click", () => { overlay.style.display = "none"; });
    if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.style.display = "none"; });

    if (configForm) {
        configForm.addEventListener("submit", async(e) => {
            e.preventDefault();
            feedbackLog.style.display = "none";
            feedbackLog.className = "modal-terminal-log";

            const activeUserToken = JSON.parse(sessionStorage.getItem("currentUser"));
            const submittedEmail = document.getElementById("configFieldEmail").value.trim();
            const submittedPassword = document.getElementById("configFieldPassword").value;

            try {
                const response = await fetch('/api/update-account', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        currentEmail: activeUserToken.email,
                        newEmail: submittedEmail,
                        newPassword: submittedPassword
                    })
                });

                const data = await response.json();

                if (data.success) {
                    feedbackLog.textContent = data.message;
                    feedbackLog.classList.add("success");
                    activeUserToken.email = data.updatedEmail;
                    sessionStorage.setItem("currentUser", JSON.stringify(activeUserToken));

                    setTimeout(() => { overlay.style.display = "none"; }, 1200);
                } else {
                    feedbackLog.textContent = data.message;
                    feedbackLog.classList.add("error");
                }
            } catch (error) {
                feedbackLog.textContent = "Critical communication network error.";
                feedbackLog.classList.add("error");
            }
        });
    }

    // ==========================================================================
    // 🔐🆕 ENGINE: معالج تسجيل الحساب الأمني الجديد
    // ==========================================================================
    const registerForm = document.getElementById("registerGateForm");
    const registerOverlay = document.getElementById("registerModalOverlay");
    const closeRegisterBtn = document.getElementById("modalCloseBtn");

    if (closeRegisterBtn && registerOverlay) {
        closeRegisterBtn.addEventListener("click", () => {
            registerOverlay.style.display = "none";
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async(e) => {
            e.preventDefault();

            const submittedName = document.getElementById("regFullName").value.trim();
            const submittedEmail = document.getElementById("regEmail").value.trim();
            const submittedPassword = document.getElementById("regPassword").value;
            const submitButton = document.getElementById("btnRegisterSubmit");

            try {
                if (submitButton) submitButton.disabled = true;

                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: submittedName,
                        email: submittedEmail,
                        password: submittedPassword
                    })
                });

                const data = await response.json();

                if (data.success) {
                    alert(currentLang === "en" ? data.message : "تم مزامنة وتوثيق سجل الحساب بنجاح بمستوى Local.");
                    registerForm.reset();
                    if (registerOverlay) registerOverlay.style.display = "none";
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Critical identity node insertion error:", error);
                alert(currentLang === "en" ? "Critical core pipeline failure during registration." : "فشل حرج في خط أنابيب الاتصال أثناء تسجيل العقدة.");
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    }



    const menuAdminLogsBtn = document.getElementById("menu-admin-logs");
    if (menuAdminLogsBtn) {
        menuAdminLogsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetActiveViewportSegments();
            document.getElementById("room-admin-logs-view").style.display = "block";
            fetchAndRenderSystemLogs();
        });
    }

    const clearLogsActionBtn = document.getElementById("clearLogsActionBtn");
    if (clearLogsActionBtn) {
        clearLogsActionBtn.addEventListener("click", async() => {
            if (!confirm("Are you absolutely sure you want to permanently purge all security and action audit logs?")) return;
            try {
                const response = await fetch('/api/admin/logs/clear', { method: 'POST' });
                const data = await response.json();
                if (data.success) {
                    fetchAndRenderSystemLogs();
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error("Failed to clear logs registry", err);
            }
        });
    }

    const dispatchComplianceMessageBtn = document.getElementById("dispatchComplianceMessageBtn");
    if (dispatchComplianceMessageBtn) {
        dispatchComplianceMessageBtn.addEventListener("click", async() => {
            const inputField = document.getElementById("complianceMessagePayloadInput");
            const messageText = inputField.value.trim();
            if (!messageText) return;

            try {
                const response = await fetch('/api/compliance/messages/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: account.email,
                        name: account.name,
                        role: account.role,
                        message: messageText
                    })
                });
                const data = await response.json();
                if (data.success) {
                    inputField.value = "";
                    fetchAndRenderComplianceMessages();
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error("Error sending compliance node statement", err);
            }
        });
    }
});

function resetActiveViewportSegments() {
    const segments = document.querySelectorAll(".rbac-room-segment");
    segments.forEach(el => el.style.display = "none");
}

async function fetchAndRenderSystemLogs() {
    const tableBody = document.getElementById("liveLogsRegistryTable");
    if (!tableBody) return;

    try {
        const response = await fetch('/api/admin/logs');
        const data = await response.json();

        if (data.success) {
            tableBody.innerHTML = "";
            if (data.logs.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted-gray);">No operations or logging data stored inside the archive layer matrix.</td></tr>`;
                return;
            }
            data.logs.forEach(log => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td style="padding: 12px; font-family: monospace;">${log.timestamp}</td>
                    <td style="padding: 12px; font-weight: 600;">${log.user_email}</td>
                    <td style="padding: 12px;">${log.action_performed}</td>
                    <td style="padding: 12px;"><span class="clearance-badge" style="padding: 4px 8px; font-size: 10px;">${log.role}</span></td>
                    <td style="padding: 12px; font-weight: bold; color: ${log.status === 'SUCCESS' || log.status === 'SUCCESSFUL' ? '#00ff66' : '#ff4a4a'}">${log.status}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (err) {
        console.error("Critical fault connecting with audit telemetry logs endpoint", err);
    }
}

async function fetchAndRenderComplianceMessages() {
    const chatBox = document.getElementById("complianceChatBoxEnclave");
    if (!chatBox) return;

    const sessionData = JSON.parse(sessionStorage.getItem("currentUser"));

    try {
        const response = await fetch('/api/compliance/messages');
        const data = await response.json();

        if (data.success) {
            chatBox.innerHTML = "";
            if (data.messages.length === 0) {
                chatBox.innerHTML = `<div style="text-align:center; color:var(--text-muted-gray); font-size:13px; padding-top:20px;">No critical or compliance feedback logs found. Workspace secure.</div>`;
                return;
            }

            const maxId = Math.max(...data.messages.map(m => m.id));
            localStorage.setItem(`lastSeenMessageId_${sessionData.email}`, maxId);

            data.messages.forEach(msg => {
                const bubble = document.createElement("div");
                const bubbleClass = msg.sender_role === 'Admin' ? 'admin-bubble' : 'consultant-bubble';

                bubble.className = `chat-bubble-node ${bubbleClass}`;
                bubble.innerHTML = `
                    <span class="msg-signature">${msg.sender_name} (${msg.sender_role})</span>
                    <div>${msg.message}</div>
                    <span class="msg-timestamp">${msg.timestamp}</span>
                    <button class="msg-erase-trigger" onclick="purgeComplianceMessageNode(${msg.id})"><i class="fa-solid fa-trash-can"></i></button>
                `;
                chatBox.appendChild(bubble);
            });
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    } catch (err) {
        console.error("Failed to sync compliance chat engine stream", err);
    }
}

async function purgeComplianceMessageNode(id) {
    if (!confirm("Delete this statement permanently from secure ledger?")) return;
    try {
        const response = await fetch(`/api/compliance/messages/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
            fetchAndRenderComplianceMessages();
        }
    } catch (err) {
        console.error("purge request drop error", err);
    }
}

function enforceStrictRoleMenus(role) {
    const menuAdminAccounts = document.getElementById("menu-admin-accounts");
    const menuAdminSettings = document.getElementById("menu-admin-settings");
    const menuAdminLogs = document.getElementById("menu-admin-logs");
    const menuAdminAi = document.getElementById("menu-admin-ai");

    const menuConsultant = document.getElementById("menu-consultant");
    const menuDoctor = document.getElementById("menu-doctor");
    const menuPharmacist = document.getElementById("menu-pharmacist");
    const menuAuditor = document.getElementById("menu-auditor");
    const menuLocal = document.getElementById("menu-local");

    const allMenus = [
        menuAdminAccounts, menuAdminSettings, menuAdminLogs, menuAdminAi,
        menuConsultant, menuDoctor, menuPharmacist, menuAuditor, menuLocal
    ];

    allMenus.forEach(menu => { if (menu) menu.style.display = "none"; });

    const rooms = ["room-admin", "room-admin-logs-view", "room-admin-feedback-view", "room-consultant", "room-doctor", "room-Doctor", "room-pharmacist", "room-local"];
    rooms.forEach(id => {
        const roomEl = document.getElementById(id);
        if (roomEl) roomEl.style.display = "none";
    });

    const cleanRole = role ? role.trim().toLowerCase() : "";

    if (cleanRole === "admin") {
        if (menuAdminAccounts) menuAdminAccounts.style.display = "flex";
        if (menuAdminSettings) menuAdminSettings.style.display = "flex";
        if (menuAdminLogs) menuAdminLogs.style.display = "flex";
        if (menuAdminAi) menuAdminAi.style.display = "flex";
        const targetRoom = document.getElementById("room-admin");
        if (targetRoom) targetRoom.style.display = "block";
    } else if (cleanRole === "consultant") {
        if (menuAdminSettings) menuAdminSettings.style.display = "flex";
        const targetRoom = document.getElementById("room-consultant");
        if (targetRoom) targetRoom.style.display = "block";
    } else if (cleanRole === "pharmacist") {
        if (menuPharmacist) menuPharmacist.style.display = "flex";
        if (menuAdminAi) menuAdminAi.style.display = "flex";
        const targetRoom = document.getElementById("room-pharmacist");
        if (targetRoom) targetRoom.style.display = "block";
    } else if (cleanRole === "doctor") {
        if (menuDoctor) menuDoctor.style.display = "flex";
        const targetRoom = document.getElementById("room-doctor") || document.getElementById("room-Doctor");
        if (targetRoom) targetRoom.style.display = "block";
    } else if (cleanRole === "auditor") {
        if (menuAuditor) menuAuditor.style.display = "flex";
        resetActiveViewportSegments();
    } else if (cleanRole === "local" || cleanRole === "public") {
        if (menuLocal) menuLocal.style.display = "flex";
        const targetRoom = document.getElementById("room-local");
        if (targetRoom) targetRoom.style.display = "block";
    }
}