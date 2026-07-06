// 🌐 DICTIONARY LOCATIONS MATRIX (ARABIC / ENGLISH)
const dictionary = {
    en: {
        brandTitle: 'Care<span class="silver-tint">Shield</span>',
        brandSubtitle: 'Secured Node Control',
        menuDashboard: 'Main Terminal',
        menuAdminAccounts: 'Managing employee accounts',
        menuAdminAi: 'AI Engine',
        terminateSessionBtn: 'Terminate Session',
        pageTitle: 'Identity & Access Control Center',
        pageDesc: 'Establish cryptographic records, assign administrative roles, and enforce system wide account blocks.',
        contrastText: 'High Contrast',
        dbStatusLabel: 'DB Status:',
        dbStatusValue: 'Connected',
        tableSectionTitle: 'Active Institutional Credentials Matrix',
        tableSectionDesc: 'Live auditing panel displaying database records for security roles, clearance tiers, and access state.',
        btnAddUser: 'Provision New Account',
        thName: 'Full Name',
        thEmail: 'Email Address',
        thRole: 'Assigned Role',
        thClearance: 'Clearance Tier',
        thStatus: 'Session Status',
        thActions: 'Enforcement Actions',
        modalTitle: 'Provision New Account Identity',
        modalSubtitle: 'Inject verified personnel credentials into core database',
        labelName: 'Full Name',
        labelEmail: 'Secure Corporate Email',
        labelPassword: 'Initial Secret Password Hash',
        labelRole: 'System Role',
        labelClearance: 'Clearance Level',
        btnSubmitForm: 'Commit Identity To Server',
        statusActive: 'Active',
        statusBlocked: 'Blocked',
        btnBlock: 'Block',
        btnUnblock: 'Unblock',
        btnDelete: 'Purge Account' // New Security Action
    },
    ar: {
        brandTitle: 'درع<span class="silver-tint">الرعاية</span>',
        brandSubtitle: 'التحكم الآمن في العقدة',
        menuDashboard: 'المحطة الرئيسية',
        menuAdminAccounts: 'إدارة حسابات الموظفين',
        menuAdminAi: 'محرك الذكاء الاصطناعي',
        terminateSessionBtn: 'إنهاء الجلسة الآمنة',
        pageTitle: 'مركز التحكم في الهوية والوصول',
        pageDesc: 'إنشاء سجلات موثقة، تعيين الصلاحيات الإدارية، وفرض حظر فوري على الحسابات عبر الشبكة.',
        contrastText: 'التباين العالي',
        dbStatusLabel: 'حالة القاعدة:',
        dbStatusValue: 'متصلة',
        tableSectionTitle: 'مصفوفة وثائق الاعتماد المؤسسية النشطة',
        tableSectionDesc: 'لوحة تدقيق حية تعرض بيانات الخادم الحالية للصلاحيات، مستويات التصريح، وحالة الاتصال.',
        btnAddUser: 'إنشاء حساب موظف',
        thName: 'الاسم الكامل',
        thEmail: 'البريد الإلكتروني',
        thRole: 'الصلاحية المسندة',
        thClearance: 'مستوى التصريح',
        thStatus: 'حالة الحساب',
        thActions: 'إجراءات الفرض الأمني',
        modalTitle: 'توليد هوية مستخدم جديدة',
        modalSubtitle: 'ضخ بيانات الاعتماد للموظف الجديد داخل قاعدة البيانات المركزية',
        labelName: 'الاسم الكامل للموظف',
        labelEmail: 'البريد الإلكتروني المؤسسي الآمن',
        labelPassword: 'رمز المرور السري الأولي (Hash)',
        labelRole: 'صلاحية النظام التشغيلية',
        labelClearance: 'مستوى التصريح الأمني',
        btnSubmitForm: 'تأكيد الهوية وتحديث السيرفر',
        statusActive: 'نشط آمن',
        statusBlocked: 'محظور أمنياً',
        btnBlock: 'حظر الوصول',
        btnUnblock: 'إلغاء الحظر',
        btnDelete: 'حذف الحساب' // New Security Action
    }
};

