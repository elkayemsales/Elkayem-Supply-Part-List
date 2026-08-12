// Helper function to safely read field values directly
function getVal(item, keys) {
  for (let k of keys) {
    if (item[k] !== undefined && item[k] !== null) return item[k];
  }
  return "";
}

function getImageCandidatePaths(item) {
  const paths = [];

  // Direct imagePath if provided in JSON
  const directPath = getVal(item, ["imagePath", "image", "Image Path"]);
  if (directPath) {
    paths.push(directPath.replace(/\\/g, '/'));
  }

  const cust = getVal(item, ["Customer Name", "customer", "Customer"]).toString().trim();
  const partNo = getVal(item, ["Part No", "partNo", "Part Number"]).toString().trim();

  if (cust && partNo) {
    const custUpper = cust.toUpperCase();
    const custLower = cust.toLowerCase();

    // Check uppercase folder (e.g., BNC MOTORS) and exact folder casing
    paths.push(`Images/${custUpper}/${partNo}.jpg`);
    paths.push(`Images/${custUpper}/${partNo}.JPG`);
    paths.push(`Images/${custUpper}/${partNo}.png`);
    paths.push(`Images/${cust}/${partNo}.jpg`);
    paths.push(`Images/${cust}/${partNo}.JPG`);
    paths.push(`Images/${custLower}/${partNo}.jpg`);
  }

  return [...new Set(paths)];
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

  // Update total items count in top badge
  const totalBadge = document.querySelector(".total-badge") || document.getElementById("totalItems");
  if (totalBadge) totalBadge.textContent = `Total Items: ${list.length}`;

  list.forEach(p => {
    const cust = getVal(p, ["Customer Name", "customer", "Customer"]) || "N/A";
    const partNo = getVal(p, ["Part No", "partNo", "Part Number"]) || "-";
    const partName = getVal(p, ["Part Name", "partName", "Part Description"]) || "-";
    const model = getVal(p, ["Model", "model"]);
    const location = getVal(p, ["Location", "location"]);

    const paths = getImageCandidatePaths(p);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-customer">${cust}</div>
      ${model ? `<div class="card-model">Model: ${model}</div>` : ""}
      <div class="card-img-container">
        <img class="card-image" 
             src="${paths[0] || ''}" 
             data-attempts='${JSON.stringify(paths.slice(1))}'
             data-index="0"
             onerror="tryNextImage(this)"
             onclick="if(window.openZoom) openZoom(this.src)"
             alt="${partNo}">
      </div>
      <div class="info">
        <h4 style="margin: 8px 0 4px; font-size: 15px;">${partNo}</h4>
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
