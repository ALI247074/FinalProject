document.addEventListener("DOMContentLoaded", () => {
    
    // 1. استرجاع الجلسة المؤمنة والتحقق من التوكنات
    const currentSession = sessionStorage.getItem("currentUser");

    if (!currentSession) {
        alert("Access Denied. Please authenticate via the security login portal first.");
        window.location.href = "login.html";
        return;
    }

    const account = JSON.parse(currentSession);

    // 2. حقن بيانات الهوية الحيوية داخل الكرت الجانبي المطور
    document.getElementById("sessionUserName").textContent = account.name;
    document.getElementById("sessionUserRole").textContent = `Clearance Profile: ${account.role}`;
    
    const clearanceBadge = document.getElementById("sessionClearanceLevel");
    if (clearanceBadge) {
        clearanceBadge.textContent = account.clearance || "LVL-0";
    }

    // 3. تشغيل جدار التحكم الديناميكي لعزل القوائم (RBAC Module)
    enforceStrictRoleMenus(account.role);

    // 4. 🛑 معالجة الخروج الآمن للزر السفلي والرجوع لبوابة الدخول
    const globalLogoutAction = () => {
        sessionStorage.clear();
        window.location.href = "login.html";
    };

    document.getElementById("systemLogoutBtn").addEventListener("click", (e) => {
        e.preventDefault();
        globalLogoutAction();
    });

    // 🌟 5. منطق الواجهة الترحيبية الفخمة والمخصصة ديناميكياً
    // 🌟 5. منطق الواجهة الترحيبية الفخمة والمخصصة ديناميكياً لكل صلاحية (Dynamic RBAC Welcome Text)
    const welcomeOverlay = document.getElementById("welcomeSystemOverlay");
    const closeWelcomeBtn = document.getElementById("closeWelcomeModalBtn");
    const welcomeLogoutBtn = document.getElementById("welcomeLogoutBtn");

    if (!sessionStorage.getItem("welcomeInterfaceShown")) {
        if (welcomeOverlay) {
            // أ. تفعيل التخصيص الديناميكي لاسم المستخدم
            const welcomeHeaderTitle = document.getElementById("welcomeHeaderTitle");
            if (welcomeHeaderTitle) {
                welcomeHeaderTitle.innerHTML = `Welcome, <span style="color: #00ff66; text-shadow: 0 0 10px rgba(0,255,102,0.3);">${account.name}</span>`;
            }

            // ب. مصفوفة النصوص التكتيكية المخصصة لكل حساب بناءً على دوره الأمني
            // جدار النصوص الترحيبية المبسط والمطابق تماماً لقوائم وغرف لوحة التحكم
            const roleDescriptions = {
                "Admin": "Root access granted. You can now manage User Accounts, adjust System Settings, monitor Security Logs, and interact with the AI Medical Core Module.",
                "Consultant": "Consultant Terminal initialized. Access to the clinical consulting room and patient medical charts is now active.",
                "Nurse": "Nurse Terminal active. You have operational access to the patient vitals tracking room and live telemetry logs.",
                "Pharmacist": "Pharmacist Terminal synchronized. Your access is calibrated for the medication ledgers and pharmacy inventory systems and  AI Medical Core Module.",
                "Auditor": "Compliance Terminal initialized. As authorized, your session is dedicated exclusively to the immutable system Audit Logs view.",
                "Local": "Public Insights Layer active. Your session is restricted to viewing baseline system parameters and general public statistics."
            };

            // ج. حقن النص المخصص للرتبة الحالية داخل الفقرة
            const welcomeModalDesc = document.getElementById("welcomeModalDesc");
            if (welcomeModalDesc) {
                // نأخذ النص المناسب لرتبة الحساب، وإذا لم يجدها يضع نصاً افتراضياً آمناً
                welcomeModalDesc.textContent = roleDescriptions[account.role] || "Secure terminal session established. Dynamic interface matrices have been calibrated according to your verified clearance profile tier.";
            }

            welcomeOverlay.style.display = "flex";
        }
        
        // تثبيت الإشارة لمنع تكرار ظهورها عند التنقل أو التحديث
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

    // ==========================================================================
    // 🎛️ SYSTEM CONTROLS FOR ACCOUNT CONFIGURATION MODAL
    // ==========================================================================
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
        configForm.addEventListener("submit", async (e) => {
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
});

// 🛡️ جدار التحكم المعزز لعزل الصلاحيات والتحكم برتبة Local
function enforceStrictRoleMenus(role) {
    const menuAdminAccounts = document.getElementById("menu-admin-accounts");
    const menuAdminSettings = document.getElementById("menu-admin-settings");
    const menuAdminLogs = document.getElementById("menu-admin-logs");
    const menuAdminAi = document.getElementById("menu-admin-ai");
    
    const menuConsultant = document.getElementById("menu-consultant");
    const menuNurse = document.getElementById("menu-nurse");
    const menuPharmacist = document.getElementById("menu-pharmacist");
    const menuAuditor = document.getElementById("menu-auditor");
    const menuLocal = document.getElementById("menu-local"); 

    const allMenus = [
        menuAdminAccounts, menuAdminSettings, menuAdminLogs, menuAdminAi,
        menuConsultant, menuNurse, menuPharmacist, menuAuditor, menuLocal
    ];
    
    allMenus.forEach(menu => { if (menu) menu.style.display = "none"; });

    // مصفوفة الغرف والأقسام الحساسة شاملة الغرفة العامة الجديدة
    const rooms = ["room-admin", "room-consultant", "room-nurse", "room-pharmacist", "room-local"];
    rooms.forEach(id => {
        const roomEl = document.getElementById(id);
        if (roomEl) roomEl.style.display = "none";
    });

    // شروط توزيع الصلاحيات الصارمة (RBAC Matrix)
    if (role === "Admin") {
        if (menuAdminAccounts) menuAdminAccounts.style.display = "flex";
        if (menuAdminSettings) menuAdminSettings.style.display = "flex";
        if (menuAdminLogs) menuAdminLogs.style.display = "flex";
        if (menuAdminAi) menuAdminAi.style.display = "flex";
        const targetRoom = document.getElementById("room-admin");
        if (targetRoom) targetRoom.style.display = "block";
    } 
    else if (role === "Consultant") {
        if (menuConsultant) menuConsultant.style.display = "flex";
        const targetRoom = document.getElementById("room-consultant");
        if (targetRoom) targetRoom.style.display = "block";
    } 
    else if (role === "Nurse") {
        if (menuNurse) menuNurse.style.display = "flex";
        const targetRoom = document.getElementById("room-nurse");
        if (targetRoom) targetRoom.style.display = "block";
    } 
    else if (role === "Pharmacist") {
        if (menuPharmacist) menuPharmacist.style.display = "flex";
        const targetRoom = document.getElementById("room-pharmacist");
        if (targetRoom) targetRoom.style.display = "block";
    }
    else if (role === "Auditor") {
        if (menuAuditor) menuAuditor.style.display = "flex";
    }
    // 🚀 التحكم الخاص بصلاحية حساب أحمد (Local) ليعزل تماماً عن الأقسام الطبية والأدمن
    else if (role === "Local") {
        if (menuLocal) menuLocal.style.display = "flex";
        const targetRoom = document.getElementById("room-local");
        if (targetRoom) targetRoom.style.display = "block";
    }
}