// LANGUAGE MUTATION CORE RUNTIME
function applyLocalization(lang) {
    const rootHtml = document.getElementById("rootHtml");
    if (rootHtml) {
        rootHtml.setAttribute("lang", lang);
        rootHtml.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    }

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (dictionary[lang] && dictionary[lang][key]) {
            element.innerHTML = dictionary[lang][key];
        }
    });

    const displayLangLabel = document.getElementById("displayLangLabel");
    if (displayLangLabel) {
        displayLangLabel.textContent = lang === "en" ? "العربية" : "English";
    }

    const currentSession = sessionStorage.getItem("currentUser");
    if (currentSession) {
        const user = JSON.parse(currentSession);
        const roleLabel = document.getElementById("sessionUserRole");
        if (roleLabel) {
            roleLabel.textContent = lang === "en" ? `Clearance Profile: ${user.role}` : `ملف التصريح: ${user.role}`;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. SESSION GUARDFRAIL & ACCESS VALIDATION
    const currentSession = sessionStorage.getItem("currentUser");
    if (!currentSession) {
        alert("Critical Access Violation. Session validation failed. Redirecting to auth portal...");
        window.location.href = "error.html";
        return;
    }
    const activeAccount = JSON.parse(currentSession);

    if (activeAccount.role !== "Admin") {
        alert("Access Denied: Your profile tier does not possess the required management clearance.");
        window.location.href = "dashboard.html";
        return;
    }

    document.getElementById("sessionUserName").textContent = activeAccount.name;
    document.getElementById("sessionClearanceLevel").textContent = activeAccount.clearance || "TOP-SECRET";

    // 2. CONFIGURATION PERSISTENCE LIFECYCLE (LANG & CONTRAST)
    let systemLang = localStorage.getItem("dashboardLang") || "en";
    applyLocalization(systemLang);

    document.getElementById("languageToggleBtn").addEventListener("click", () => {
        systemLang = systemLang === "en" ? "ar" : "en";
        localStorage.setItem("dashboardLang", systemLang);
        applyLocalization(systemLang);
        executeFetchUserPipeline();
    });

    let isContrastActive = localStorage.getItem("highContrastMode") === "true";
    if (isContrastActive) document.documentElement.classList.add("high-contrast-mode");

    document.getElementById("highContrastToggleBtn").addEventListener("click", () => {
        isContrastActive = !isContrastActive;
        localStorage.setItem("highContrastMode", isContrastActive);
        document.documentElement.classList.toggle("high-contrast-mode", isContrastActive);
    });

    // 3. OVERLAY MODAL INTERACTION CORE
    const overlayModal = document.getElementById("addUserModalOverlay");
    const triggerOpenBtn = document.getElementById("triggerAddUserModalBtn");
    const closeBtn = document.getElementById("closeUserModalBtn");
    const configForm = document.getElementById("provisionNewUserForm");
    const feedbackField = document.getElementById("formExecutionStatusFeedback");

    triggerOpenBtn.addEventListener("click", () => {
        feedbackField.style.display = "none";
        feedbackField.className = "modal-terminal-log";
        configForm.reset();
        overlayModal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => overlayModal.style.display = "none");
    overlayModal.addEventListener("click", (e) => { if (e.target === overlayModal) overlayModal.style.display = "none"; });

    // 4. CORE POST PIPELINE: ADD USER TO BACKEND / DB
    configForm.addEventListener("submit", async(event) => {
        event.preventDefault();
        feedbackField.style.display = "none";
        feedbackField.className = "modal-terminal-log";

        const payload = {
            name: document.getElementById("inputFieldFormName").value.trim(),
            email: document.getElementById("inputFieldFormEmail").value.trim(),
            password: document.getElementById("inputFieldFormPassword").value,
            role: document.getElementById("selectFieldFormRole").value,
            clearance: document.getElementById("selectFieldFormClearance").value
        };

        try {
            const response = await fetch("/api/admin/users/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (response.ok && data.success) {
                feedbackField.textContent = systemLang === "en" ? "Identity records saved successfully inside DB." : "تم حفظ وثائق الهوية بنجاح داخل قاعدة البيانات.";
                feedbackField.classList.add("success");
                setTimeout(() => {
                    overlayModal.style.display = "none";
                    executeFetchUserPipeline();
                }, 1300);
            } else {
                feedbackField.textContent = data.message || "Failed to inject secure user entity.";
                feedbackField.classList.add("error");
            }
        } catch (err) {
            feedbackField.textContent = "Pipeline Error: Server failed to process response.";
            feedbackField.classList.add("error");
        }
    });

    document.getElementById("systemLogoutBtn").addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.clear();
        window.location.href = "login.html";
    });

    executeFetchUserPipeline();
});

