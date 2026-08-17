// Dynamically inject blinking animation style into the document
if (!document.getElementById("blinking-image-style")) {
  const style = document.createElement("style");
  style.id = "blinking-image-style";
  style.innerHTML = `
    @keyframes pulseBlink {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.98); }
      100% { opacity: 1; transform: scale(1); }
    }
    .blinking-part-box {
      animation: pulseBlink 1.2s ease-in-out infinite;
      color: #d32f2f;
      font-weight: bold;
      font-size: 15px;
      letter-spacing: 0.5px;
      text-align: center;
      padding: 10px;
      word-break: break-all;
    }
  `;
  document.head.appendChild(style);
}

// Helper function to safely read field values with fallback keys
function getVal(item, keys) {
  if (!item) return "";
  for (let k of keys) {
    if (item[k] !== undefined && item[k] !== null) return item[k];
  }
  return "";
}

// Alias to prevent ReferenceError if main.js calls getFieldValue
function getFieldValue(item, field) {
  if (!item) return "";
  const mapping = {
    'customer': ["Customer Name", "customer", "Customer", "CUSTOMER"],
    'partNo': ["Part No", "partNo", "Part Number", "PART NO"],
    'partName': ["Part Name", "partName", "Part Description", "PART NAME"],
    'model': ["Model", "model", "MODEL"],
    'location': ["Location", "location", "LOCATION"]
  };
  return getVal(item, mapping[field] || [field]);
}

function getImageCandidatePaths(item) {
  const paths = [];

  const directPath = getVal(item, ["imagePath", "image", "Image Path"]);
  if (directPath) {
    const cleanPath = directPath.replace(/\\/g, '/');
    paths.push(cleanPath);
    if (!cleanPath.startsWith("Images/")) {
      paths.push(`Images/${cleanPath}`);
    }
  }

  const cust = getVal(item, ["Customer Name", "customer", "Customer"]).toString().trim();
  const partNo = getVal(item, ["Part No", "partNo", "Part Number"]).toString().trim();

  if (cust && partNo) {
    const custUpper = cust.toUpperCase();

    // 1. Matches your exact folder structure: Images/AMPERE GROUP/AMPERE GROUPBFMCP00001.JPG
    paths.push(`Images/${custUpper}/${custUpper}${partNo}.JPG`);
    paths.push(`Images/${custUpper}/${custUpper}${partNo}.jpg`);
    paths.push(`Images/${cust}/${cust}${partNo}.jpg`);
    paths.push(`Images/${cust}/${cust}${partNo}.JPG`);

    // 2. Standard pattern fallback: Images/AMPERE GROUP/BFMCP00001.jpg
    paths.push(`Images/${custUpper}/${partNo}.jpg`);
    paths.push(`Images/${custUpper}/${partNo}.JPG`);
    paths.push(`Images/${cust}/${partNo}.jpg`);
    paths.push(`Images/${custUpper}/${partNo}.png`);

    // 3. Root folder fallbacks
    paths.push(`${custUpper}/${custUpper}${partNo}.jpg`);
    paths.push(`${custUpper}/${partNo}.jpg`);
  }

  return [...new Set(paths)];
}

function renderCards(list) {
  const container = document.getElementById("partsContainer") || 
                    document.getElementById("cardsContainer") || 
                    document.getElementById("partsGrid") ||
                    document.querySelector(".cards-grid") ||
                    document.querySelector(".grid-container");

  if (!container) return;
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = '<div style="padding:40px; text-align:center; color:#666; width:100%;">No matching parts found</div>';
    return;
  }

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
      <div class="card-img-container" style="height:160px; background:#f9f9f9; display:flex; align-items:center; justify-content:center; overflow:hidden; border-radius:4px; margin-bottom:8px;">
        <img src="${paths[0] || ''}" 
             data-attempts='${JSON.stringify(paths.slice(1))}'
             data-index="0"
             data-partno="${partNo}"
             onerror="tryNextImage(this)"
             onclick="if(window.openZoom) openZoom(this.src)"
             style="max-height:100%; max-width:100%; object-fit:contain; cursor:pointer;"
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
  const partNo = img.getAttribute('data-partno') || 'NO IMAGE';

  if (idx < attempts.length) {
    img.setAttribute('data-index', idx + 1);
    img.src = attempts[idx];
  } else {
    img.onerror = null;
    // Replace missing image with blinking Part Number text
    img.parentElement.innerHTML = `<div class="blinking-part-box">${partNo}</div>`;
  }
}