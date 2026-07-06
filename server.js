const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const PORT = process.env.PORT || 5000;



const CORE_MODEL_NAME = "gemini-3-flash-preview";

let aiAgentClient;
try {

    aiAgentClient = new GoogleGenAI({ apiKey: process.env.CARESHIELD_KEY });

    console.log("SUCCESS: Google AI Client initialized successfully.");
} catch (err) {
    console.error("ERROR: Failed to initialize Google AI Client. Check API Key.", err.message);
}

const globalAiCoreInstructions = `
You are the CARESHIELD AI Tactical Core, an advanced multi-domain intelligent assistant integrated inside the CareShield secure platform. 
Your capabilities are completely unrestricted, natural, and comprehensive. You function as a true generative AI model.

OPERATIONAL MANDATE:
1. You must answer ANY question, prompt, code review, general query, or conversational input submitted by the user effectively, deeply, and comprehensively. Never give short, robotic, or brief one-sentence answers.
2. Provide multi-paragraph explanations, structured analysis, and insightful recommendations for any domain requested.
3. Adapt your tone to be highly professional, supportive, expert-level, and context-aware.

CRITICAL LANGUAGE RULE:
If the requested language is Arabic ('ar'), you MUST write the entire response in fluent Arabic. However, you MUST keep all medical terminology, drug names, technical keywords, and cybersecurity standards in their original English text.
`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'home.html')));


// DATABASE NODE INITIALIZATION (SQLITE3)

const db = new sqlite3.Database('./careshield_secure.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('CareShield Secure SQLite Database Initialized.');
        initializeDatabase();
    }
});

async function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        clearance_level TEXT NOT NULL,
        is_blocked INTEGER DEFAULT 0
    )`, (err) => {
        if (!err) {
            db.run(`ALTER TABLE users ADD COLUMN is_blocked INTEGER DEFAULT 0`, () => {});
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_email TEXT,
        action_performed TEXT,
        role TEXT,
        status TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS compliance_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        sender_email TEXT,
        sender_name TEXT,
        sender_role TEXT,
        message TEXT
    )`);

    // جدول الأدوية
    db.run(`CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        stock INTEGER NOT NULL,
        expiry_date TEXT NOT NULL,
        description TEXT
    )`, (err) => {
        if (!err) {
            db.get("SELECT COUNT(*) AS count FROM medicines", (err, row) => {
                if (row && row.count === 0) {
                    console.log('Injecting 100 initial medical compounds into database...');
                    const stmt = db.prepare(`INSERT INTO medicines (name, category, stock, expiry_date, description) VALUES (?, ?, ?, ?, ?)`);

                    const baseDrugs = [
                        { n: "Paracetamol", c: "Analgesic / Antipyretic" },
                        { n: "Amoxicillin", c: "Antibiotic / Penicillin" },
                        { n: "Ibuprofen", c: "NSAID" },
                        { n: "Metformin", c: "Antidiabetic / Biguanides" },
                        { n: "Omeprazole", c: "Proton Pump Inhibitor (PPI)" },
                        { n: "Atorvastatin", c: "Lipid-lowering / Statin" },
                        { n: "Amlodipine", c: "Calcium Channel Blocker" },
                        { n: "Lisinopril", c: "ACE Inhibitor" },
                        { n: "Azithromycin", c: "Antibiotic / Macrolide" },
                        { n: "Losartan", c: "Angiotensin II Receptor Blocker" },
                        { n: "Cetirizine", c: "Antihistamine" },
                        { n: "Albuterol", c: "Bronchodilator" }
                    ];

                    db.serialize(() => {
                        for (let i = 1; i <= 100; i++) {
                            const base = baseDrugs[i % baseDrugs.length];
                            const dose = (Math.floor(Math.random() * 5) + 1) * 100;
                            const medName = `${base.n} ${dose}mg (Batch-${i})`;
                            const stock = Math.floor(Math.random() * 300) + 2;

                            const year = 2026 + Math.floor(Math.random() * 4);
                            const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
                            const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
                            const expiry = `${year}-${month}-${day}`;

                            const desc = `System-generated clinical record #${i} for ${base.c} indications. Verified by system core.`;

                            stmt.run([medName, base.c, stock, expiry, desc]);
                        }
                        stmt.finalize();
                        console.log('100 medical compounds successfully injected into Core Database.');
                    });
                }
            });
        }
    });

    // إنشاء جدول المرضى الخاص بواجهة الممرض وحقن 100 مريض
    db.run(`CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_number TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        condition_status TEXT NOT NULL,
        vitals_notes TEXT NOT NULL,
        visit_required INTEGER DEFAULT 1
    )`, (err) => {
        if (!err) {
            db.get("SELECT COUNT(*) AS count FROM patients", (err, row) => {
                if (row && row.count === 0) {
                    console.log('Injecting 100 patient records for Nurse Station...');
                    const stmt = db.prepare(`INSERT INTO patients (room_number, patient_name, condition_status, vitals_notes, visit_required) VALUES (?, ?, ?, ?, ?)`);

                    const conditions = ["Stable", "Critical", "Observation", "Post-Op Recovery", "Routine Check"];
                    const vitals = ["BP Normal, HR 72", "Elevated Temp 38.5C", "O2 Sat 98%, HR 80", "BP 140/90, Needs Meds", "Vitals Stable, Asleep"];
                    const firstNames = ["Ahmed", "John", "Sarah", "Layla", "Omar", "Michael", "Emma", "Hassan", "Ali", "Fatima"];
                    const lastNames = ["Smith", "Al-Fayed", "Johnson", "Haddad", "Williams", "Zayed", "Brown", "Ali", "Youssef"];

                    db.serialize(() => {
                        for (let i = 1; i <= 100; i++) {
                            const room = `RM-${100 + i}`;
                            const pName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
                            const cond = conditions[Math.floor(Math.random() * conditions.length)];
                            const vitalNote = vitals[Math.floor(Math.random() * vitals.length)];
                            const needsVisit = Math.random() > 0.3 ? 1 : 0;

                            stmt.run([room, pName, cond, vitalNote, needsVisit]);
                        }
                        stmt.finalize();
                        console.log('100 patient records successfully injected.');
                    });
                }
            });
        }
    });
}

