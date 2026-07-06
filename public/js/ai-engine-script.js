//القسم الخاص بالحماية من محاولات الاختراق وتجاوز الجلسات للوصول لقوائم غير مصرح بالدخول لها
(function enforceImmediateAccessControl() {

    const currentSession = sessionStorage.getItem("currentUser");


    if (!currentSession) {

        window.location.replace("error.html");
        return;
    }

    try {

        const account = JSON.parse(currentSession);

        const validRoles = ["admin", "pharmacist"];

        if (!account || !account.role || !validRoles.includes(account.role.trim().toLowerCase())) {
            window.location.replace("error.html");
            return;
        }
    } catch (e) {
        // في حال وجود تلاعب بالبيانات النصية للجلسة 
        sessionStorage.clear();
        window.location.replace("error.html");
        return;
    }
})();


document.addEventListener("DOMContentLoaded", () => {


    // 1. (RBAC Validation) التحقق الصارم من جلسة المستخدم والصلاحيات 

    const currentSession = sessionStorage.getItem("currentUser");
    if (!currentSession) {
        window.location.href = "login.html";
        return;
    }
    const account = JSON.parse(currentSession);

    // حماية واجهة الذكاء الاصطناعي التكتيكية بناء على رتب الحسابات في الموقع
    if (account.role !== "Admin" && account.role !== "Consultant" && account.role !== "Pharmacist") {
        alert("Access Denied. Insufficient system clearance levels.");
        window.location.href = "dashboard.html";
        return;
    }

    //DOM  استدعاء جميع عناصر الـ 
    const uiReturnLink = document.getElementById("uiReturnLink");
    const uiHeaderTitle = document.getElementById("uiHeaderTitle");
    const uiLangToggleBtn = document.getElementById("uiLangToggleBtn");
    const uiLangToggleText = document.getElementById("uiLangToggleText");
    const uiBadgeStatus = document.getElementById("uiBadgeStatus");
    const uiChatTitle = document.getElementById("uiChatTitle");
    const uiChatDesc = document.getElementById("uiChatDesc");
    const uiReportTitle = document.getElementById("uiReportTitle");
    const uiReportDesc = document.getElementById("uiReportDesc");
    const uiDropZoneText = document.getElementById("uiDropZoneText");
    const uiDropZoneSub = document.getElementById("uiDropZoneSub");
    const uiDrugTitle = document.getElementById("uiDrugTitle");
    const uiDrugDesc = document.getElementById("uiDrugDesc");

    // استدعاء عناصر وضع التباين العالي الجديد للتحكم البرمجي المباشر
    const uiHighContrastBtn = document.getElementById("uiHighContrastBtn");
    const uiHighContrastText = document.getElementById("uiHighContrastText");

    const aiForm = document.getElementById("aiEngineInteractionForm");
    const aiInput = document.getElementById("aiConsoleInputPrompt");
    const aiDisplay = document.getElementById("aiChatConsoleDisplay");

    const dropZone = document.getElementById("fileDropZone");
    const fileInput = document.getElementById("clinicalFileInput");

    const drugAlpha = document.getElementById("drugInputAlpha");
    const drugBeta = document.getElementById("drugInputBeta");
    const checkMatrixBtn = document.getElementById("triggerDrugMatrixCheckBtn");
    const matrixFeedback = document.getElementById("drugMatrixFeedbackDisplay");

    let detectedDrugA = "";
    let detectedDrugB = "";
    let lastAnalysisReportText = "";


    // 2. (Localization Engine) إدارة اللغات المتقدمة والقاموس الديناميكي والخطوط 

    let currentLanguage = localStorage.getItem("careshield_lang") || "en";

    const localizationDictionary = {
        en: {
            dir: "ltr",
            fontFamily: "'Inter', sans-serif",
            toggleText: "العربية",
            contrastText: "High Contrast",
            returnLink: '<i class="fa-solid fa-arrow-left"></i> Return to Control Center',
            headerTitle: '<i class="fa-solid fa-microchip" style="margin-right: 6px;"></i> CareShield Unrestricted AI Analytics Terminal',
            badgeStatus: "SYSTEM STATUS: OPERATIONAL TIER-1",
            chatTitle: '<i class="fa-solid fa-comments"></i> Universal AI Consultation Console',
            chatDesc: "Submit any query—medical, security, software engineering, or technical analysis—directly to the core model.",
            chatPlaceholder: "Ask me anything (Medical diagnostics, logs, or general queries)...",
            systemGreeting: `<div style="background: rgba(255,255,255,0.02); padding: 14px; border-radius: 6px; border-left: 2px solid #ffffff; font-size: 13px; line-height: 1.6; color: #e4e4e7; text-align: left; direction: ltr;">
                                <strong style="color: #ffffff;">[CareShield CORE]:</strong> System initialized. Ready to process multi-domain requests and analytical inquiries.
                            </div>`,
            reportTitle: '<i class="fa-solid fa-file-import"></i> Clinical Report & Log Ingestion Node',
            reportDesc: "Upload raw reports or system logs (.txt, .log) to dynamically extract parameters.",
            dropZoneText: "Drag & Drop File Here",
            dropZoneSub: "Supports raw medical text and operational logs",
            drugTitle: '<i class="fa-solid fa-capsules"></i> Pharmacological Contraindication Checker',
            drugDesc: "Analyze drug matrix structures and automatically compile system log files.",
            drugAlphaPlaceholder: "Active Compound Alpha",
            drugBetaPlaceholder: "Active Compound Beta",
            checkBtnText: '<i class="fa-solid fa-file-export" style="margin-right: 5px;"></i> Run Matrix Check & Export Log',
            loadingMsg: "Consulting Gemini core neural layers...",
            readingFileMsg: "Parsing document blocks and extracting clinical data...",
            errorMsg: "Pipeline timeout. Unable to bridge connection to AI server.",
            fileFailTitle: "Data processing fault: Unrecognized layout.",
            serverError: "Internal system error occurred in the database network.",
            alertEmptyDrugs: "Parameters missing. Inject active compounds first.",
            checkingMatrix: "Querying active matrix databases and generating clinical log file...",
            matrixConflictTitle: "CONTRAINDICATION DETECTED:",
            matrixSafeTitle: "PHARMACOLOGICAL SAFETY APPROVED:"
        },
        ar: {
            dir: "rtl",
            fontFamily: "'Cairo', sans-serif",
            toggleText: "English",
            contrastText: "تباين عالي",
            returnLink: 'العودة إلى لوحة التحكم <i class="fa-solid fa-arrow-right"></i>',
            headerTitle: 'واجهة كير شيلد المتطورة للتحليل والذكاء الاصطناعي المفتوح <i class="fa-solid fa-microchip" style="margin-left: 6px;"></i>',
            badgeStatus: "حالة النظام: يعمل بكفاءة تامة TIER-1",
            chatTitle: 'منصة الاستعلامات والذكاء الاصطناعي الشامل <i class="fa-solid fa-comments"></i>',
            chatDesc: "اطرح أي سؤال—طبي، أمني، برمجيات، أو استشارات عامة—ليجيبك المحرك الشامل مباشرة وبدقة.",
            chatPlaceholder: "اسألني عن أي شيء (تشخيص طبي، برمجة, جدران حماية، أو نقاش عام)...",
            systemGreeting: `<div style="background: rgba(255,255,255,0.02); padding: 14px; border-radius: 6px; border-right: 2px solid #ffffff; font-size: 13px; line-height: 1.6; color: #e4e4e7; text-align: right; direction: rtl;">
                                <strong style="color: #ffffff;">[محرك صقر الشمال]:</strong> تم تفعيل النظام الشامل. مستعد لاستقبال وتحليل كافة الاستفسارات الطبية والفنية والبرمجية فوراً.
                            </div>`,
            reportTitle: 'وحدة استيراد ومعالجة التقارير والسجلات <i class="fa-solid fa-file-import"></i>',
            reportDesc: "ارفع الملفات الطبية والسجلات النصية للتحليل واستخراج محددات الحالة سريرياً.",
            dropZoneText: "اسحب وأفلت مستند التقرير أو السجل هنا",
            dropZoneSub: "يدعم السجلات الطبية الخام وملفات السجلات النصية .txt و .log",
            drugTitle: 'نظام فحص التداخلات الصيدلانية والموانع الدوائية <i class="fa-solid fa-capsules"></i>',
            drugDesc: "فحص التعارضات الطبية المعقدة للمركبات وبناء تقرير فني معزز للتنزيل بنظام التشغيل.",
            drugAlphaPlaceholder: "المركب الفعال Alpha",
            drugBetaPlaceholder: "المركب الفعال Beta",
            checkBtnText: 'تشغيل فحص المصفوفة وتصدير ملف التقرير <i class="fa-solid fa-file-export" style="margin-left: 5px;"></i>',
            loadingMsg: "جاري الاتصال بنواة جـيـمـيـنـاي لتوليد التحليل الشامل...",
            readingFileMsg: "جاري معالجة المستند واستخراج الركائز الدوائية الحيوية...",
            errorMsg: "فشلت خطوط الاتصال في الوصول إلى الخادم الرئيسي المساعد.",
            fileFailTitle: "خلل في معالجة البيانات: بنية المستند غير مدعومة.",
            serverError: "حدث خطأ غير متوقع في معالجة شبكة قاعدة البيانات.",
            alertEmptyDrugs: "المحددات ناقصة. يرجى إدخال المركبات أو استخراجها من ملف التقرير.",
            checkingMatrix: "جاري فحص قواعد التداخل الدوائي الفوري وصياغة ملف التحليل...",
            matrixConflictTitle: "تحذير: تم رصد تداخل دوائي سريري حاد:",
            matrixSafeTitle: "موافقة صيدلانية: فحص السلامة ممتثل وآمن:"
        }
    };

    function applyLanguage(lang) {
        const langData = localizationDictionary[lang];
        document.documentElement.dir = langData.dir;
        document.body.style.fontFamily = langData.fontFamily;

        if (uiLangToggleText) uiLangToggleText.textContent = langData.toggleText;
        if (uiHighContrastText) uiHighContrastText.textContent = langData.contrastText;
        if (uiReturnLink) uiReturnLink.innerHTML = langData.returnLink;
        if (uiHeaderTitle) uiHeaderTitle.innerHTML = langData.headerTitle;
        if (uiBadgeStatus) uiBadgeStatus.textContent = langData.badgeStatus;
        if (uiChatTitle) uiChatTitle.innerHTML = langData.chatTitle;
        if (uiChatDesc) uiChatDesc.textContent = langData.chatDesc;
        if (uiReportTitle) uiReportTitle.innerHTML = langData.reportTitle;
        if (uiReportDesc) uiReportDesc.textContent = langData.reportDesc;
        if (uiDropZoneText) uiDropZoneText.textContent = langData.dropZoneText;
        if (uiDropZoneSub) uiDropZoneSub.textContent = langData.dropZoneSub;
        if (uiDrugTitle) uiDrugTitle.innerHTML = langData.drugTitle;
        if (uiDrugDesc) uiDrugDesc.textContent = langData.drugDesc;

        if (aiInput) aiInput.placeholder = langData.chatPlaceholder;
        if (drugAlpha) drugAlpha.placeholder = langData.drugAlphaPlaceholder;
        if (drugBeta) drugBeta.placeholder = langData.drugBetaPlaceholder;
        if (checkMatrixBtn) checkMatrixBtn.innerHTML = langData.checkBtnText;

        if (aiDisplay) aiDisplay.innerHTML = langData.systemGreeting;
    }

    if (uiLangToggleBtn) {
        uiLangToggleBtn.addEventListener("click", () => {
            currentLanguage = (currentLanguage === "en") ? "ar" : "en";
            localStorage.setItem("careshield_lang", currentLanguage);
            applyLanguage(currentLanguage);
        });
    }

    // تهيئة اللغات الفورية للواجهة عند التحميل المبدئي
    applyLanguage(currentLanguage);


    // 3. كونسول التفاعل الحي والمفتوح للذكاء الاصطناعي

    if (aiForm) {
        aiForm.addEventListener("submit", async(e) => {
            e.preventDefault();
            const prompt = aiInput.value.trim();
            if (!prompt) return;

            const currentLangData = localizationDictionary[currentLanguage];
            const isRtl = currentLanguage === "ar";

            // حقن رسالة المستخدم في الكونسول بشكل متناسق مع الاتجاه
            aiDisplay.innerHTML += `
                <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 6px; border-${isRtl ? 'left' : 'right'}: 2px solid #ffffff; font-size: 13px; align-self: flex-end; width: 85%; text-align: ${isRtl ? 'right' : 'left'}; direction: ${currentLangData.dir}; margin-bottom: 8px;">
                    <strong style="color: #ffffff;">[${account.name}]:</strong> ${prompt}
                </div>`;

            aiInput.value = "";
            aiDisplay.scrollTop = aiDisplay.scrollHeight;

            const loadingId = "loader_" + Date.now();
            aiDisplay.innerHTML += `
                <div id="${loadingId}" style="background: rgba(255,255,255,0.01); padding: 12px; border-radius: 6px; border-${isRtl ? 'right' : 'left'}: 2px solid #ffffff; font-size: 13px; width: 85%; text-align: ${isRtl ? 'right' : 'left'}; direction: ${currentLangData.dir}; margin-bottom: 8px;">
                    <strong style="color: #ffffff;">[CareShield AI]:</strong> ${currentLangData.loadingMsg} <i class="fa-solid fa-spinner fa-spin"></i>
                </div>`;
            aiDisplay.scrollTop = aiDisplay.scrollHeight;

            try {
                const response = await fetch('/api/ai-core/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt, sender: account.name, lang: currentLanguage })
                });
                const data = await response.json();

                const loaderEl = document.getElementById(loadingId);
                if (loaderEl) {
                    let cleanReply = data.reply
                        .replace(/^\[CareShield AI\]:\s*/i, '')
                        .replace(/^\[محرك صقر الشمال\]:\s*/i, '')
                        .replace(/^\[CareShield CORE\]:\s*/i, '')
                        .replace(/^\[CareShield Local Engine\]:\s*/i, '')
                        .replace(/^\[محرك صقر الشمال المحلي\]:\s*/i, '');

                    loaderEl.innerHTML = `<strong style="color: #ffffff;">[CareShield CORE]:</strong><br><div style="margin-top:5px; line-height:1.6; color:#e4e4e7; text-align: ${isRtl ? 'right' : 'left'}; direction: ${currentLangData.dir};">${cleanReply}</div>`;
                }
            } catch (err) {
                const loaderEl = document.getElementById(loadingId);
                if (loaderEl) {
                    loaderEl.innerHTML = `<strong style="color: #ff4a4a;">[ERROR]:</strong> ${currentLangData.errorMsg}`;
                }
            }
            aiDisplay.scrollTop = aiDisplay.scrollHeight;
        });
    }


    // 4. قسم معالجة وحقن وتلخيص السجلات الطبية الرقمية المرفوعة 

    if (dropZone) {
        dropZone.addEventListener("click", () => fileInput.click());
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("drag-over");
        });
        dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("drag-over");
            if (e.dataTransfer.files.length > 0) handleClinicalAnalysis(e.dataTransfer.files[0]);
        });
    }

    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) handleClinicalAnalysis(e.target.files[0]);
        });
    }

    async function handleClinicalAnalysis(file) {
        const currentLangData = localizationDictionary[currentLanguage];
        const isRtl = currentLanguage === "ar";

        const loadingId = "file_loader_" + Date.now();
        aiDisplay.innerHTML += `
            <div id="${loadingId}" style="background: rgba(255,255,255,0.01); padding: 14px; border-radius: 6px; border-${isRtl ? 'right' : 'left'}: 2px solid #ffffff; font-size: 13px; width: 85%; text-align: ${isRtl ? 'right' : 'left'}; direction: ${currentLangData.dir}; margin-bottom: 8px;">
                <strong style="color: #ffffff;">[FILE NODE PARSER]:</strong> ${currentLangData.readingFileMsg} <i class="fa-solid fa-circle-notch fa-spin"></i>
            </div>`;
        aiDisplay.scrollTop = aiDisplay.scrollHeight;

        const reader = new FileReader();
        reader.onload = async(e) => {
            const fileContent = e.target.result;

            try {
                const response = await fetch('/api/ai-core/analyze-report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: file.name, textContent: fileContent, lang: currentLanguage })
                });
                const data = await response.json();

                const loaderEl = document.getElementById(loadingId);

                if (data.success) {

                    let rawA = (data.detectedDrugA || "").trim();
                    let rawB = (data.detectedDrugB || "").trim();

                    detectedDrugA = (rawA.toLowerCase() === "none" || rawA === "") ? "" : rawA;
                    detectedDrugB = (rawB.toLowerCase() === "none" || rawB === "") ? "" : rawB;
                    lastAnalysisReportText = data.detailedSummary || "";


                    if (!detectedDrugA || !detectedDrugB) {
                        const fileContentLower = fileContent.toLowerCase();
                        const knownLibrary = ["aspirin", "warfarin", "nitroglycerin", "sildenafil", "heparin", "paracetamol", "ibuprofen"];
                        let discovered = [];

                        knownLibrary.forEach(drug => {
                            if (fileContentLower.includes(drug) && !discovered.includes(drug)) {
                                discovered.push(drug.charAt(0).toUpperCase() + drug.slice(1));
                            }
                        });

                        const compoundRegex = /(?:compound|drug|مركب|مادة)\s*[:=-]\s*([a-zA-Z]+)/gi;
                        let match;
                        while ((match = compoundRegex.exec(fileContent)) !== null) {
                            if (match[1] && !discovered.includes(match[1])) {
                                discovered.push(match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase());
                            }
                        }

                        if (discovered.length > 0 && !detectedDrugA) detectedDrugA = discovered[0];
                        if (discovered.length > 1 && !detectedDrugB) detectedDrugB = discovered[1];

                        // حقن قيم افتراضية آمنة للتجربة 
                        if (!detectedDrugA) detectedDrugA = "Aspirin";
                        if (!detectedDrugB) detectedDrugB = "Warfarin";
                    }

                    // الحقن الفوري والذكي في حقول الإدخال الخاص بالادوية 
                    if (drugAlpha) drugAlpha.value = detectedDrugA;
                    if (drugBeta) drugBeta.value = detectedDrugB;

                    if (loaderEl) {
                        loaderEl.innerHTML = `
            <strong style="color: #ffffff;">[ANALYSIS REPORT FOR NODE: ${file.name}]:</strong><br>
            <div style="margin-top: 8px; color: #e4e4e7; white-space: pre-line; line-height: 1.6; text-align: ${isRtl ? 'right' : 'left'}; direction: ${currentLangData.dir};">
                ${lastAnalysisReportText}
            </div>
            <div style="margin-top: 10px; font-size: 11px; color: #a1a1aa; border-top: 1px solid rgba(255,255,255,0.05); padding-top:5px; text-align: ${isRtl ? 'right' : 'left'};">
                <i class="fa-solid fa-circle-info"></i> Extracted Node Compounds: [${detectedDrugA}] & [${detectedDrugB}]. Ready for injection matrix below.
            </div>`;
                    }
                } else {
                    if (loaderEl) loaderEl.innerHTML = `<strong style="color: #ff4a4a;">[ERROR]:</strong> ${currentLangData.fileFailTitle}`;
                }
            } catch (err) {
                const loaderEl = document.getElementById(loadingId);
                if (loaderEl) loaderEl.innerHTML = `<strong style="color: #ff4a4a;">[ERROR]:</strong> ${currentLangData.serverError}`;
            }
            aiDisplay.scrollTop = aiDisplay.scrollHeight;
        };
        reader.readAsText(file);
    }


    //القسم الخاص بتوليد التقارير الطبية
    if (checkMatrixBtn) {
        checkMatrixBtn.addEventListener("click", async() => {
            const currentLangData = localizationDictionary[currentLanguage];
            const isRtl = currentLanguage === "ar";

            if (detectedDrugA && !drugAlpha.value.trim()) drugAlpha.value = detectedDrugA;
            if (detectedDrugB && !drugBeta.value.trim()) drugBeta.value = detectedDrugB;

            const compoundA = drugAlpha.value.trim();
            const compoundB = drugBeta.value.trim();

            if (!compoundA || !compoundB) {
                alert(currentLangData.alertEmptyDrugs);
                return;
            }

            matrixFeedback.style.display = "block";
            matrixFeedback.style.textAlign = isRtl ? "right" : "left";
            matrixFeedback.style.direction = currentLangData.dir;
            matrixFeedback.style.background = "rgba(255,255,255,0.01)";
            matrixFeedback.style.color = "#ffffff";
            matrixFeedback.innerHTML = `<i class="fa-solid fa-atom fa-spin"></i> ${currentLangData.checkingMatrix}`;

            try {
                const response = await fetch('/api/ai-core/drug-matrix', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ drugA: compoundA, drugB: compoundB, lang: currentLanguage })
                });
                const data = await response.json();

                let validationStatus = "";
                let fileLogLayout = "";

                if (data.conflict) {
                    matrixFeedback.style.border = "1px solid rgba(255, 74, 74, 0.4)";
                    matrixFeedback.style.color = "#ff4a4a";
                    matrixFeedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>${currentLangData.matrixConflictTitle}</strong> ${data.message}`;
                    validationStatus = isRtl ? "تم رصد تعارض دوائي حرج" : "CRITICAL CONTRAINDICATION DETECTED";
                } else {
                    matrixFeedback.style.border = "1px solid rgba(255, 255, 255, 0.18)";
                    matrixFeedback.style.color = "#ffffff";
                    matrixFeedback.innerHTML = `<i class="fa-solid fa-square-check"></i> <strong>${currentLangData.matrixSafeTitle}</strong> ${data.message}`;
                    validationStatus = isRtl ? "موافق عليه / ممتثل لمعايير السلامة الصيدلانية" : "APPROVED / PHARMACOLOGICAL SAFETY COMPLIANT";
                }

                // (BiDi Engine Fix) البناء الهيكلي الذكي للمستند بناءً على لغة النظام لمنع تضارب الاتجاهات 
                if (isRtl) {
                    fileLogLayout = `============================================================
نظام كير شيلد السريري الآمن - سجل التقرير المتكامل
============================================================
طابع وقت التوليد       : ${new Date().toLocaleString('ar-EG')}
تم التنفيذ بواسطة المهني : ${account.name}
صلاحيات الدور          : ${account.role}
حالة الأمن الفنية       : ${validationStatus}

------------------------------------------------------------
[1] سجل الحالة السريرية والمستندات الطبية المرتبطة:
------------------------------------------------------------
${lastAnalysisReportText || "لم يتم ربط ملف تقرير سريري مباشر في دورة التقييم هذه."}


------------------------------------------------------------
[2] ركائز المركبات الصيدلانية المفحوصة:
------------------------------------------------------------
- مفتاح المركب ألفا (Alpha) : ${compoundA}
- مفتاح المركب بيتا (Beta)  : ${compoundB}


------------------------------------------------------------
[3] تحليل ملخص مصفوفة القرار السريري للمحرك:
------------------------------------------------------------
${data.message}

============================================================
نهاية سجل إرسال عقدة التقرير المشفر والآمن.`;
                } else {
                    fileLogLayout = `============================================================
CARESHIELD CLINICAL SECURE SYSTEM - INTEGRATED REPORT LOG
============================================================
Generation Timestamp    : ${new Date().toLocaleString('en-US')}
Executed By Professional: ${account.name}
Role Permissions        : ${account.role}
Security Status        : ${validationStatus}

------------------------------------------------------------
[1] ASSOCIATED CLINICAL CASE RECORD HISTORY DOCUMENTATION:
------------------------------------------------------------
${lastAnalysisReportText || "No direct clinical report file was linked in this evaluation cycle."}


------------------------------------------------------------
[2] PHARMACOLOGICAL COMPOUND CORES:
------------------------------------------------------------
- Compound Alpha Key    : ${compoundA}
- Compound Beta Key     : ${compoundB}


------------------------------------------------------------
[3] DECISION MATRIX CLINICAL SUMMARY ANALYSIS:
------------------------------------------------------------
${data.message}

============================================================
END OF SECURE NODE REPORT TRANSMISSION RECORD.`;
                }


                const cleanFormattedText = fileLogLayout.replace(/\r?\n/g, "\r\n");

                triggerSystemFileDownload(cleanFormattedText, `Clinical_Analysis_Log_${compoundA}_${compoundB}.txt`);

            } catch (err) {
                matrixFeedback.innerHTML = currentLangData.serverError;
            }
        });
    }

    // دالة هندسية مطورة لحفظ الملفات مع تفعيل حماية الترميز وعلامة الـ BOM للنصوص العربية
    function triggerSystemFileDownload(textData, fileName) {

        const blob = new Blob(["\uFEFF" + textData], { type: "text/plain;charset=utf-8" });
        const downloadElement = document.createElement("a");
        downloadElement.href = URL.createObjectURL(blob);
        downloadElement.download = fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        URL.revokeObjectURL(downloadElement.href);
    }


    // (High Contrast Logic) قسم إدارة وتشغيل نظام التباين العالي وحفظ الجلسة 

    let isHighContrast = localStorage.getItem("careshield_contrast") === "true";

    //  استدعاء الحالة المحفوظة فوراً عند تحميل الصفحة لمنع تذبذب الإضاءة في وضع التباين العالي
    if (isHighContrast) {
        document.body.classList.add("high-contrast");
    }

    if (uiHighContrastBtn) {
        uiHighContrastBtn.addEventListener("click", () => {
            isHighContrast = !isHighContrast;
            localStorage.setItem("careshield_contrast", isHighContrast);
            document.body.classList.toggle("high-contrast", isHighContrast);
        });
    }
});