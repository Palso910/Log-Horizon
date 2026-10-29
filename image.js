// Redimensionne une image dans le navigateur avant l'envoi.
// - photo (défaut) : JPEG, max 1400 px, fond sombre (évite les photos de 8 Mo)
// - logo : PNG avec transparence conservée, max 600 px
export function resizeImage(file, opts = {}) {
  const { maxDim = 1400, quality = 0.82, type = "image/jpeg" } = opts;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (type === "image/jpeg") {
        ctx.fillStyle = "#0b1020"; // fond pour les PNG transparents
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Conversion impossible"))),
        type,
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image illisible"));
    };
    img.src = url;
  });
}
