
// ==========================================
// ANH HÙNG JAVASCRIPT - HÀ QUỲNH NHƯ
// MSSV: 31241026992
// QUEST 5: ĐẤU TRƯỜNG SINH TỬ
// ==========================================

const $ = id => document.getElementById(id);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const HERO_NAME = "Hà Quỳnh Như";
const MSSV = 31241026992;

let level = 5;
let xp = 1350;
let skillPoints = 40;

let strength = 59;
let agility = 78;
let intel = 44;

let health = 105;
let dragonHealth = 600;

const dragonStr = 100;
const dragonAgi = 15;
const dragonInt = 80;

let playing = false;
let busy = false;
let autoPlay = false;
let soundEnabled = true;
let battleId = 0;
let audioContext = null;

// ==========================================
// 1. KHỞI TẠO CHỈ SỐ ANH HÙNG
// ==========================================

function setupHero() {
    const name = $("heroName").value.trim();
    const heroClass = $("heroClass").value;

    // Công thức tính từ bài JavaScript gốc
    level = 1;
    xp = 0;
    skillPoints = 5;

    level++;
    xp = 150 * (level - 1) + 200;
    skillPoints += xp / 10;

    strength = 0.6 * skillPoints + 0.1 * xp;
    agility = 0.2 * skillPoints + 0.2 * xp;
    intel = 0.6 * skillPoints + 10 * level;

    level = 3;
    xp += 300;

    // Kiểm tra tên
    if (name === HERO_NAME) {
        intel += 5;
        addLog("✓ Xác nhận danh tính thành công! INTEL +5");
    } else {
        intel -= 5;
        addLog("⚠ Tên không trùng tên anh hùng! INTEL -5");
    }

    // Lựa chọn phân cấp
    let phancap = "";

    switch (heroClass) {
        case "a":
            phancap = "Chiến Binh";
            strength += 15;
            agility -= 10;
            intel -= 5;
            break;

        case "b":
            phancap = "Sát Thủ";
            strength -= 15;
            agility += 10;
            intel += 5;
            break;

        case "c":
            phancap = "Thợ Săn";
            strength -= 15;
            intel += 15;
            break;
    }

    level = 4;
    xp += 700;

    level = 5;
    health = level + 100;
    dragonHealth = 600;

    $("heroLabel").textContent = name.toUpperCase() || HERO_NAME.toUpperCase();

    $("stats").textContent =
        `LEVEL ${level} · ${phancap} · ` +
        `STR: ${strength} · AGI: ${agility} · ` +
        `INT: ${intel} · XP: ${xp}`;

    addLog("⚔ Anh hùng " + phancap + " bước vào đấu trường!");
    updateHealth();
}

// ==========================================
// 2. CẬP NHẬT THANH MÁU
// ==========================================

function updateHealth() {
    $("heroHp").textContent =
        Math.max(0, health) + " / 105";

    $("dragonHp").textContent =
        Math.max(0, dragonHealth) + " / 600";

    $("heroBar").style.width =
        Math.max(0, Math.min(100, health / 105 * 100)) + "%";

    $("dragonBar").style.width =
        Math.max(0, Math.min(100, dragonHealth / 600 * 100)) + "%";
}

// ==========================================
// 3. NHẬT KÝ CHIẾN ĐẤU
// ==========================================

function addLog(message) {
    const p = document.createElement("p");
    p.textContent = message;
    $("log").prepend(p);

    while ($("log").children.length > 12) {
        $("log").lastElementChild.remove();
    }
}

// ==========================================
// 4. ÂM THANH BẰNG WEB AUDIO API
// ==========================================

function initAudio() {
    if (!soundEnabled) return;

    const AudioClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioClass) return;

    if (!audioContext) {
        audioContext = new AudioClass();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}

function playSound(type) {
    if (!soundEnabled || !audioContext) return;

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    let frequency = 300;
    let duration = 0.2;

    switch (type) {
        case "attack":
            frequency = 550;
            duration = 0.18;
            oscillator.type = "sawtooth";
            break;

        case "fire":
            frequency = 120;
            duration = 0.45;
            oscillator.type = "sawtooth";
            break;

        case "hit":
            frequency = 90;
            duration = 0.25;
            oscillator.type = "square";
            break;

        case "critical":
            frequency = 750;
            duration = 0.4;
            oscillator.type = "triangle";
            break;

        case "win":
            frequency = 880;
            duration = 0.7;
            oscillator.type = "sine";
            break;

        case "lose":
            frequency = 110;
            duration = 0.7;
            oscillator.type = "sine";
            break;
    }

    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(30, frequency / 3),
        now + duration
    );

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(
        0.001, now + duration
    );

    oscillator.start(now);
    oscillator.stop(now + duration);
}

