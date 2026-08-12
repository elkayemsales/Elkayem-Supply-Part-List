let activeCustomer = null;

function filterByCustomer(cust) {
  activeCustomer = cust;
  const title = document.getElementById("headerTitle");
  if (title) title.textContent = cust ? cust.toUpperCase() : "ELKAYEM - ALL PARTS";
  buildSideNav();
  applySearchAndFilter();
}

function applySearchAndFilter() {
  const searchInput = document.getElementById("searchInput");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  
  const filtered = partsData.filter(p => {
    const matchesCust = activeCustomer === null || p["Customer Name"] === activeCustomer;
    const matchesSearch = !query || 
      (p["Part Name"] && p["Part Name"].toLowerCase().includes(query)) ||
      (p["Part No"] && p["Part No"].toLowerCase().includes(query)) ||
      (p["Model"] && p["Model"].toLowerCase().includes(query));
    return matchesCust && matchesSearch;
  });
  
  renderCards(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  buildSideNav();
  renderCards(partsData);

  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.addEventListener("input", applySearchAndFilter);

  const toggleBtn = document.getElementById("toggleNav");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.getElementById("navBar")?.classList.toggle("open");
      document.querySelector(".main-content")?.classList.toggle("shifted");
    });
  }

  const exportBtn = document.getElementById("exportAllDetailsBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportToPdf);

  const zoomClose = document.getElementById("zoomCloseBtn");
  if (zoomClose) zoomClose.addEventListener("click", closeZoom);
});