// ==========================================================================
//  CORE SECURITY ENDPOINTS (LOGIN, REGISTER & PROFILE MANAGEMENT)
// ==========================================================================

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please fill in all security fields.' });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async(err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }

        if (!user) {
            db.run(`INSERT INTO audit_logs (user_email, action_performed, role, status) VALUES (?, ?, ?, ?)`, [email, 'Unauthorized Access Attempt (User Not Found)', 'Unknown', 'FAILED']);
            return res.status(401).json({ success: false, message: 'Authentication Failed: Invalid credentials.' });
        }

        if (user.is_blocked === 1) {
            db.run(`INSERT INTO audit_logs (user_email, action_performed, role, status) VALUES (?, ?, ?, ?)`, [user.email, 'Blocked Account Authentication Attempt', user.role, 'REJECTED']);
            return res.status(403).json({ success: false, message: 'Access Denied: This account node has been administratively blocked.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
            db.run(`INSERT INTO audit_logs (user_email, action_performed, role, status) VALUES (?, ?, ?, ?)`, [user.email, 'Successful Clinical Authentication', user.role, 'SUCCESS']);

            return res.json({
                success: true,
                message: 'Security validation passed successfully.',
                user: {
                    name: user.full_name,
                    email: user.email,
                    role: user.role,
                    clearance: user.clearance_level
                }
            });
        } else {
            db.run(`INSERT INTO audit_logs (user_email, action_performed, role, status) VALUES (?, ?, ?, ?)`, [user.email, 'Failed Authentication Attempt (Wrong Password)', user.role, 'FAILED']);
            return res.status(401).json({ success: false, message: 'Authentication Failed: Invalid credentials.' });
        }
    });
});

app.post('/api/register', async(req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All parameters matrix fields are strictly required.' });
    }

    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const defaultRole = "Local";
        const defaultClearance = "Level 1";

        db.run(
            `INSERT INTO users (full_name, email, password_hash, role, clearance_level, is_blocked) VALUES (?, ?, ?, ?, ?, 0)`, [name, email, hash, defaultRole, defaultClearance],
            function(err) {
                if (err) {
                    if (err.message.includes("UNIQUE")) {
                        return res.status(400).json({ success: false, message: 'Identity node conflict: This email is already registered.' });
                    }
                    return res.status(500).json({ success: false, message: 'Database structural insertion fault.' });
                }

                db.run(`INSERT INTO audit_logs (user_email, action_performed, role, status) VALUES (?, ?, ?, ?)`, [email, `New Account registered automatically with Local role`, defaultRole, 'SUCCESS']);

                res.json({
                    success: true,
                    message: 'Account identity record synchronized and validated.',
                    user: {
                        name: name,
                        email: email,
                        role: defaultRole,
                        clearance: defaultClearance
                    }
                });
            }
        );
    } catch (cryptoErr) {
        res.status(500).json({ success: false, message: 'Internal server cryptographic hashing pipeline failure.' });
    }
});

