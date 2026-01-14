function toggleUserMenu() {
  const menu = document.getElementById("userDropdown");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (e) {
  const userMenu = document.querySelector(".user-menu");
  if (userMenu && !userMenu.contains(e.target)) {
    document.getElementById("userDropdown").style.display = "none";
  }
});
