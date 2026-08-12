async function exportToPdf() {
  const { jsPDF } = window.jspdf;
  const container = document.getElementById("partsContainer");
  if (!container) return;
  
  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Elkayem_Parts_${activeCustomer || "All"}.pdf`);
  } catch (err) {
    console.error("PDF Export error:", err);
  }
}