function openZoom(imgSrc) {
  const modal = document.getElementById("zoomPreview");
  const canvas = document.getElementById("zoomCanvas");
  if (!modal || !canvas) return;

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    modal.classList.add("active");
    modal.classList.remove("hidden");
  };
  img.src = imgSrc;
}

function closeZoom() {
  const modal = document.getElementById("zoomPreview");
  if (modal) {
    modal.classList.remove("active");
    modal.classList.add("hidden");
  }
}