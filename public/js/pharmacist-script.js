// 🌐 DICTIONARY LOCATIONS MATRIX (ARABIC / ENGLISH)
const dictionary = {
    en: {
        brandTitle: 'Care<span class="silver-tint">Shield</span>',
        brandSubtitle: 'Secured Node Control',
        menuDashboard: 'Main Terminal',
        menuPharmacist: 'Pharmacist List',
        terminateSessionBtn: 'Terminate Session',
        pageTitle: 'Pharmaceutical Database Node',
        pageDesc: 'Audit real-time drug inventories, record new medical compounds, and manage clinical drug storage matrices.',
        contrastText: 'High Contrast',
        dbStatusLabel: 'DB Status:',
        dbStatusValue: 'Connected',
        totalMedsLabel: 'Total Registered Drugs',
        lowStockLabel: 'Low Stock Warning',
        tableSectionTitle: 'Active Pharmaceutical Compound Matrix',
        tableSectionDesc: 'Live auditing panel displaying database records for active medications, chemical families, and exact units.',
        btnAddMed: 'Register New Drug',
        searchPlaceholder: 'Search by drug name or compound category...',
        thMedName: 'Medication Name',
        thCategory: 'Chemical Category',
        thStock: 'Available Stock',
        thExpiry: 'Expiration Date',
        thDesc: 'Description / Clinical Notes',
        thActions: 'Actions',
        modalTitle: 'Register New Pharmaceutical Record',
        modalSubtitle: 'Inject verified chemical compounds and inventory logs into core database',
        labelMedName: 'Medication Name',
        labelCategory: 'Chemical Family / Category',
        labelStock: 'Initial Unit Stock',
        labelExpiry: 'Expiration Date',
        labelDesc: 'Clinical Notes / Indications',
        btnSubmitForm: 'Commit Record To Server',
        deletePrompt: 'Are you sure you want to permanently purge this medical compound from core database?',
        deleteSuccess: 'Medical compound record successfully purged from database core.'
    },
    ar: {
        brandTitle: 'Care<span class="silver-tint">Shield</span>',
        brandSubtitle: 'تحكم العقدة الآمنة',
        menuDashboard: 'المحطة الرئيسية',
        menuPharmacist: 'قائمة الصيدلاني',
        terminateSessionBtn: 'إنهاء الجلسة التكتيكية',
        pageTitle: 'عقدة قاعدة بيانات الأدوية',
        pageDesc: 'تدقيق مخزون الأدوية في الوقت الفعلي، تسجيل المركبات الكيميائية الجديدة، وإدارة مصفوفات التخزين السريري.',
        contrastText: 'تباين عالي',
        dbStatusLabel: 'حالة القاعدة:',
        dbStatusValue: 'متصل آمن',
        totalMedsLabel: 'إجمالي الأدوية المسجلة',
        lowStockLabel: 'تحذير نقص المخزون',
        tableSectionTitle: 'مصفوفة المركبات الدوائية النشطة',
        tableSectionDesc: 'لوحة التدقيق الحي التي تعرض سجلات قاعدة البيانات للأدوية الفعالة، العائلات الكيميائية، والوحدات الدقيقة.',
        btnAddMed: 'تسجيل دواء جديد',
        searchPlaceholder: 'ابحث باسم الدواء أو العائلة الكيميائية...',
        thMedName: 'اسم الدواء السريري',
        thCategory: 'الفئة / العائلة الكيميائية',
        thStock: 'المخزون المتاح',
        thExpiry: 'تاريخ انتهاء الصلاحية',
        thDesc: 'ملاحظات ودواعي الاستعمال',
        thActions: 'الإجراءات والتحكم',
        modalTitle: 'تسجيل سجل دوائي جديد بقاعدة البيانات',
        modalSubtitle: 'حقن المركبات الكيميائية التي تم التحقق منها وسجلات الجرد في عقدة النظام',
        labelMedName: 'اسم الدواء العلمي/التجاري',
        labelCategory: 'الفئة أو العائلة الكيميائية',
        labelStock: 'مخزون الوحدات الأولي',
        labelExpiry: 'تاريخ الصلاحية والانتهاء',
        labelDesc: 'الملاحظات السريرية وموانع الاستعمال',
        btnSubmitForm: 'إدخال السجل وحقنه في السيرفر',
        deletePrompt: 'هل أنت متأكد من رغبتك في حذف هذا المركب الدوائي نهائياً وبشكل دائم من النواة؟',
        deleteSuccess: 'تم مسح وإسقاط السجل الدوائي بنجاح من قاعدة البيانات التكتيكية.'
    }
};

