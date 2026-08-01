const options = [{
        text: "សូមអរគុណ🙏",
        img: "img/thank.jpg"
    },
    {
        text: "លើកទឹកចិត្ត",
        img: "img/susu.png"
    },
    {
        text: "ផ្ការំដួល 60ml",
        img: "img/Pouch-spout-60ml-Rumdoul-Cabbage.png"
    },
    {
        text: "ជីអង្កាម 60ml",
        img: "img/Pouch-spout-60ml-Mint-Cabbage.png"
    }
];

const colors = [
    "#f6f5e7",
    "#dfead8",
    "#f6f5e7",
    "#dfead8"
];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const center = canvas.width / 2;
const radius = canvas.width / 2;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const arc = (Math.PI * 2) / options.length;

    options.forEach((item, i) => {
        const start = i * arc - Math.PI / 2;
        const end = start + arc;

        // គូរផ្នែកកង់
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, start, end);
        ctx.closePath();

        ctx.fillStyle = colors[i];
        ctx.fill();

        ctx.strokeStyle = "#d7d7d7";
        ctx.lineWidth = 2;
        ctx.stroke();

        const angle = start + arc / 2;

        const img = new Image();
        img.src = item.img;

        img.onload = function() {
            ctx.save();

            ctx.translate(center, center);
            ctx.rotate(angle);

            // រូបរង្វាន់
            ctx.drawImage(
                img,
                radius * 0.38, -25,
                50,
                50
            );

            // អក្សររង្វាន់
            ctx.save();
            ctx.translate(radius * 0.72, 0);
            ctx.rotate(Math.PI / 2);

            ctx.fillStyle = "#2d572c";
            ctx.font = "bold 15px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(item.text, 0, 0);

            ctx.restore();
            ctx.restore();

            drawCenterCircle();
        };
    });

    drawCenterCircle();
}

// គូររង្វង់កណ្ដាល
function drawCenterCircle() {
    ctx.beginPath();
    ctx.arc(center, center, 55, 0, Math.PI * 2);

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = "#2ea52c";
    ctx.stroke();

    ctx.fillStyle = "#e11d48";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LSV", center, center);
}

drawWheel();

let spinning = false;
let hasPlayed = false;
let rotation = 0;

function spin() {
    if (spinning || hasPlayed) {
        alert("អ្នកបានបង្វិលរួចហើយ!");
        return;
    }

    spinning = true;

    const wheel = document.getElementById("wheel");
    const spinBtn = document.getElementById("spinBtn");

    /*
    ================================
    1% ឈ្នះផលិតផល
    Index 2 និង Index 3

    99% ទទួលបាន
    Index 0 និង Index 1
    ================================
    */

    const randomNumber = Math.random() * 100;
    let winnerIndex;

    if (randomNumber < 50) {
        // 1% ឈ្នះផលិតផល
        const productPrizes = [2, 3];

        winnerIndex =
            productPrizes[
                Math.floor(Math.random() * productPrizes.length)
            ];
    } else {
        // 99% សូមអរគុណ ឬ លើកទឹកចិត្ត
        const normalPrizes = [0, 1];

        winnerIndex =
            normalPrizes[
                Math.floor(Math.random() * normalPrizes.length)
            ];
    }

    const slice = 360 / options.length;
    const targetAngle = winnerIndex * slice + slice / 2;
    const finalRotation = 360 - targetAngle;

    rotation = 3600 + finalRotation;

    wheel.style.transition = "transform 5s ease-out";
    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        const prize = options[winnerIndex];

        document.getElementById("result").innerHTML =
            `🎉 អបអរសាទរ! អ្នកទទួលបាន <b>${prize.text}</b>`;

        document.getElementById("winnerImg").src = prize.img;

        document.getElementById("winnerText").innerText =
            `🎉 អ្នកទទួលបាន ${prize.text}`;

        document.getElementById("winnerPopup").style.display =
            "flex";

        spinning = false;
        hasPlayed = true;

        if (spinBtn) {
            spinBtn.disabled = true;
            spinBtn.innerText = "បានបង្វិលរួច";
        }
    }, 5000);
}

// បិទ Popup
function closePopup() {
    document.getElementById("winnerPopup").style.display = "none";
}