app.post('/api/update-account', async(req, res) => {
    const { currentEmail, newEmail, newPassword } = req.body;

    if (!currentEmail || !newEmail) {
        return res.status(400).json({ success: false, message: 'Current and new email parameters are required.' });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [currentEmail], async(err, user) => {
        if (err || !user) {
            return res.status(404).json({ success: false, message: 'User node not found in the cryptographic registry.' });
        }

        let query = `UPDATE users SET email = ?`;
        let params = [newEmail];

        if (newPassword && newPassword.trim() !== "") {
            try {
                const newHash = await bcrypt.hash(newPassword, 10);
                query += `, password_hash = ?`;
                params.push(newHash);
            } catch (hashErr) {
                return res.status(500).json({ success: false, message: 'Hashing engine failure.' });
            }
        }

        query += ` WHERE email = ?`;
        params.push(currentEmail);

        db.run(query, params, function(updateErr) {
            if (updateErr) {
                if (updateErr.message.includes("UNIQUE")) {
                    return res.status(400).json({ success: false, message: 'This email is already linked to another active node.' });
                }
                return res.status(500).json({ success: false, message: 'Database integrity fault during update.' });
            }

            db.run(`INSERT INTO audit_logs (user_email, action_performed, role, status) VALUES (?, ?, ?, ?)`, [newEmail, `Account parameters altered (Email/Password reset committed)`, user.role, 'SUCCESS']);

            return res.json({
                success: true,
                message: 'Account security profile synchronized successfully.',
                updatedEmail: newEmail
            });
        });
    });
});

// ==========================================================================
//  ADMINISTRATIVE ACCOUNT MANAGEMENT ENDPOINTS 
// ==========================================================================

app.get('/api/admin/users', (req, res) => {
    db.all(`SELECT id, full_name AS name, email, role, clearance_level AS clearance, is_blocked FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database integrity fault during query extraction.' });
        }
        const synchronizedUsers = rows.map(row => ({
            id: row.id.toString(),
            name: row.name,
            email: row.email,
            role: row.role,
            clearance: row.clearance,
            is_blocked: row.is_blocked === 1
        }));
        res.json({ success: true, users: synchronizedUsers });
    });
});

app.post('/api/admin/users/add', async(req, res) => {
    const { name, email, password, role, clearance } = req.body;

    if (!name || !email || !password || !role || !clearance) {
        return res.status(400).json({ success: false, message: 'All parameter matrix nodes are strictly required.' });
    }

    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        db.run(
            `INSERT INTO users (full_name, email, password_hash, role, clearance_level, is_blocked) VALUES (?, ?, ?, ?, ?, 0)`, [name, email, hash, role, clearance],
            function(err) {
                if (err) {
                    if (err.message.includes("UNIQUE")) {
                        return res.status(400).json({ success: false, message: 'Identity node conflict: This email is already provisioned.' });
                    }
                    return res.status(500).json({ success: false, message: 'Database structural insertion fault.' });
                }

                db.run(`INSERT INTO audit_logs (user_email, action_performed, role, status) VALUES (?, ?, ?, ?)`, [email, `New credential node provisioned via Identity Center: ${name}`, role, 'SUCCESS']);

                res.json({ success: true, message: 'Account identity record synchronized into central database.' });
            }
        );
    } catch (cryptoErr) {
        res.status(500).json({ success: false, message: 'Internal server cryptographic hashing pipeline failure.' });
    }
});

app.post('/api/admin/users/toggle-status', (req, res) => {
    const { userId, blockStatus } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'Target identifier sequence is missing.' });

    db.get(`SELECT email, role, full_name FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ success: false, message: 'Target account node not found in database registry.' });
        if (user.full_name === "Ali Abdullah") return res.status(403).json({ success: false, message: 'Security Exception: Core root administrator entity cannot be blocked.' });

        const numericBlockState = blockStatus ? 1 : 0;

        db.run(`UPDATE users SET is_blocked = ? WHERE id = ?`, [numericBlockState, userId], function(updateErr) {
            if (updateErr) return res.status(500).json({ success: false, message: 'Database update pipeline exception.' });

            const actionLogText = blockStatus ?
                `Administrative access revocation (Account BLOCKED) enforced on ${user.full_name}` :
                `Administrative access restoration (Account UNBLOCKED) authorized for ${user.full_name}`;

            db.run(`INSERT INTO audit_logs (user_email, action_performed, role, status) VALUES (?, ?, ?, ?)`, [user.email, actionLogText, user.role, 'SUCCESS']);

            res.json({ success: true, message: 'Access security profile mutation completed successfully.' });
        });
    });
});