// State Variables Cached memory
let currentLanguage = localStorage.getItem("pharmacistLang") || "en";
let isHighContrastActive = localStorage.getItem("highContrastActive") === "true";
let fullMedicineCachedDataset = [];

document.addEventListener("DOMContentLoaded", () => {
    initializeInterfaceSettings();
    setupEventHandlers();
    executeFetchMedicinesPipeline();
});

// Sync Interface appearance language and contrast
function initializeInterfaceSettings() {
    if (isHighContrastActive) document.body.classList.add("high-contrast-mode");
    switchLanguagePipeline(currentLanguage);
}

function setupEventHandlers() {
    // Language Switchers
    document.getElementById("langSwitchArBtn").addEventListener("click", () => switchLanguagePipeline("ar"));
    document.getElementById("langSwitchEnBtn").addEventListener("click", () => switchLanguagePipeline("en"));

    // Contrast Toggle
    document.getElementById("highContrastToggleSwitch").addEventListener("click", toggleHighContrastStateMutation);

    // Modal Operations
    const modalShell = document.getElementById("provisionNewDrugModalShell");
    document.getElementById("openProvisioningModalTrigger").addEventListener("click", () => modalShell.style.display = "flex");
    document.getElementById("closeProvisioningModalTrigger").addEventListener("click", () => {
        modalShell.style.display = "none";
        document.getElementById("formExecutionStatusFeedback").style.display = "none";
    });

    // Form Submission Pipeline
    document.getElementById("provisionNewDrugSecureFormMatrix").addEventListener("submit", commitNewDrugToServerDatabase);

    // Live Instant Search Filter Input listener
    document.getElementById("drugDatabaseSearchField").addEventListener("input", performLiveDatasetClientFilter);

    // Logout Session Simulation
    document.getElementById("logoutActionTriggerBtn").addEventListener("click", () => {
        alert(currentLanguage === "en" ? "Terminating active secure node session..." : "جاري إنهاء جلسة الصيدلاني الآمنة وحماية النظام...");
        window.location.href = "dashboard.html";
    });
}

function switchLanguagePipeline(targetLang) {
    currentLanguage = targetLang;
    localStorage.setItem("pharmacistLang", targetLang);

    const rootHtml = document.getElementById("rootHtml");
    if (targetLang === "ar") {
        rootHtml.setAttribute("dir", "rtl");
        rootHtml.setAttribute("lang", "ar");
        document.getElementById("langSwitchArBtn").classList.add("active");
        document.getElementById("langSwitchEnBtn").classList.remove("active");
    } else {
        rootHtml.setAttribute("dir", "ltr");
        rootHtml.setAttribute("lang", "en");
        document.getElementById("langSwitchEnBtn").classList.add("active");
        document.getElementById("langSwitchArBtn").classList.remove("active");
    }

    // Map translations across attributes
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (dictionary[targetLang][key]) {
            element.innerHTML = dictionary[targetLang][key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (dictionary[targetLang][key]) {
            element.setAttribute("placeholder", dictionary[targetLang][key]);
        }
    });
}

function toggleHighContrastStateMutation() {
    isHighContrastActive = !isHighContrastActive;
    localStorage.setItem("highContrastActive", isHighContrastActive);
    document.body.classList.toggle("high-contrast-mode", isHighContrastActive);
}

// Fetch all medicines dynamically via safe node pipeline
async function executeFetchMedicinesPipeline() {
    try {
        const response = await fetch('/api/pharmacist/medicines');
        const data = await response.json();

        if (response.ok && data.success) {
            fullMedicineCachedDataset = data.medicines;
            renderMedicinesTableMatrix(fullMedicineCachedDataset);
            calculateAndInjectMetrics(fullMedicineCachedDataset);
        } else {
            console.error("Failed to read secure pharmaceutical logs.");
        }
    } catch (err) {
        console.error("Critical network breakdown calling pharmaceutical API node:", err);
    }
}