// ==========================================
// 5. HIỆU ỨNG HOẠT HÌNH
// ==========================================

function animate(element, className, duration = 650) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);

    setTimeout(() => {
        element.classList.remove(className);
    }, duration);
}

function showDamage(value, target, critical = false) {
    const damage = $("damage");

    damage.textContent = value;
    damage.style.left = target === "dragon" ? "70%" : "23%";
    damage.style.color = critical ? "#ff4444" : "#facc15";

    damage.classList.remove("show");
    void damage.offsetWidth;
    damage.classList.add("show");
}

function flashScreen() {
    animate($("flash"), "active", 400);
    animate($("stage"), "shake", 350);
}

// ==========================================
// 6. ANH HÙNG TẤN CÔNG
// ==========================================

async function heroAttack(id) {
    $("status").textContent = "⚔ ANH HÙNG TẤN CÔNG";

    animate($("hero"), "attack");
    animate($("shield"), "fly", 700);
    playSound("attack");

    await sleep(650);
    if (id !== battleId) return;

    // Kiểm tra đánh trúng theo bài gốc
    const heroHit = Math.random() * 100 > dragonAgi;

    if (heroHit) {
        dragonHealth -= strength;

        animate($("dragon"), "hurt", 500);
        showDamage("-" + strength, "dragon");
        playSound("hit");

        addLog("⚔ TRẢM LONG! Gây " + strength + " sát thương.");

        // Kiểm tra chí mạng
        const heroCritical = Math.random() * 100 < intel;

        if (heroCritical) {
            await sleep(450);
            if (id !== battleId) return;

            dragonHealth -= strength * 2;

            showDamage(
                "CRITICAL -" + strength * 2,
                "dragon",
                true
            );

            flashScreen();
            playSound("critical");

            addLog(
                "💥 CHÍ MẠNG! Gây thêm " +
                strength * 2 + " sát thương!"
            );
        }
    } else {
        animate($("dragon"), "dodge", 500);
        showDamage("MISS!", "dragon");
        addLog("💨 Rồng đã né được đòn tấn công!");
    }

    updateHealth();
}

// ==========================================
// 7. RỒNG GIÀ PHẢN CÔNG
// ==========================================

async function dragonAttack(id) {
    $("status").textContent = "🔥 RỒNG GIÀ PHẢN CÔNG";

    animate($("dragon"), "attack");
    animate($("fire"), "fly", 700);
    playSound("fire");

    await sleep(700);
    if (id !== battleId) return;

    // Kiểm tra rồng đánh trúng
    const dragonHit = Math.random() * 100 > agility;

    if (dragonHit) {
        health -= dragonStr;

        animate($("hero"), "hurt", 500);
        showDamage("-" + dragonStr, "hero");
        playSound("hit");

        addLog(
            "🔥 HỎA CẦU! Rồng gây " +
            dragonStr + " sát thương!"
        );

        // Rồng gây chí mạng
        const dragonCritical =
            Math.random() * 100 < dragonInt;

        if (dragonCritical) {
            await sleep(450);
            if (id !== battleId) return;

            health -= dragonStr * 2;

            showDamage(
                "CRITICAL -" + dragonStr * 2,
                "hero",
                true
            );

            flashScreen();
            playSound("critical");

            addLog(
                "💀 RỒNG CHÍ MẠNG! Gây thêm " +
                dragonStr * 2 + " sát thương!"
            );
        }
    } else {
        animate($("hero"), "dodge", 500);
        showDamage("MISS!", "hero");
        addLog("🛡 Anh hùng né được hỏa cầu!");
    }

    updateHealth();
}

// ==========================================
// 8. KIỂM TRA THẮNG THUA
// ==========================================

function checkResult() {
    if (dragonHealth <= 0) {
        finishBattle(true);
        return true;
    }

    if (health <= 0) {
        finishBattle(false);
        return true;
    }

    return false;
}

