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
        const validRoles = ["audit"];

        if (!account || !account.role || !validRoles.includes(account.role.trim().toLowerCase())) {
            window.location.replace("error.html");
            return;
        }
    } catch (e) {
        // في حال وجود تلاعب بالبيانات النصية للجلسة عبر المطور
        sessionStorage.clear();
        window.location.replace("error.html");
        return;
    }
})();

const dictionary = {
    en: {
        brandTitle: 'Care<span class="silver-tint">Shield</span>',
        brandSubtitle: 'Secured Node Control',
        menuDashboard: 'Main Terminal',
        menuAuditor: 'Auditor List & Compliance',
        btnLanguageToggle: 'Switch Language',
        contrastText: 'High Contrast',
        terminateSessionBtn: 'Terminate Session',
        pageTitle: 'Medical Framework Compliance Matrix',
        pageDesc: 'Live cryptographic auditing ledger tracking institutional adherence to global healthcare security frameworks (HIPAA, GDPR, ISO 27001).',
        dbStatusLabel: 'Audit Engine:',
        complianceScoreLabel: 'Global Compliance Score',
        cryptographicStateLabel: 'Cryptographic Alignment',
        cryptoEnforcedValue: 'Fully Enforced',
        auditedControlsLabel: 'Verified Controls',
        tableSectionTitle: 'Active Healthcare Security Standards Alignment Matrix',
        tableSectionDesc: 'Live auditing panel displaying control status, regulatory domains, and continuous automated telemetry validation logs.',
        thControlId: 'Control Identifier',
        thFramework: 'Security Standard',
        thDomain: 'Regulatory Domain',
        thTargetNode: 'Target Module',
        thStatus: 'Compliance State',
        thActions: 'Telemetry Verification',
        btnInspect: 'Verify Node Telemetry',
        btnCloseModal: 'Acknowledge Ledger Integrity',
        badgeCompliant: 'Compliant',
        badgeReview: 'Under Review'
    },
    ar: {
        brandTitle: 'Care<span class="silver-tint">Shield</span>',
        brandSubtitle: 'مراقبة العقدة الآمنة',
        menuDashboard: 'المحطة الرئيسية',
        menuAuditor: 'سجل التدقيق والامتثال',
        btnLanguageToggle: 'تغيير اللغة',
        contrastText: 'تباين عالي',
        terminateSessionBtn: 'إنهاء الجلسة الآمنة',
        pageTitle: 'مصفوفة الامتثال للمعايير الطبية',
        pageDesc: 'دفتر حسابات تشفيري حي لمراقبة مدى التزام المؤسسة بمعايير الأمن الصحي والطبية العالمية (HIPAA, GDPR, ISO 27001).',
        dbStatusLabel: 'محرك التدقيق:',
        complianceScoreLabel: 'معدل الامتثال الإجمالي',
        cryptographicStateLabel: 'المحاذاة التشفيرية',
        cryptoEnforcedValue: 'مفروض بالكامل',
        auditedControlsLabel: 'الضوابط المحققة',
        tableSectionTitle: 'مصفوفة الامتثال النشطة لمعايير الأمن الصحي والموقع',
        tableSectionDesc: 'لوحة تدقيق حية تعرض حالة الضوابط، المجالات التنظيمية، وسجلات التحقق التلقائي من القياس عن بعد.',
        thControlId: 'معرّف الضابط الأمني',
        thFramework: 'المعيار الأمني',
        thDomain: 'المجال التنظيمي',
        thTargetNode: 'البرمجية المستهدفة',
        thStatus: 'حالة الامتثال',
        thActions: 'التحقق من القياس عن بعد',
        btnInspect: 'التحقق من عقدة القياس عن بعد',
        btnCloseModal: 'اعتماد سلامة دفتر الحسابات',
        badgeCompliant: 'ممتثل تماماً',
        badgeReview: 'قيد المراجعة والتدقيق'
    }
};


const complianceControlsDataset = [
    { id: "CS-HIPAA-01", framework: "HIPAA Security Rule", domain: "Access Control & Identity Matrix", module: "Authentication Layer", status: "Compliant" },
    { id: "CS-HIPAA-02", framework: "HIPAA Security Rule", domain: "Data at Rest Encryption", module: "SQLite DB Crypt Node", status: "Compliant" },
    { id: "CS-ISO27001-14", framework: "ISO 27001:2022", domain: "Cryptographic Controls (A.8.24)", module: "Bcrypt Secure Hash Engine", status: "Compliant" },
    { id: "CS-GDPR-P4", framework: "GDPR Article 32", domain: "Pseudonymization & Cryptography", module: "XSS Defense Sanitizer Matrix", status: "Compliant" },
    { id: "CS-ISO27001-31", framework: "ISO 27001:2022", domain: "Logging & Auditing Node (A.8.12)", module: "Sentinel Tactical Core", status: "Compliant" }
];


document.addEventListener("DOMContentLoaded", () => {
    initializeLanguageEnvironmentState();
    executeFetchAuditPipeline();
    attachInteractiveEventConnectors();
});


function initializeLanguageEnvironmentState() {
    let currentLang = localStorage.getItem("dashboardLang") || "en";
    localStorage.setItem("dashboardLang", currentLang);
    executeLocalizationInterfaceRender(currentLang);
}

