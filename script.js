// Load header and footer dynamically
document.addEventListener("DOMContentLoaded", () => {
  // Load Header
  fetch("partials/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    });

  // Load Footer
  fetch("partials/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });
});
