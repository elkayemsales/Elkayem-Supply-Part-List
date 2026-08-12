function buildSideNav() {
  const navBar = document.getElementById("navBar");
  if (!navBar) return;
  navBar.innerHTML = "";

  const counts = {};
  partsData.forEach(p => {
    const cust = p["Customer Name"] || "OTHER";
    counts[cust] = (counts[cust] || 0) + 1;
  });

  // "ALL PARTS" Button
  const allBtn = document.createElement("button");
  allBtn.className = `nav-item ${activeCustomer === null ? "active" : ""}`;
  allBtn.innerHTML = `<span class="nav-label">ALL PARTS</span><span class="badge">${partsData.length}</span>`;
  allBtn.onclick = () => filterByCustomer(null);
  navBar.appendChild(allBtn);

  // Customer Category Buttons
  Object.keys(counts).sort().forEach(cust => {
    const btn = document.createElement("button");
    btn.className = `nav-item ${activeCustomer === cust ? "active" : ""}`;
    btn.innerHTML = `<span class="nav-label">${cust}</span><span class="badge">${counts[cust]}</span>`;
    btn.onclick = () => filterByCustomer(cust);
    navBar.appendChild(btn);
  });
}