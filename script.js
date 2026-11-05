// chance = ឱកាសឈ្នះជាភាគរយ (បូកសរុបគួរស្មើ 100)
const options = [{
        text: "កក់សក់ស្ពៃ 35មល ",
        img: "img/Pouch-spout-shampoo-35ml.png",
        chance: 23.75
    },
    {
        text: "ដុសខ្លួនស្ពៃរំដួល 60មល ",
        img: "img/Pouch-spout-60ml-Rumdoul-Cabbage.png",
        chance: 23.75
    },
    {
        text: "លាងចានម្នាស់ 180មល",
        img: "img/mockup.png",
        chance: 23.75
    },
    {
        text: "កក់សក់ ឬ ដុសខ្លួន refill ",
        img: "img/POUCH-refill-720ml-Mint-Cabbage.png",
        chance: 5
    },
    {
        text: "លាងចានក្រូចសើច180មល",
        img: "img/WPS Photo(2).png",
        chance: 23.75
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

const LABEL_MAX_FONT = 19;
const LABEL_MIN_FONT = 15;

function setLabelFont(fontSize) {
    ctx.font = `700 ${fontSize}px ${FONT_FAMILY}`;
}

// ទំហំអក្សរធំបំផុតដែលសមនឹងផ្នែកកង់
function largestFont(lines, maxWidth, minFont) {
    let fontSize = LABEL_MAX_FONT;
    while (fontSize > minFont) {
        setLabelFont(fontSize);
        if (lines.every((line) => ctx.measureText(line).width <= maxWidth)) {
            break;
        }
        fontSize -= 0.5;
    }
    return fontSize;
}

// ចែកឈ្មោះវែងជាពីរបន្ទាត់ - នៅចន្លោះពាក្យជិតកណ្ដាលបំផុត ឬមុនលេខ
function splitLabel(text) {
    const middle = text.length / 2;
    let breakAt = -1;

    for (let i = 0; i < text.length; i++) {
        if (text[i] === " " && (breakAt < 0 || Math.abs(i - middle) < Math.abs(breakAt - middle))) {
            breakAt = i;
        }
    }

    if (breakAt >= 0) {
        return [text.slice(0, breakAt), text.slice(breakAt + 1)];
    }

    const digit = text.search(/\d/);
    return digit > 0 ? [text.slice(0, digit), text.slice(digit)] : [text];
}

// ប្រើមួយបន្ទាត់បើអក្សរនៅធំល្មម បើមិនដូច្នោះទេប្រើពីរបន្ទាត់
function layoutLabel(text, maxWidth) {
    const oneLine = [text];
    const fontSize = largestFont(oneLine, maxWidth, LABEL_MIN_FONT);
    setLabelFont(fontSize);

    if (ctx.measureText(text).width <= maxWidth) {
        return { lines: oneLine, fontSize };
    }

    const lines = splitLabel(text);
    return { lines, fontSize: largestFont(lines, maxWidth, 12) };
}

function drawWheel(images = []) {
    ctx.clearRect(0, 0, SIZE, SIZE);

    const textRadius = radius * 0.86;
    const maxTextWidth = 2 * textRadius * Math.sin(arc / 2) * 0.88;

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

        // បង្វិលទៅកណ្ដាលផ្នែក - ផ្នែកខាងលើរូប/អក្សរបែរទៅគែមកង់
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(start + arc / 2 + Math.PI / 2);

        const label = layoutLabel(item.text.trim(), maxTextWidth);
        const twoLines = label.lines.length > 1;

        // រូបរង្វាន់ - តូចជាងបន្តិច បើឈ្មោះមានពីរបន្ទាត់
        if (images[i]) {
            drawImageContained(
                images[i],
                0, -radius * (twoLines ? 0.5 : 0.56),
                twoLines ? 74 : 92
            );
        }

        // អក្សររង្វាន់
        ctx.fillStyle = "#1f4d2a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        setLabelFont(label.fontSize);
        label.lines.forEach((line, lineIndex) => {
            ctx.fillText(line, 0, -textRadius + lineIndex * label.fontSize * 1.2);
        });

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

// គូរភ្លាមៗ រួចគូរម្ដងទៀតពេលរូប និងពុម្ពអក្សរផ្ទុករួច
drawWheel();

const fontReady = document.fonts ?
    document.fonts.load(`700 16px ${FONT_FAMILY}`, "កLSV").catch(() => {}) :
    Promise.resolve();

Promise.all([
    Promise.all(options.map((item) => loadImage(item.img))),
    loadImage("Logo.png"),
    fontReady
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

    const wheel = document.getElementById("wheel");
    const spinBtn = document.getElementById("spinBtn");

    spinBtn.disabled = true;
    spinBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>កំពុងបង្វិល...';

    const winnerIndex = pickWinnerIndex();

    const slice = 360 / options.length;
    const targetAngle = winnerIndex * slice + slice / 2;
    const finalRotation = 360 - targetAngle;

    rotation = 3600 + finalRotation;

    wheel.style.transition = "transform 5s ease-out";
    wheel.style.transform = `rotate(${rotation}deg)`;

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