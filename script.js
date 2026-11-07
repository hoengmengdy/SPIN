// chance = ឱកាសឈ្នះជាភាគរយ (បូកសរុបគួរស្មើ 100)
// chance: 0 = បង្ហាញលើកង់ តែមិនអាចឈ្នះបានទេ
const options = [{
        text: "កក់សក់ស្ពៃ  1កញ្ចប់ ",
        img: "img/Pouch-spout-shampoo-35ml.png",
        chance: 25
    },
    {
        text: "ដុសខ្លួនស្ពៃរំដួល  1កញ្ចប់  ",
        img: "img/Pouch-spout-60ml-Rumdoul-Cabbage.png",
        chance: 25
    },
    {
        text: "លាងចានម្នាស់ 1ដប",
        img: "img/mockup.png",
        chance: 25
    },
    {
        text: "កក់សក់ ឬ ដុសខ្លួន 1កញ្ចប់ ",
        img: "img/POUCH-refill-720ml-Mint-Cabbage.png",
        chance: 0
    },
    {
        text: "លាងចានក្រូចសើច 1ដប",
        img: "img/WPS Photo(2).png",
        chance: 25
    }
];

// ពណ៌ផ្នែកកង់ (មួយពណ៌ក្នុងមួយរង្វាន់) - រង្វាន់ធំប្រើពណ៌មាស
const colors = [
    "#f6f5e7",
    "#dfead8",
    "#f6f5e7",
    "#fde9a9",
    "#dfead8"
];

const FONT_FAMILY = '"Kantumruy Pro", sans-serif';
const SIZE = 400; // ទំហំគូរ
const PIXEL_RATIO = 2.5; // ឱ្យរូបច្បាស់លើអេក្រង់ទូរស័ព្ទ

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

canvas.width = SIZE * PIXEL_RATIO;
canvas.height = SIZE * PIXEL_RATIO;
ctx.scale(PIXEL_RATIO, PIXEL_RATIO);

const center = SIZE / 2;
const radius = SIZE / 2;
const arc = (Math.PI * 2) / options.length;

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

// គូររូបក្នុងប្រអប់ ដោយមិនឱ្យខូចទម្រង់
function drawImageContained(img, x, y, boxSize) {
    const scale = Math.min(boxSize / img.width, boxSize / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
}

// ឈ្មោះរង្វាន់ជាអក្សរ HTML (មិនគូរលើ canvas ទេ ព្រោះ iPhone បង្ហាញខុសកន្លែង)
const rotor = document.getElementById("wheelRotor");

options.forEach((item, i) => {
    const label = document.createElement("div");
    label.className = "wheel-label";
    label.textContent = item.text.trim();
    label.style.setProperty("--label-angle", `${(i + 0.5) * 360 / options.length}deg`);
    rotor.appendChild(label);
});

// ទំហំអក្សរតាមទំហំកង់
function updateWheelSize() {
    rotor.style.setProperty("--wheel-size", `${rotor.clientWidth}px`);
}

updateWheelSize();

if (window.ResizeObserver) {
    new ResizeObserver(updateWheelSize).observe(rotor);
} else {
    window.addEventListener("resize", updateWheelSize);
}

function drawWheel(images = []) {
    ctx.clearRect(0, 0, SIZE, SIZE);

    options.forEach((item, i) => {
        const start = i * arc - Math.PI / 2;

        // គូរផ្នែកកង់
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, start, start + arc);
        ctx.closePath();

        ctx.fillStyle = colors[i];
        ctx.fill();

        ctx.strokeStyle = "#c9d8c2";
        ctx.lineWidth = 2;
        ctx.stroke();

        // បង្វិលទៅកណ្ដាលផ្នែក - ផ្នែកខាងលើរូបបែរទៅគែមកង់
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(start + arc / 2 + Math.PI / 2);

        // រូបរង្វាន់
        if (images[i]) {
            drawImageContained(images[i], 0, -radius * 0.46, 72);
        }

        ctx.restore();
    });

    drawCenterCircle();
}

// គូររង្វង់កណ្ដាល ជាមួយឡូហ្គោ
const HUB_RADIUS = 46;
const LOGO_CROP = { x: 95, y: 85, w: 1050, h: 600 }; // កាត់គែមសរបស់ Logo.png
let logoImg = null;

function drawCenterCircle() {
    ctx.beginPath();
    ctx.arc(center, center, HUB_RADIUS, 0, Math.PI * 2);

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#188f2a";
    ctx.stroke();

    if (logoImg) {
        const w = HUB_RADIUS * 1.72;
        const h = w * LOGO_CROP.h / LOGO_CROP.w;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
            logoImg,
            LOGO_CROP.x, LOGO_CROP.y, LOGO_CROP.w, LOGO_CROP.h,
            center - w / 2, center - h / 2, w, h
        );
        return;
    }

    // បើឡូហ្គោមិនទាន់ផ្ទុក ឬផ្ទុកមិនបាន
    ctx.fillStyle = "#0b5d2b";
    ctx.font = `700 24px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LSV", center, center);
}

// គូរភ្លាមៗ រួចគូរម្ដងទៀតពេលរូបផ្ទុករួច
drawWheel();

Promise.all([
    Promise.all(options.map((item) => loadImage(item.img))),
    loadImage("Logo.png")
]).then(([images, logo]) => {
    logoImg = logo;
    drawWheel(images);
});

let spinning = false;
let hasPlayed = false;
let rotation = 0;

// ជ្រើសរង្វាន់តាមឱកាស (chance) របស់វា
function pickWinnerIndex() {
    const total = options.reduce((sum, item) => sum + item.chance, 0);
    let roll = Math.random() * total;

    for (let i = 0; i < options.length; i++) {
        roll -= options[i].chance;
        if (roll < 0) {
            return i;
        }
    }

    return options.length - 1;
}

function spin() {
    if (spinning || hasPlayed) {
        return;
    }

    spinning = true;

    const spinBtn = document.getElementById("spinBtn");

    spinBtn.disabled = true;
    spinBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>កំពុងបង្វិល...';

    const winnerIndex = pickWinnerIndex();

    const slice = 360 / options.length;
    const targetAngle = winnerIndex * slice + slice / 2;
    const finalRotation = 360 - targetAngle;

    rotation = 3600 + finalRotation;

    rotor.style.transition = "transform 5s ease-out";
    rotor.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        const prize = options[winnerIndex];

        const result = document.getElementById("result");
        result.innerHTML =
            `🎉 អបអរសាទរ! អ្នកទទួលបាន<br><b>${prize.text}</b>`;
        result.classList.remove("d-none");

        const winnerImg = document.getElementById("winnerImg");
        winnerImg.src = prize.img;
        winnerImg.alt = prize.text;

        document.getElementById("winnerText").innerHTML =
            `🎉 អ្នកទទួលបាន<br>${prize.text}`;

        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("winnerPopup")
        ).show();

        spinning = false;
        hasPlayed = true;

        spinBtn.classList.add("d-none"); // ប្រអប់លទ្ធផលជំនួសប៊ូតុង
    }, 5000);
}

document.getElementById("spinBtn").addEventListener("click", spin);