function finishBattle(won) {
    playing = false;
    autoPlay = false;

    $("attackBtn").disabled = true;
    $("autoBtn").disabled = true;

    if (won) {
        $("status").textContent = "🏆 CHIẾN THẮNG";
        $("result").textContent =
            "🏆 CHIẾN THẮNG! BẠN ĐÃ HẠ GỤC RỒNG GIÀ!";
        addLog("🏆 Anh hùng đã chiến thắng!");
        playSound("win");
    } else {
        $("status").textContent = "💀 THẤT BẠI";
        $("result").textContent =
            "💀 THẤT BẠI! ANH HÙNG ĐÃ BỊ ĐÁNH BẠI!";
        addLog("💀 Anh hùng đã thất bại!");
        playSound("lose");
    }
}

// ==========================================
// 9. XỬ LÝ MỘT LƯỢT CHIẾN ĐẤU
// ==========================================

async function battleTurn() {
    if (!playing || busy) return;

    busy = true;
    $("attackBtn").disabled = true;

    const id = battleId;

    try {
        await heroAttack(id);

        if (id !== battleId) return;
        if (checkResult()) return;

        await sleep(450);
        if (id !== battleId) return;

        await dragonAttack(id);

        if (id !== battleId) return;
        if (checkResult()) return;

        $("status").textContent = "⚔ CHỜ LƯỢT TIẾP THEO";
    } finally {
        if (id === battleId) {
            busy = false;
            $("attackBtn").disabled = !playing;
        }
    }
}

// ==========================================
// 10. CHIẾN ĐẤU TỰ ĐỘNG
// ==========================================

async function startAutoBattle() {
    if (!playing || autoPlay) return;

    autoPlay = true;
    $("autoBtn").textContent = "⏸ DỪNG TỰ ĐỘNG";

    const id = battleId;

    while (autoPlay && playing && id === battleId) {
        if (!busy) {
            await battleTurn();
        }

        await sleep(650);
    }

    if (id === battleId) {
        autoPlay = false;
        $("autoBtn").textContent = "▶ TỰ ĐỘNG";
    }
}

// ==========================================
// 11. CÁC NÚT ĐIỀU KHIỂN
// ==========================================

$("startBtn").addEventListener("click", () => {
    if (busy) return;

    battleId++;
    initAudio();

    $("log").innerHTML = "";
    $("result").textContent = "";

    setupHero();

    playing = true;
    busy = false;
    autoPlay = false;

    $("status").textContent = "⚔ TRẬN CHIẾN BẮT ĐẦU";

    $("attackBtn").disabled = false;
    $("autoBtn").disabled = false;
    $("autoBtn").textContent = "▶ TỰ ĐỘNG";

    addLog("🐉 Rồng Già xuất hiện với 600 HP!");
});

$("attackBtn").addEventListener("click", () => {
    initAudio();
    if (!autoPlay) battleTurn();
});

$("autoBtn").addEventListener("click", () => {
    initAudio();

    if (autoPlay) {
        autoPlay = false;
        $("autoBtn").textContent = "▶ TỰ ĐỘNG";
    } else {
        startAutoBattle();
    }
});

$("soundBtn").addEventListener("click", () => {
    soundEnabled = !soundEnabled;

    $("soundBtn").textContent = soundEnabled
        ? "🔊 ÂM THANH: BẬT"
        : "🔇 ÂM THANH: TẮT";

    if (soundEnabled) initAudio();
});

$("resetBtn").addEventListener("click", () => {
    battleId++;
    playing = false;
    busy = false;
    autoPlay = false;

    health = 105;
    dragonHealth = 600;

    $("attackBtn").disabled = true;
    $("autoBtn").disabled = true;
    $("autoBtn").textContent = "▶ TỰ ĐỘNG";

    $("status").textContent = "ĐẤU TRƯỜNG · SẴN SÀNG";
    $("result").textContent = "";
    $("log").innerHTML = "<p>Hãy bắt đầu trận chiến!</p>";

    ["hero", "dragon", "shield", "fire", "stage", "flash", "damage"]
        .forEach(id => {
            $(id).classList.remove(
                "attack", "hurt", "dodge", "fly",
                "shake", "active", "show"
            );
        });

    updateHealth();
});

// Khởi tạo giao diện
updateHealth();