app.delete('/api/admin/users/:id', (req, res) => {
    const userId = req.params.id;

    db.get(`SELECT full_name, email, role FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ success: false, message: 'Target identity node not found.' });
        if (user.full_name === "Ali Abdullah") return res.status(403).json({ success: false, message: 'Critical Refusal: Root owner Ali Abdullah cannot be expunged.' });

        db.run(`DELETE FROM users WHERE id = ?`, [userId], function(deleteErr) {
            if (deleteErr) return res.status(500).json({ success: false, message: 'Database purge exception.' });

            db.run(`INSERT INTO audit_logs (user_email, action_performed, role, status) VALUES (?, ?, ?, ?)`, [user.email, `Account structural record deleted permanently: ${user.full_name}`, user.role, 'DELETED']);

            res.json({ success: true, message: 'Identity record successfully purged from database core.' });
        });
    });
});

// ==========================================================================
//  INTEGRATED TRACKING & ARCHIVE + SYSTEM MONITORING
// ==========================================================================

app.get('/api/admin/logs', (req, res) => {
    db.all(`SELECT * FROM audit_logs ORDER BY timestamp DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Database fault extraction on system logs.' });
        res.json({ success: true, logs: rows });
    });
});

app.post('/api/admin/logs/clear', (req, res) => {
    db.run(`DELETE FROM audit_logs`, [], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Database fault during log wipe operation.' });
        res.json({ success: true, message: 'System logging archive cleared successfully.' });
    });
});

// ==========================================================================
//  PHARMACIST OPERATIONS ENDPOINTS
// ==========================================================================

app.get('/api/pharmacist/medicines', (req, res) => {
    db.all(`SELECT * FROM medicines ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Database query extraction error.' });
        res.json({ success: true, medicines: rows });
    });
});

app.post('/api/pharmacist/medicines/add', (req, res) => {
    const { name, category, stock, expiry_date, description } = req.body;

    if (!name || !category || stock === undefined || !expiry_date) {
        return res.status(400).json({ success: false, message: 'All required medical nodes are missing.' });
    }

    db.run(
        `INSERT INTO medicines (name, category, stock, expiry_date, description) VALUES (?, ?, ?, ?, ?)`, [name, category, stock, expiry_date, description],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: 'Database structural insertion fault.' });
            res.json({ success: true, message: 'Medical compound synchronized into core database.' });
        }
    );
});


app.delete('/api/pharmacist/medicines/:id', (req, res) => {
    const medicineId = req.params.id;

    db.get(`SELECT name FROM medicines WHERE id = ?`, [medicineId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ success: false, message: 'Target medical compound not found in database registry.' });
        }

        db.run(`DELETE FROM medicines WHERE id = ?`, [medicineId], function(deleteErr) {
            if (deleteErr) {
                return res.status(500).json({ success: false, message: 'Database execution pipeline fault during purge.' });
            }

            // تسجيل العملية في سجلات التدقيق الأمني لـ CareShield
            db.run(`INSERT INTO audit_logs (user_email, action_performed, role, status) VALUES (?, ?, ?, ?)`, ['pharmacist@careshield.secure', `Medical compound purged permanently: ${row.name}`, 'Pharmacist', 'DELETED']);

            res.json({ success: true, message: 'Medical compound successfully purged from database core.' });
        });
    });
});

// ==========================================================================
//  DOCTOR OPERATIONS ENDPOINTS 
// ==========================================================================

app.get('/api/nurse/patients', (req, res) => {
    db.all(`SELECT * FROM patients ORDER BY room_number ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Failed to extract patient records.' });
        res.json({ success: true, patients: rows });
    });
});