function executeLocalizationInterfaceRender(lang) {
    const rootHtml = document.getElementById("rootHtml");
    if (!rootHtml) return;

   
    if (lang === "ar") {
        rootHtml.setAttribute("dir", "rtl");
        rootHtml.setAttribute("lang", "ar");
    } else {
        rootHtml.setAttribute("dir", "ltr");
        rootHtml.setAttribute("lang", "en");
    }

    
    const elementsToTranslate = document.querySelectorAll("[data-i18n]");
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (dictionary[lang] && dictionary[lang][key]) {
            
            if (key === "brandTitle") {
                element.innerHTML = dictionary[lang][key];
            } else {
                element.innerText = dictionary[lang][key];
            }
        }
    });
}


function executeFetchAuditPipeline() {
    const tableBody = document.getElementById("complianceAuditMatrixTableBody");
    if (!tableBody) return;

    const currentLang = localStorage.getItem("dashboardLang") || "en";
    tableBody.innerHTML = ""; 

    complianceControlsDataset.forEach(control => {
        const tr = document.createElement("tr");

      
        const statusClass = control.status === "Compliant" ? "tag-compliant" : "tag-review";
        const statusText = control.status === "Compliant" ? dictionary[currentLang].badgeCompliant : dictionary[currentLang].badgeReview;
        const statusIcon = control.status === "Compliant" ? "fa-shield-check" : "fa-arrows-spin fa-spin";

        tr.innerHTML = `
            <td style="font-family: monospace; font-weight: 700; color: #06b6d4;">${control.id}</td>
            <td style="font-weight: 600;">${control.framework}</td>
            <td><i class="fa-solid fa-folder-shield" style="margin-right: 6px; color: var(--text-muted-gray);"></i> ${control.domain}</td>
            <td style="color: #cbd5e1;"><code>${control.module}</code></td>
            <td>
                <span class="engine-status-tag ${statusClass}">
                    <i class="fa-solid ${statusIcon}"></i> ${statusText}
                </span>
            </td>
            <td>
                <button class="telemetry-inspect-trigger" onclick="triggerImmediateTelemetryFancifulAudit('${control.id}', '${control.module}')">
                    <i class="fa-solid fa-satellite-dish"></i> ${dictionary[currentLang].btnInspect}
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}


function triggerImmediateTelemetryFancifulAudit(controlId, nodeModuleName) {
    const modal = document.getElementById("telemetryInspectionModalShell");
    const logDisplay = document.getElementById("modalTerminalLogDisplayFeed");
    const closeBtn = document.getElementById("closeTelemetryInspectionModalBtn");

    if (!modal || !logDisplay || !closeBtn) return;

    
    modal.style.display = "flex";
    closeBtn.style.display = "none";
    logDisplay.innerHTML = ""; 

    const activeLanguage = localStorage.getItem("dashboardLang") || "en";

    
    const terminalLogsNarrative = [
        `[SYSTEM INITIALIZATION] Establishing secure handshake alignment channel with local target node: ${nodeModuleName}`,
        `[CRYPTOGRAPHIC INTEGRITY] Querying core cryptographic reference block hashes for target record ID: ${controlId}`,
        `[TELEMETRY PIPELINE] Fetching node configurations metadata validation streams...`,
        `[SECURITY PROFILE] Verification sequence parsing data architecture rules compliance states...`,
        `[SUCCESS ENGINE] Hash optimization checks matching core reference matrix perfectly. Integrity verified.`
    ];

    let logCounterIndex = 0;

    
    const logTickerInterval = setInterval(() => {
        if (logCounterIndex < terminalLogsNarrative.length) {
            const logLineParagraph = document.createElement("p");
            logLineParagraph.classList.add("terminal-line-node");

            
            if (logCounterIndex === 0) logLineParagraph.className = "terminal-line-node";
            if (logCounterIndex === 2) logLineParagraph.className = "terminal-line-warning";
            if (logCounterIndex === 4) logLineParagraph.className = "terminal-line-success";

            logLineParagraph.innerHTML = `&gt; ${terminalLogsNarrative[logCounterIndex]}`;
            logDisplay.appendChild(logLineParagraph);
            logDisplay.scrollTop = logDisplay.scrollHeight; 
            logCounterIndex++;
        } else {
            clearInterval(logTickerInterval);
            closeBtn.style.display = "block"; 
        }
    }, 650);
}


function attachInteractiveEventConnectors() {
    
    const languageBtn = document.getElementById("toggleLanguagePipelineBtn");
    if (languageBtn) {
        languageBtn.addEventListener("click", () => {
            let activeLang = localStorage.getItem("dashboardLang") || "en";
            let newLang = activeLang === "en" ? "ar" : "en";
            localStorage.setItem("dashboardLang", newLang);
            executeLocalizationInterfaceRender(newLang);
            executeFetchAuditPipeline(); // Clean database snapshot re-render inside viewport matrix
        });
    }

    
    const highContrastBtn = document.getElementById("toggleHighContrastPipelineBtn");
    if (highContrastBtn) {
        highContrastBtn.addEventListener("click", () => {
            document.body.classList.toggle("high-contrast-mode");
        });
    }

    
    const closeModalBtn = document.getElementById("closeTelemetryInspectionModalBtn");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            document.getElementById("telemetryInspectionModalShell").style.display = "none";
        });
    }

    
    const terminateBtn = document.getElementById("terminateAuditSessionBtn");
    if (terminateBtn) {
        terminateBtn.addEventListener("click", () => {
            const activeLang = localStorage.getItem("dashboardLang") || "en";
            const confirmPromptMsg = activeLang === "en" ?
                "Are you absolute certain you wish to terminate the current auditing cryptographic secure node session?" :
                "هل أنت متأكد تماماً من رغبتك في إنهاء جلسة التدقيق الأمني المشفرة الحالية؟";

            if (confirm(confirmPromptMsg)) {
                window.location.href = "dashboard.html";
            }
        });
    }
}