function renderMedicinesTableMatrix(dataset) {
    const tableBody = document.getElementById("pharmaceuticalCompoundsTableBodyNode");
    tableBody.innerHTML = "";

    if (dataset.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted-gray); font-weight:600;">No pharmaceutical compounds match active database filter.</td></tr>`;
        return;
    }

    dataset.forEach(med => {
        const row = document.createElement("tr");

        // Low Stock Highlight Logic
        const lowStockStyle = med.stock <= 10 ? 'style="color:#ff4a4a; font-weight:700;"' : '';

        row.innerHTML = `
            <td><code>#MED-${med.id}</code></td>
            <td><strong>${escapeHtml(med.name)}</strong></td>
            <td><span class="role-tag" style="color:#cbd5e1; border: 1px solid rgba(255,255,255,0.1); padding:4px 8px; border-radius:6px; background:rgba(0,0,0,0.1);">${escapeHtml(med.category)}</span></td>
            <td ${lowStockStyle}><i class="fa-solid fa-layer-group" style="margin-right:5px; font-size:11px;"></i> ${med.stock} units</td>
            <td><i class="fa-solid fa-clock-rotate-left" style="color:#ef4444; margin-right:4px;"></i> ${escapeHtml(med.expiry_date)}</td>
            <td style="color:var(--text-muted-gray); font-size:12px; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(med.description || '')}">${escapeHtml(med.description || 'N/A')}</td>
            <td>
                <button class="delete-action-btn" onclick="executeDeleteMedicinePipeline(${med.id})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ✨ [دالة جافا سكريبت الجديدة لإرسال حزمة إسقاط وحذف الدواء تزامناً مع السيرفر]
async function executeDeleteMedicinePipeline(medicineId) {
    const confirmationText = dictionary[currentLanguage].deletePrompt;
    if (!confirm(confirmationText)) return;

    try {
        const response = await fetch(`/api/pharmacist/medicines/${medicineId}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (response.ok && result.success) {
            alert(dictionary[currentLanguage].deleteSuccess);
            executeFetchMedicinesPipeline(); // تصفير البيانات وتحديث الشاشة فورياً
        } else {
            alert(result.message || "Failed to purge record from database registry.");
        }
    } catch (err) {
        console.error("Critical fault inside deletion pipeline:", err);
        alert("Critical network failure during pipeline execution.");
    }
}

// جعل الدالة متاحة للـ HTML من النطاق العالمي
window.executeDeleteMedicinePipeline = executeDeleteMedicinePipeline;

function calculateAndInjectMetrics(dataset) {
    document.getElementById("totalMedsCountField").innerText = dataset.length;
    const lowStockCount = dataset.filter(m => m.stock <= 10).length;
    document.getElementById("lowStockCountField").innerText = lowStockCount;
}

// Client Side Quick Instant Filtration Search Matrix
function performLiveDatasetClientFilter(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    if (!searchTerm) {
        renderMedicinesTableMatrix(fullMedicineCachedDataset);
        return;
    }

    const filtered = fullMedicineCachedDataset.filter(med =>
        med.name.toLowerCase().includes(searchTerm) ||
        med.category.toLowerCase().includes(searchTerm)
    );
    renderMedicinesTableMatrix(filtered);
}

// Commit payload database mutation to server backend
async function commitNewDrugToServerDatabase(event) {
    event.preventDefault();

    const feedbackNode = document.getElementById("formExecutionStatusFeedback");
    feedbackNode.style.display = "block";
    feedbackNode.style.background = "rgba(255,255,255,0.05)";
    feedbackNode.style.color = "#06b6d4";
    feedbackNode.innerText = currentLanguage === "en" ? "Transmitting cryptographic package..." : "جاري تشفير وتمرير الحزمة الدوائية للمصفوفة...";

    const payload = {
        name: document.getElementById("inputFieldFormMedName").value,
        category: document.getElementById("inputFieldFormCategory").value,
        stock: parseInt(document.getElementById("inputFieldFormStock").value),
        expiry_date: document.getElementById("inputFieldFormExpiry").value,
        description: document.getElementById("inputFieldFormDesc").value
    };

    try {
        const response = await fetch('/api/pharmacist/medicines/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (response.ok && result.success) {
            feedbackNode.style.background = "rgba(0, 255, 102, 0.1)";
            feedbackNode.style.color = "#00ff66";
            feedbackNode.innerText = currentLanguage === "en" ? "Compound record committed successfully!" : "تم حقن وتسجيل السجل الدوائي بنجاح في النواة!";

            document.getElementById("provisionNewDrugSecureFormMatrix").reset();
            executeFetchMedicinesPipeline(); // Real time data refresh

            setTimeout(() => {
                document.getElementById("provisionNewDrugModalShell").style.display = "none";
                feedbackNode.style.display = "none";
            }, 1500);
        } else {
            feedbackNode.style.background = "rgba(239, 68, 68, 0.1)";
            feedbackNode.style.color = "#ef4444";
            feedbackNode.innerText = result.message || "Database injection rejection.";
        }
    } catch (err) {
        feedbackNode.style.background = "rgba(239, 68, 68, 0.1)";
        feedbackNode.style.color = "#ef4444";
        feedbackNode.innerText = "Critical network pipeline error.";
    }
}

// HTML XSS defense sanitizer function
function escapeHtml(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}