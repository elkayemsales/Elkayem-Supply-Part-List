// Helper function to safely read field values
function getVal(item, keys) {
  if (!item) return "";
  for (let k of keys) {
    if (item[k] !== undefined && item[k] !== null) return item[k];
  }
  return "";
}

function getImageCandidatePaths(item) {
  const paths = [];

  const directPath = getVal(item, ["imagePath", "image", "Image Path"]);
  if (directPath) {
    paths.push(directPath.replace(/\\/g, '/'));
  }

  const cust = getVal(item, ["Customer Name", "customer", "Customer"]).toString().trim();
  const partNo = getVal(item, ["Part No", "partNo", "Part Number"]).toString().trim();

  if (cust && partNo) {
    const custUpper = cust.toUpperCase();
    const custLower = cust.toLowerCase();

    // Folders directly in root vs Images subfolder
    paths.push(`${custUpper}/${partNo}.jpg`);
    paths.push(`${custUpper}/${partNo}.JPG`);
    paths.push(`${cust}/${partNo}.jpg`);
    paths.push(`Images/${custUpper}/${partNo}.jpg`);
    paths.push(`Images/${custUpper}/${partNo}.JPG`);
    paths.push(`Images/${cust}/${partNo}.jpg`);
  }

  return [...new Set(paths)];
}

function renderCards(list) {
  // Automatically find container by trying common ID names
  const container = document.getElementById("partsContainer") || 
                    document.getElementById("cardsContainer") || 
                    document.getElementById("partsGrid") ||
                    document.querySelector(".cards-grid") ||
                    document.querySelector(".grid-container");

  if (!container) {
    console.error("ERROR: Could not find HTML container element for cards. Check your index.html div ID.");
    return;
  }

  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = '<div style="padding:40px; text-align:center; color:#666;">No matching parts found</div>';
    return;
  }

  // Update total count badge if present
  const totalBadge = document.querySelector(".total-badge") || document.getElementById("totalItems");
  if (totalBadge) totalBadge.textContent = `Total Items: ${list.length}`;

  list.forEach(p => {
    const cust = getVal(p, ["Customer Name", "customer", "Customer"]) || "N/A";
    const partNo = getVal(p, ["Part No", "partNo", "Part Number"]) || "-";
    const partName = getVal(p, ["Part Name", "partName", "Part Description"]) || "-";
    const model = getVal(p, ["Model", "model"]);

    const paths = getImageCandidatePaths(p);

    const card = document.createElement("div");
    card.className = "card";
    card.style.cssText = "background:#fff; border-radius:8px; padding:12px; border:1px solid #e0e0e0; box-shadow:0 2px 4px rgba(0,0,0,0.05);";
    
    card.innerHTML = `
      <div style="font-weight:bold; color:#0d47a1; font-size:13px;">${cust}</div>
      ${model ? `<div style="font-size:12px; color:#666; margin-bottom:8px;">Model: ${model}</div>` : ""}
      <div style="height:160px; background:#f9f9f9; display:flex; align-items:center; justify-content:center; overflow:hidden; border-radius:4px; margin-bottom:8px;">
        <img src="${paths[0] || ''}" 
             data-attempts='${JSON.stringify(paths.slice(1))}'
             data-index="0"
             onerror="tryNextImage(this)"
             style="max-height:100%; max-width:100%; object-fit:contain;"
             alt="${partNo}">
      </div>
      <div>
        <h4 style="margin:4px 0; font-size:14px; font-weight:bold;">${partNo}</h4>
        <p style="margin:0; color:#555; font-size:12px;">${partName}</p>
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
    img.parentElement.innerHTML = '<span style="color:#aaa; font-size:12px;">No Image</span>';
  }
}