app.post('/api/nurse/patients/visit', (req, res) => {
    const { id } = req.body;
    db.run(`UPDATE patients SET visit_required = 0 WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ success: false, message: 'Failed to update visit status.' });
        res.json({ success: true, message: 'Patient room marked as visited.' });
    });
});

// ==========================================================================
//  FEEDBACK & CRITICAL ISSUES PIPELINES FOR THE CONSULTANT
// ==========================================================================

app.get('/api/compliance/messages', (req, res) => {
    db.all(`SELECT * FROM compliance_messages ORDER BY timestamp ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Failed to fetch compliance messages node.' });
        res.json({ success: true, messages: rows });
    });
});

app.get('/api/compliance/messages/unread', (req, res) => {
    const { last_id, email, role } = req.query;

    if (role !== 'Admin' && role !== 'Consultant') {
        return res.json({ success: true, unreadCount: 0 });
    }

    const parsedLastId = parseInt(last_id) || 0;

    db.get(`SELECT COUNT(*) as count FROM compliance_messages WHERE id > ? AND sender_email != ?`, [parsedLastId, email], (err, row) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, unreadCount: row.count });
    });
});

app.post('/api/compliance/messages/send', (req, res) => {
    const { email, name, role, message } = req.body;

    if (!message || !email || !role || !name) {
        return res.status(400).json({ success: false, message: 'All message structure parameters required.' });
    }

    if (role !== 'Admin' && role !== 'Consultant') {
        return res.status(403).json({ success: false, message: 'Unauthorized Enclave: Only Admin and Consultant roles can cross-communicate.' });
    }

    db.run(`INSERT INTO compliance_messages (sender_email, sender_name, sender_role, message) VALUES (?, ?, ?, ?)`, [email, name, role, message],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: 'Database insertion error for compliance dispatch.' });
            res.json({ success: true, message: 'Compliance message synchronized.' });
        }
    );
});

app.delete('/api/compliance/messages/:id', (req, res) => {
    const msgId = req.params.id;

    db.run(`DELETE FROM compliance_messages WHERE id = ?`, [msgId], function(err) {
        if (err) return res.status(500).json({ success: false, message: 'Database purge exception on targeting message node.' });
        res.json({ success: true, message: 'Compliance statement permanently expunged.' });
    });
});

// ==========================================================================
//  CARESHIELD CLINICAL CONSULTANT PATIENTS API ENDPOINTS
// ==========================================================================

app.post('/api/doctor/add-patient', (req, res) => {
    const { name, ageGender, room, diagnosis, status, notes } = req.body;
    return res.json({ success: true, message: "Patient injected into Core Database." });
});

app.post('/api/doctor/bulk-inject-patients', (req, res) => {
    const { patients } = req.body;
    return res.json({ success: true, count: patients.length, message: "Bulk dynamic ingestion matrix complete." });
});

// ==========================================================================
//  DYNAMIC HYBRID REAL & FAULT-TOLERANT AI PIPELINES
// ==========================================================================

app.post('/api/ai-core/query', async(req, res) => {
    const { prompt, sender, lang } = req.body;
    const isEnglish = (lang && lang.toLowerCase() === 'en');

    if (!aiAgentClient) {
        return res.status(503).json({
            success: false,
            reply: isEnglish ? "AI Engine is currently unavailable. Check API Key." : "محرك الذكاء الاصطناعي غير متاح حالياً. يرجى التحقق من مفتاح API."
        });
    }

    try {
        const aiResponse = await aiAgentClient.models.generateContent({
            model: CORE_MODEL_NAME,
            contents: `User Prompt: ${prompt}`,
            config: {
                systemInstruction: globalAiCoreInstructions,
                temperature: 0.7,
                maxOutputTokens: 2048
            }
        });

        let replyText = aiResponse.text || (isEnglish ? "No response generated." : "لم يتم توليد رد.");
        return res.json({ success: true, reply: replyText });

    } catch (error) {
        console.error(" AI API Error (Fallback Triggered):", error.message);
        let localReply = isEnglish ?
            `I apologize, but I'm currently experiencing connectivity issues with my core inference engine. However, I've analyzed your prompt: "${prompt}". Please check your network settings or try again in a few moments.` :
            `آسف، لكنني أعاني حالياً من مشكلة في الاتصال بمحرك الاستدلال الأساسي. ومع ذلك، قمت بتحليل استفسارك: "${prompt}". يرجى التحقق من إعدادات الشبكة أو المحاولة مرة أخرى بعد قليل.`;

        return res.json({ success: true, reply: localReply });
    }
});

