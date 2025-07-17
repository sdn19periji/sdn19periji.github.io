document.getElementById("bootstrapForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Mencegah pengiriman default

  // Mengambil data dari formulir
  const formData = new FormData(this);

  // Mengirim data menggunakan fetch
  fetch("https://docs.google.com/forms/d/e/1FAIpQLScnnGg4B_rBvi7yLSg_2Rbts3_Q_SAXkt41iBlMi6xwdxGzvA/formResponse", {
    method: "POST",
    body: formData,
    mode: "no-cors" // Menghindari masalah CORS
  })
  .then(() => {
    // Menampilkan pesan konfirmasi atau mengarahkan ke halaman Terima Kasih
    window.location.href = "/terimakasih.html"; // Ganti dengan URL halaman Terima Kasih Anda
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Ada masalah saat mengirim pesan. Silakan coba lagi.");
  });
});