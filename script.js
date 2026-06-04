const options = [{
        text: "សាប៊ូលាងចាន",
        img: "img/mockup.png"
    },
    {
        text: "រង្វាន់ធំ",
        img: "img/big.jpg"
    },
    {
        text: "សាប៊ូដុសខ្លួន",
        img: "img/POUCH-REFILL_Shampoo-450ml.png"
    },
    {
        text: "សាប៊ូកក់សក់",
        img: "img/Pouch-spout-60ml-Mint-Cabbage.png"
    },
    {
        text: "រង្វាន់ធំ",
        img: "img/big.jpg"
    },
    {
        text: "សាប៊ូលាងចាន",
        img: "img/mockup.png"
    },
    {
        text: "សាប៊ូដុសខ្លួន",
        img: "img/POUCH-REFILL_Shampoo-450ml.png"
    },
    {
        text: "សាប៊ូកក់សក់",
        img: "img/Pouch-spout-60ml-Mint-Cabbage.png"
    }
];

const colors = [
    "#f6f5e7",
    "#dfead8",
    "#f6f5e7",
    "#dfead8",
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

        // Slice
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, start, end);
        ctx.closePath();

        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        ctx.strokeStyle = "#d7d7d7";
        ctx.lineWidth = 2;
        ctx.stroke();

        const angle = start + arc / 2;

        const img = new Image();
        img.src = item.img;

        img.onload = () => {

            ctx.save();

            ctx.translate(center, center);
            ctx.rotate(angle);

            // Image
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            ctx.drawImage(
                img,
                radius * 0.42, -25,
                50,
                50
            );

            // Text
            ctx.save();
            ctx.translate(radius * 0.72, 0);
            ctx.rotate(Math.PI / 2);

            ctx.fillStyle = "#2d572c";
            ctx.font = "bold 15px Arial";
            ctx.textAlign = "center";

            ctx.fillText(item.text, 0, 0);

            ctx.restore();
            ctx.restore();
        };
    });

    // Center Circle
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

    // Spin បានតែម្តង
    if (spinning || hasPlayed) {
        alert("អ្នកបានបង្វិលរួចហើយ!");
        return;
    }

    spinning = true;

    const wheel = document.getElementById("wheel");
    const spinBtn = document.getElementById("spinBtn");

    const randomDegree = Math.floor(Math.random() * 360);

    rotation += 3600 + randomDegree;

    wheel.style.transition = "transform 5s ease-out";
    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {

        const degree = rotation % 360;
        const slice = 360 / options.length;

        const winnerIndex =
            Math.floor(((360 - degree) % 360) / slice);

        document.getElementById("result").innerHTML =
            `🎉 អបអរសាទរ! អ្នកទទួលបាន <b>${options[winnerIndex].text}</b>`;

        spinning = false;
        hasPlayed = true;

        // Disable Button
        if (spinBtn) {
            spinBtn.disabled = true;
            spinBtn.innerText = "បានបង្វិលរួច";
        }

    }, 5000);
}