// 6. ASYNC GET PIPELINE: RENDER DATA FROM DATABASE (UPDATED)
async function executeFetchUserPipeline() {
    const tableBody = document.getElementById("liveUsersTablePayload");
    if (!tableBody) return;

    const currentLang = localStorage.getItem("dashboardLang") || "en";

    try {
        const response = await fetch("/api/admin/users");
        const payloadData = await response.json();

        if (response.ok && payloadData.success) {
            tableBody.innerHTML = "";

            payloadData.users.forEach(user => {
                const accountIsBlocked = user.is_blocked === true;
                const evaluatedStatusText = accountIsBlocked ?
                    dictionary[currentLang].statusBlocked :
                    dictionary[currentLang].statusActive;

                // 🛡️ Front-end Guard Mechanism Check
                const isRootAdmin = user.name === "Ali Abdullah";

                const tableRow = document.createElement("tr");

                let actionsInterfaceHtml = "";
                if (isRootAdmin) {
                    // Lock editing capabilities for root entity visually
                    actionsInterfaceHtml = `
                        <span class="engine-status-tag" style="color: #ffffff; border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); font-weight: bold; font-size: 11px; display: inline-flex; justify-content: center; margin: 0 auto; padding: 6px 14px;">
                            <i class="fa-solid fa-shield-halved" style="color: #00ff66; margin-inline-end: 6px;"></i> Immutable Core
                        </span>
                    `;
                } else {
                    // Standard operations for other nodes (Block + Delete Action)
                    actionsInterfaceHtml = `
                        <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
                            <button onclick="commitStateMutationToggle('${user.id}', ${accountIsBlocked})" 
                                    class="control-action-btn" 
                                    style="background: ${accountIsBlocked ? 'rgba(0,255,102,0.06)' : 'rgba(255,74,74,0.06)'}; 
                                           color: ${accountIsBlocked ? '#00ff66' : '#ff4a4a'}; 
                                           border: 1px solid ${accountIsBlocked ? 'rgba(0,255,102,0.2)' : 'rgba(255,74,74,0.2)'}; 
                                           padding: 6px 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                <i class="fa-solid ${accountIsBlocked ? 'fa-unlock' : 'fa-ban'}"></i> 
                                ${accountIsBlocked ? dictionary[currentLang].btnUnblock : dictionary[currentLang].btnBlock}
                            </button>
                            <button onclick="commitUserDeletion('${user.id}', '${user.name}')" 
                                    class="control-action-btn" 
                                    style="background: rgba(255,74,74,0.15); 
                                           color: #ff4a4a; 
                                           border: 1px solid rgba(255,74,74,0.4); 
                                           padding: 6px 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                <i class="fa-solid fa-trash-can"></i> 
                                ${dictionary[currentLang].btnDelete}
                            </button>
                        </div>
                    `;
                }

                tableRow.innerHTML = `
                    <td style="font-weight: 600; color: #ffffff;">${user.name}</td>
                    <td style="font-family: monospace; color: var(--text-muted-gray);">${user.email}</td>
                    <td><span class="engine-status-tag" style="background: rgba(255,255,255,0.02); margin: 0;">${user.role}</span></td>
                    <td style="font-family: monospace; font-weight: 500;">${user.clearance || 'Level-1 (My PHI Telemetry Only)'}</td>
                    <td>
                        <span style="color: ${accountIsBlocked ? '#ff4a4a' : '#00ff66'}; font-weight: 700;">
                            <i class="fa-solid ${accountIsBlocked ? 'fa-user-lock' : 'fa-user-check'}"></i> ${evaluatedStatusText}
                        </span>
                    </td>
                    <td style="text-align: center;">
                        ${actionsInterfaceHtml}
                    </td>
                `;
                tableBody.appendChild(tableRow);
            });
        }
    } catch (networkError) {
        console.error("Failed to compile user registry:", networkError);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#ff4a4a; font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> Critical Communication Network Failure with Secure Node server.</td></tr>`;
    }
}

// 7. ASYNC POST PIPELINE: ENFORCE BLOCK / UNBLOCK STATE IN DATABASE
async function commitStateMutationToggle(targetUserId, accountIsCurrentlyBlocked) {
    const currentLang = localStorage.getItem("dashboardLang") || "en";
    const userPromptWarning = currentLang === "en" ?
        "Are you absolute certain you wish to change enforcement status for this entity record?" :
        "هل أنت متأكد تماماً من تغيير حالة الفرض الأمني لسجل هذا المستخدم؟";

    if (!confirm(userPromptWarning)) return;

    try {
        const response = await fetch("/api/admin/users/toggle-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: targetUserId, blockStatus: !accountIsCurrentlyBlocked })
        });
        const confirmationData = await response.json();

        if (response.ok && confirmationData.success) {
            executeFetchUserPipeline();
        } else {
            alert(confirmationData.message || "Security pipeline state synchronization failed.");
        }
    } catch (pipelineErr) {
        console.error("State modification pipeline aborted:", pipelineErr);
    }
}

// 8. 🔥 NEW ASYNC DELETE PIPELINE: PURGE USER RECORD FROM DATABASE
async function commitUserDeletion(targetUserId, targetUserName) {
    const currentLang = localStorage.getItem("dashboardLang") || "en";
    const deletePromptWarning = currentLang === "en" ?
        `CRITICAL ACTION: Are you completely certain you want to permanently delete account: [ ${targetUserName} ]? This cannot be undone.` :
        `إجراء أمني حرج: هل أنت متأكد تماماً من حذف حساب: [ ${targetUserName} ] بشكل نهائي من السيرفر؟ لا يمكن التراجع عن هذا الإجراء.`;

    if (!confirm(deletePromptWarning)) return;

    try {
        const response = await fetch(`/api/admin/users/${targetUserId}`, {
            method: "DELETE"
        });
        const confirmationData = await response.json();

        if (response.ok && confirmationData.success) {
            executeFetchUserPipeline(); // Hot Reload Table Data
        } else {
            alert(confirmationData.message || "Security purge mutation rejected by backend.");
        }
    } catch (pipelineErr) {
        console.error("Purge network transaction aborted:", pipelineErr);
    }
}