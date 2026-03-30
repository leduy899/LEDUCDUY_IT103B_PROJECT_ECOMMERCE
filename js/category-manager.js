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

  document.getElementById(`${tabName}-view`).style.display = "block";
};

// 2. Mở/Đóng menu Logout
const toggleLogoutMenu = (event) => {
  event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
  const menu = document.getElementById("logoutMenu");
  menu.classList.toggle("show");
};

// Ẩn menu logout khi click ra ngoài
document.addEventListener("click", (e) => {
  const menu = document.getElementById("logoutMenu");
  if (menu && menu.classList.contains("show")) {
    menu.classList.remove("show");
  }
});

// Xử lý sự kiện click Log out
const handleLogout = () => {
  // Chèn logic đăng xuất thật ở đây (VD: xóa token, redirect)
  alert("Bạn đã đăng xuất thành công!");
  document.getElementById("logoutMenu").classList.remove("show");
};

// 3. Xử lý Lọc & Tìm kiếm cho Bảng
const filterTable = (tableBodyId, statusFilterId, searchInputId) => {
  const statusVal = document.getElementById(statusFilterId).value;
  const searchVal = document
    .getElementById(searchInputId)
    .value.toLowerCase()
    .trim();
  const rows = document.querySelectorAll(`#${tableBodyId} tr`);

  rows.forEach((row) => {
    const rowStatus = row.getAttribute("data-status");
    const itemName = row.querySelector(".item-name").textContent.toLowerCase();

    // Kiểm tra điều kiện trạng thái và từ khóa
    const isStatusMatch = statusVal === "all" || rowStatus === statusVal;
    const isSearchMatch = itemName.includes(searchVal);

    if (isStatusMatch && isSearchMatch) {
      row.style.display = ""; // Hiện dòng
    } else {
      row.style.display = "none"; // Ẩn dòng
    }
  });
};

// Khởi tạo Event Listener cho Lọc và Tìm kiếm Danh mục
document
  .getElementById("catStatusFilter")
  .addEventListener("change", () =>
    filterTable("categoryTableBody", "catStatusFilter", "catSearchInput"),
  );
document
  .getElementById("catSearchInput")
  .addEventListener("input", () =>
    filterTable("categoryTableBody", "catStatusFilter", "catSearchInput"),
  );

// Khởi tạo Event Listener cho Lọc và Tìm kiếm Sản phẩm
document
  .getElementById("prodStatusFilter")
  .addEventListener("change", () =>
    filterTable("productTableBody", "prodStatusFilter", "prodSearchInput"),
  );
document
  .getElementById("prodSearchInput")
  .addEventListener("input", () =>
    filterTable("productTableBody", "prodStatusFilter", "prodSearchInput"),
  );

// 4. Xử lý Phân trang (Active State Toggle)
const setupPagination = (paginationId) => {
  const paginationContainer = document.getElementById(paginationId);
  if (!paginationContainer) return;

  // Lấy tất cả các nút là số trang (loại bỏ nút Next, Prev, dấu ...)
  const pageButtons = paginationContainer.querySelectorAll(".page-number");

  pageButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Xóa class active ở nút hiện tại
      paginationContainer
        .querySelector(".page-number.active")
        ?.classList.remove("active");
      // Thêm class active vào nút vừa click
      btn.classList.add("active");

      // Ở dự án thực tế, bạn sẽ gọi API để fetch dữ liệu trang mới tại đây
    });
  });
};

// Kích hoạt phân trang cho cả 2 khu vực
setupPagination("catPagination");
setupPagination("prodPagination");

// 5. Xử lý Modal (Giữ nguyên các hàm bạn đã có từ trước)
const closeModal = (modalId) => {
  document.getElementById(modalId).style.display = "none";
};

// (Bổ sung thêm các hàm openCategoryModal, openProductModal từ code cũ của bạn vào đây)
// Function: Chuyển đổi giữa các tab (Thống kê, Danh mục, Sản phẩm)

// Đóng logout menu nếu click ra ngoài
document.addEventListener("click", (e) => {
  const profile = document.querySelector(".user-profile");
  const menu = document.getElementById("logoutMenu");
  if (!profile.contains(e.target)) {
    menu.classList.remove("show");
  }
});

// Function: Xử lý Đóng Modal chung

// Function: Mở Modal Danh mục (Xử lý Add / Edit)
const openCategoryModal = (mode) => {
  const modalTitle = document.getElementById("categoryModalTitle");
  const submitBtn = document.getElementById("categorySubmitBtn");

  if (mode === "add") {
    modalTitle.innerText = "Thêm mới danh mục";
    submitBtn.innerText = "Thêm";
    document.getElementById("catCodeInput").value = "";
    document.getElementById("catNameInput").value = "";
  } else {
    modalTitle.innerText = "Cập nhật danh mục";
    submitBtn.innerText = "Lưu";
    // Giả lập dữ liệu fill sẵn
    document.getElementById("catCodeInput").value = "DM001";
    document.getElementById("catNameInput").value = "Quần áo";
  }

  document.getElementById("categoryModalOverlay").style.display = "flex";
};

// Function: Mở Modal Sản phẩm (Xử lý Add / Edit)
const openProductModal = (mode, isErrorMode = false) => {
  const modalTitle = document.getElementById("productModalTitle");
  const submitBtn = document.getElementById("productSubmitBtn");

  if (mode === "add") {
    modalTitle.innerText = "Thêm mới sản phẩm";
    submitBtn.innerText = "Thêm";
    document.getElementById("prodCodeInput").value = "";
    document.getElementById("prodNameInput").value = "";
  } else {
    modalTitle.innerText = "Cập nhật sản phẩm";
    submitBtn.innerText = "Lưu";
  }

  document.getElementById("productModalOverlay").style.display = "flex";

  // Xử lý giả lập giao diện lỗi khi click sửa (dựa theo hình số 9 của bạn)
  if (isErrorMode) {
    triggerProductError();
  }
};

// Function: Giả lập hiển thị báo lỗi (Validation) cho Danh mục
const triggerCategoryError = () => {
  document.getElementById("catCodeGroup").classList.add("has-error");
  document.getElementById("catNameGroup").classList.add("has-error");
};

// Function: Giả lập hiển thị báo lỗi (Validation) cho Sản phẩm
const triggerProductError = () => {
  document.getElementById("prodCodeGroup").classList.add("has-error");
  document.getElementById("prodNameGroup").classList.add("has-error");
};
