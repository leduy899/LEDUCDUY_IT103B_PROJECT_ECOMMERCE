// 1. Chuyển đổi giữa các tab
const switchTab = (tabName) => {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-tab") === tabName) {
      item.classList.add("active");
    }
  });

  const sections = document.querySelectorAll(".view-section");
  sections.forEach((section) => {
    section.style.display = "none";
  });

  const targetSection = document.getElementById(`${tabName}-view`);
  if (targetSection) targetSection.style.display = "block";
};

// 2. Mở/Đóng menu Logout
const toggleLogoutMenu = (event) => {
  event.stopPropagation();
  const menu = document.getElementById("logoutMenu");
  if (menu) menu.classList.toggle("show");
};

document.addEventListener("click", (e) => {
  const menu = document.getElementById("logoutMenu");
  if (menu && menu.classList.contains("show")) {
    menu.classList.remove("show");
  }
});

const handleLogout = () => {
  alert("Bạn đã đăng xuất thành công!");
  document.getElementById("logoutMenu").classList.remove("show");
};

// 3. Xử lý Lọc & Tìm kiếm cho Bảng
const filterTable = (tableBodyId, statusFilterId, searchInputId) => {
  const statusFilter = document.getElementById(statusFilterId);
  const searchInput = document.getElementById(searchInputId);
  const tableBody = document.getElementById(tableBodyId);

  if (!statusFilter || !searchInput || !tableBody) return;

  const statusVal = statusFilter.value;
  const searchVal = searchInput.value.toLowerCase().trim();
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const rowStatus = row.getAttribute("data-status");
    const nameCell = row.querySelector(".item-name");
    const itemName = nameCell ? nameCell.textContent.toLowerCase() : "";

    const isStatusMatch = statusVal === "all" || rowStatus === statusVal;
    const isSearchMatch = itemName.includes(searchVal);

    row.style.display = isStatusMatch && isSearchMatch ? "" : "none";
  });
};

document
  .getElementById("catStatusFilter")
  ?.addEventListener("change", () =>
    filterTable("categoryTableBody", "catStatusFilter", "catSearchInput"),
  );
document
  .getElementById("catSearchInput")
  ?.addEventListener("input", () =>
    filterTable("categoryTableBody", "catStatusFilter", "catSearchInput"),
  );
document
  .getElementById("prodStatusFilter")
  ?.addEventListener("change", () =>
    filterTable("productTableBody", "prodStatusFilter", "prodSearchInput"),
  );
document
  .getElementById("prodSearchInput")
  ?.addEventListener("input", () =>
    filterTable("productTableBody", "prodStatusFilter", "prodSearchInput"),
  );

// 4. Xử lý Phân trang
const setupPagination = (paginationId) => {
  const paginationContainer = document.getElementById(paginationId);
  if (!paginationContainer) return;

  const pageButtons = paginationContainer.querySelectorAll(".page-number");
  pageButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      paginationContainer
        .querySelector(".page-number.active")
        ?.classList.remove("active");
      btn.classList.add("active");
    });
  });
};

setupPagination("catPagination");
setupPagination("prodPagination");

// 5. Xử lý Modal & Validate
const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    const errorGroups = modal.querySelectorAll(".has-error");
    errorGroups.forEach((group) => group.classList.remove("has-error"));
  }
};

// Modal Danh mục
const openCategoryModal = (mode) => {
  const modalTitle = document.getElementById("categoryModalTitle");
  const submitBtn = document.getElementById("categorySubmitBtn");
  const codeInput = document.getElementById("catCodeInput");
  const nameInput = document.getElementById("catNameInput");

  if (!modalTitle || !submitBtn || !codeInput || !nameInput) return; // Bảo vệ lỗi null

  codeInput.value = "";
  nameInput.value = "";
  document.getElementById("catCodeGroup").classList.remove("has-error");
  document.getElementById("catNameGroup").classList.remove("has-error");

  if (mode === "add") {
    modalTitle.innerText = "Thêm mới danh mục";
    submitBtn.innerText = "Thêm";
    submitBtn.onclick = () => validateAndSubmitCategory("add");
  } else if (mode === "edit") {
    modalTitle.innerText = "Cập nhật danh mục";
    submitBtn.innerText = "Lưu";
    submitBtn.onclick = () => validateAndSubmitCategory("edit");
    codeInput.value = "DM001";
    nameInput.value = "Quần áo";
  }

  document.getElementById("categoryModalOverlay").style.display = "flex";
};

const validateAndSubmitCategory = (mode) => {
  const codeInputVal = document.getElementById("catCodeInput").value.trim();
  const nameInputVal = document.getElementById("catNameInput").value.trim();
  let isValid = true;

  if (codeInputVal === "") {
    document.getElementById("catCodeGroup").classList.add("has-error");
    isValid = false;
  } else document.getElementById("catCodeGroup").classList.remove("has-error");

  if (nameInputVal === "") {
    document.getElementById("catNameGroup").classList.add("has-error");
    isValid = false;
  } else document.getElementById("catNameGroup").classList.remove("has-error");

  if (isValid) {
    alert(
      mode === "add"
        ? "Thêm mới danh mục thành công!"
        : "Cập nhật danh mục thành công!",
    );
    closeModal("categoryModalOverlay");
  }
};

// Modal Sản phẩm
const openProductModal = (mode) => {
  const modalTitle = document.getElementById("productModalTitle");
  const submitBtn = document.getElementById("productSubmitBtn");
  const codeInput = document.getElementById("prodCodeInput");
  const nameInput = document.getElementById("prodNameInput");

  if (!modalTitle || !submitBtn || !codeInput || !nameInput) return; // Bảo vệ lỗi null

  codeInput.value = "";
  nameInput.value = "";
  document.getElementById("prodCodeGroup").classList.remove("has-error");
  document.getElementById("prodNameGroup").classList.remove("has-error");

  if (mode === "add") {
    modalTitle.innerText = "Thêm mới sản phẩm";
    submitBtn.innerText = "Thêm";
    submitBtn.onclick = () => validateAndSubmitProduct("add");
  } else if (mode === "edit") {
    modalTitle.innerText = "Cập nhật sản phẩm";
    submitBtn.innerText = "Lưu";
    submitBtn.onclick = () => validateAndSubmitProduct("edit");
    codeInput.value = "SP001";
    nameInput.value = "Iphone 12 Pro";
  }

  document.getElementById("productModalOverlay").style.display = "flex";
};

const validateAndSubmitProduct = (mode) => {
  const codeInputVal = document.getElementById("prodCodeInput").value.trim();
  const nameInputVal = document.getElementById("prodNameInput").value.trim();
  let isValid = true;

  if (codeInputVal === "") {
    document.getElementById("prodCodeGroup").classList.add("has-error");
    isValid = false;
  } else document.getElementById("prodCodeGroup").classList.remove("has-error");

  if (nameInputVal === "") {
    document.getElementById("prodNameGroup").classList.add("has-error");
    isValid = false;
  } else document.getElementById("prodNameGroup").classList.remove("has-error");

  if (isValid) {
    alert(
      mode === "add"
        ? "Thêm mới sản phẩm thành công!"
        : "Cập nhật sản phẩm thành công!",
    );
    closeModal("productModalOverlay");
  }
};
