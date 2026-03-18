// 🔥 CONFIGURATION DU CADRE
const FRAME = {
  x: 600,
  y: 255,
  w: 410,
  h: 460,
  r: 20
};

let currentImage = null;

// 🔥 loader
function showLoader(show) {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = show ? "flex" : "none";
}

// 🔥 Upload + preview automatique
document.getElementById("upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    currentImage = img;
    generate(); // 🔥 preview direct (plus besoin de bouton)
  };
});

// 🔥 Génération
function generate() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  if (!currentImage) return;

  showLoader(true);

  const bg = new Image();
  bg.src = 'template.png';

  bg.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, 1080, 1080);

    const userImg = currentImage;

    const scale = Math.max(
      FRAME.w / userImg.width,
      FRAME.h / userImg.height
    );

    const newW = userImg.width * scale;
    const newH = userImg.height * scale;

    const posX = FRAME.x + (FRAME.w - newW) / 2;
    const posY = FRAME.y + (FRAME.h - newH) / 2;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(FRAME.x + FRAME.r, FRAME.y);
    ctx.lineTo(FRAME.x + FRAME.w - FRAME.r, FRAME.y);
    ctx.quadraticCurveTo(FRAME.x + FRAME.w, FRAME.y, FRAME.x + FRAME.w, FRAME.y + FRAME.r);
    ctx.lineTo(FRAME.x + FRAME.w, FRAME.y + FRAME.h - FRAME.r);
    ctx.quadraticCurveTo(FRAME.x + FRAME.w, FRAME.y + FRAME.h, FRAME.x + FRAME.w - FRAME.r, FRAME.y + FRAME.h);
    ctx.lineTo(FRAME.x + FRAME.r, FRAME.y + FRAME.h);
    ctx.quadraticCurveTo(FRAME.x, FRAME.y + FRAME.h, FRAME.x, FRAME.y + FRAME.h - FRAME.r);
    ctx.lineTo(FRAME.x, FRAME.y + FRAME.r);
    ctx.quadraticCurveTo(FRAME.x, FRAME.y, FRAME.x + FRAME.r, FRAME.y);
    ctx.closePath();

    ctx.clip();

    ctx.drawImage(userImg, posX, posY, newW, newH);

    ctx.restore();

    showLoader(false);
  };

  bg.onerror = () => {
    showLoader(false);
    alert("Erreur chargement du template !");
  };
}

// 🔥 Télécharger
function download() {
  const canvas = document.getElementById('canvas');

  const link = document.createElement('a');
  link.download = 'fonafis.png';
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// 🔥 PARTAGE MOBILE (WhatsApp inclus)
async function shareImage() {
  const canvas = document.getElementById('canvas');

  canvas.toBlob(async (blob) => {
    const file = new File([blob], "fonafis.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "FONAFIS 2026",
        text: "Je participe au FONAFIS 🚀"
      });
    } else {
      alert("Partage non supporté sur ce téléphone");
    }
  });
}

// 🔥 boutons
document.getElementById("btnGenerate")?.addEventListener("click", generate);
document.getElementById("btnDownload")?.addEventListener("click", download);
document.getElementById("btnShare")?.addEventListener("click", shareImage);