function getImageCandidatePaths(item) {
  const paths = [];

  // 1. First priority: Use the direct imagePath property if available
  if (item.imagePath) {
    paths.push(item.imagePath);
    paths.push(item.imagePath.replace(/\\/g, '/')); // convert backslashes if any
  }

  // 2. Extract fields for dynamic lookup
  const cust = (getFieldValue(item, 'customer') || "").toString().trim();
  const partNo = (getFieldValue(item, 'partNo') || "").toString().trim();

  if (cust && partNo) {
    const custUpper = cust.toUpperCase();
    const custLower = cust.toLowerCase();

    // Common file extension and folder case variations for GitHub Pages
    paths.push(`Images/${cust}/${partNo}.jpg`);
    paths.push(`Images/${cust}/${partNo}.JPG`);
    paths.push(`Images/${custUpper}/${partNo}.jpg`);
    paths.push(`Images/${custUpper}/${partNo}.JPG`);
    paths.push(`Images/${custUpper}/${partNo}.png`);
    paths.push(`Images/${custLower}/${partNo}.jpg`);
  }

  // Return unique paths
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
    const cust = getFieldValue(p, 'customer') || "N/A";
    const partNo = getFieldValue(p, 'partNo') || "-";
    const partName = getFieldValue(p, 'partName') || "-";
    const model = getFieldValue(p, 'model');
    const location = getFieldValue(p, 'location');

    const paths = getImageCandidatePaths(p);

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