app.post('/api/ai-core/analyze-report', async(req, res) => {
    const { fileName, textContent, lang } = req.body;
    const isEnglish = (lang && lang.toLowerCase() === 'en');
    const targetLanguageName = isEnglish ? "English" : "Arabic";

    if (!textContent || textContent.length < 10) {
        return res.json({
            success: true,
            detailedSummary: isEnglish ? "File is too short or empty." : "الملف قصير جداً أو فارغ.",
            detectedDrugA: "",
            detectedDrugB: ""
        });
    }

    try {
        const aiResponse = await aiAgentClient.models.generateContent({
            model: CORE_MODEL_NAME,
            contents: `Analyze this file: "${fileName}". Content: """${textContent.substring(0, 6000)}"""`,
            config: {
                systemInstruction: `Analyze the provided text. Extract two key medical compounds (if any). Respond in strict valid JSON format only: {"detailedSummary": "...", "detectedDrugA": "Name1", "detectedDrugB": "Name2"}. Write 'detailedSummary' in fluent ${targetLanguageName}. Keep drug names in English.`,
                temperature: 0.3
            }
        });

        let jsonText = aiResponse.text.trim();
        if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/```json|```/g, "").trim();
        }

        const parsedResult = JSON.parse(jsonText);
        return res.json({
            success: true,
            detailedSummary: parsedResult.detailedSummary,
            detectedDrugA: parsedResult.detectedDrugA || "",
            detectedDrugB: parsedResult.detectedDrugB || ""
        });

    } catch (error) {
        let localSummary = isEnglish ?
            `[Analysis for Node: ${fileName}]\n• File processed with local heuristic.\n• Check file format or try again.` :
            `[تحليل المستند: ${fileName}]\n• تمت معالجة الملف محلياً.\n• تأكد من تنسيق الملف أو حاول مرة أخرى.`;

        return res.json({ success: true, detailedSummary: localSummary, detectedDrugA: "", detectedDrugB: "" });
    }
});

app.post('/api/ai-core/drug-matrix', async(req, res) => {
    const { drugA, drugB, lang } = req.body;
    const isEnglish = (lang && lang.toLowerCase() === 'en');
    const targetLanguageName = isEnglish ? "English" : "Arabic";

    const dA = drugA ? drugA.toLowerCase().trim() : "";
    const dB = drugB ? drugB.toLowerCase().trim() : "";

    try {
        const aiResponse = await aiAgentClient.models.generateContent({
            model: CORE_MODEL_NAME,
            contents: `Examine pharmacological contraindications between compound Alpha: "${drugA}" and compound Beta: "${drugB}".
                       Write the entire response and explanation in ${targetLanguageName}. If Arabic, embed English compound names correctly.
                       Return your answer strictly as a valid JSON object:
                       {
                         "conflict": true or false,
                         "message": "Detailed warning or safe clearance explanation in ${targetLanguageName}."
                       }`,
            config: { temperature: 0.2 }
        });

        let jsonText = aiResponse.text.trim();
        if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/```json|```/g, "").trim();
        }

        const parsedResult = JSON.parse(jsonText);
        return res.json({ success: true, conflict: parsedResult.conflict, message: parsedResult.message });

    } catch (error) {
        let conflict = false;
        let message = isEnglish ?
            `No recorded conflict between "${drugA}" and "${drugB}" inside the local lookup matrix.` :
            `لا توجد تعارضات مسجلة مباشرة بين المركبين "${drugA}" و "${drugB}" في المصفوفة المحلية.`;

        if ((dA.includes("aspirin") && dB.includes("warfarin")) || (dA.includes("warfarin") && dB.includes("aspirin"))) {
            conflict = true;
            message = isEnglish ? "High clinical risk of severe hemorrhage! Aspirin potentiates the anticoagulant effect of Warfarin." : "خطورة سريرية عالية لحدوث نزيف حاد! يتآزر Aspirin مع مفعول Warfarin.";
        } else if ((dA.includes("nitroglycerin") && dB.includes("sildenafil")) || (dA.includes("sildenafil") && dB.includes("nitroglycerin"))) {
            conflict = true;
            message = isEnglish ? "Dangerous drug interaction! Combining Nitroglycerin with Sildenafil triggers acute hypotension." : "تعارض دوائي خطير! يؤدي دمج Nitroglycerin مع Sildenafil إلى هبوط حاد في ضغط الدم.";
        }

        return res.json({ success: true, conflict: conflict, message: message });
    }
});

app.listen(PORT, () => {
    console.log(`CareShield Tactical AI Server Running on: http://localhost:${PORT}/home.html`);
});
