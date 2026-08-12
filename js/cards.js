function getImageCandidatePaths(customer, partNum) {
  const folder = (customer || "").trim();
  const cleanPart = (partNum || "").trim();

  return [
    `./Images/${folder}/${folder}${cleanPart}.JPG`,
    `./Images/${folder}/${folder} ${cleanPart}.JPG`,
    `./Images/${folder}/${cleanPart}.JPG`,
    `./Images/${folder}/${folder}${cleanPart}.jpg`,
    `./Images/${folder}/${cleanPart}.jpg`,
    `./Images/${folder}/${cleanPart}.png`
  ];
}

function renderCards(list) {
  const container = document.getElementById("partsContainer");
  if (!container) return;
  container.innerHTML = "";

  const noData = document.getElementById("noData");
  if (list.length === 0) {
    if (noData) noData.classList.remove("hidden");
    return;
  }
  if (noData) noData.classList.add("hidden");

  list.forEach(p => {
    const cust = p["Customer Name"] || p["Customer"] || "N/A";
    const partNo = p["Part No"] || p["Part Number"] || p["PartNo"] || "-";
    const partName = p["Part Name"] || p["Description"] || "-";
    const model = p["Model"] || "";
    const location = p["Location"] || "";

    const paths = getImageCandidatePaths(cust, partNo);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-customer">${cust}</div>
      ${model ? `<div class="card-model">Model: ${model}</div>` : ""}
      <div class="card-img-container">
        <img class="card-image" 
             src="${paths[0]}" 
             data-attempts='${JSON.stringify(paths.slice(1))}'
             data-index="0"
             onerror="tryNextImage(this)"
             onclick="if(window.openZoom) openZoom(this.src)"
             alt="${partNo}">
      </div>
      <div class="info">
        <h4 style="margin: 8px 0 4px; font-size: 16px;">${partNo}</h4>
        <p style="margin: 0 0 8px; color: #555; font-size: 13px;">${partName}</p>
        ${location ? `<div style="font-size: 11px; background: #f0f0f0; display: inline-block; padding: 2px 6px; border-radius: 4px;">${location}</div>` : ""}
      </div>
    `;
    container.appendChild(card);
  });
}

function tryNextImage(img) {
  const attempts = JSON.parse(img.getAttribute('data-attempts') || '[]');
  const idx = parseInt(img.getAttribute('data-index') || '0');

  if (idx < attempts.length) {
    img.setAttribute('data-index', idx + 1);
    img.src = attempts[idx];
  } else {
    img.onerror = null;
    img.parentElement.innerHTML = '<div style="color:#aaa;font-size:12px;padding:30px 10px;text-align:center;background:#f9f9f9;">No Image</div>';
  }
}