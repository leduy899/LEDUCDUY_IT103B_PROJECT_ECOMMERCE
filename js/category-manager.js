// ==========================================
// 1. ROUTE GUARD (BẢO VỆ TRANG)
// ==========================================
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "./login.html";
}

// ==========================================
// 2. KHỞI TẠO STATE (CƠ SỞ DỮ LIỆU TẠM THỜI)
// ==========================================
let categories = [
  { id: "DM001", name: "Quần áo", status: "active" },
  { id: "DM002", name: "Kính mắt", status: "inactive" },
  { id: "DM003", name: "Giày dép", status: "active" },
];

let products = [
  {
    id: "SP001",
    name: "Iphone 12 Pro",
    price: "12.000.000 đ",
    qty: 10,
    discount: "0%",
    status: "active",
  },
];

// Biến lưu trữ trạng thái khi đang Sửa hoặc Xóa
let currentEditingId = null;
let currentEditingType = null; // 'category' hoặc 'product'
let itemToDeleteId = null;
let itemToDeleteType = null;

// ==========================================
// 3. UI & COMPONENT CHUNG (TAB, TOAST, LOGOUT)
// ==========================================

const switchTab = (tabName) => {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.getAttribute("data-tab") === tabName);
  });
  document.querySelectorAll(".view-section").forEach((section) => {
    section.style.display = "none";
  });
  const targetSection = document.getElementById(`${tabName}-view`);
  if (targetSection) targetSection.style.display = "block";
};

const toggleLogoutMenu = (event) => {
  event.stopPropagation();
  document.getElementById("logoutMenu")?.classList.toggle("show");
};

document.addEventListener("click", () => {
  document.getElementById("logoutMenu")?.classList.remove("show");
});

const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "./login.html";
};

const showToast = (title, message) => {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check check-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${message}</div>
    </div>
    <i class="fa-solid fa-circle-xmark toast-close" onclick="this.parentElement.remove()"></i>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ==========================================
// 4. HÀM RENDER DỮ LIỆU (VẼ GIAO DIỆN TỪ MẢNG)
// ==========================================
const renderCategories = () => {
  const tableBody = document.getElementById("categoryTableBody");
  if (!tableBody) return;

  const htmlRows = categories.map((cat) => {
    const statusClass = cat.status === "active" ? "active" : "inactive";
    const statusText =
      cat.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động";

    return `
      <tr data-status="${cat.status}">
        <td>${cat.id}</td>
        <td class="item-name">${cat.name}</td>
        <td>
          <span class="status ${statusClass}"><span class="dot"></span> ${statusText}</span>
        </td>
        <td class="action-cell">
          <i class="fa-regular fa-trash-can icon-delete" 
             onclick="openDeleteModal('category', '${cat.id}', '${cat.name}')"></i>
          <i class="fa-solid fa-pen icon-edit" 
             onclick="openCategoryModal('edit', '${cat.id}')"></i>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = htmlRows.join("");
  applyTableFilter("categoryTableBody", "catStatusFilter", "catSearchInput"); // Giữ nguyên bộ lọc sau khi render
};

const renderProducts = () => {
  const tableBody = document.getElementById("productTableBody");
  if (!tableBody) return;

  const htmlRows = products.map((prod) => {
    const statusClass = prod.status === "active" ? "active" : "inactive";
    const statusText =
      prod.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động";

    return `
      <tr data-status="${prod.status}">
        <td>${prod.id}</td>
        <td class="item-name">${prod.name}</td>
        <td>${prod.price}</td>
        <td>${prod.qty}</td>
        <td>${prod.discount}</td>
        <td>
          <span class="status ${statusClass}"><span class="dot"></span> ${statusText}</span>
        </td>
        <td class="action-cell">
          <i class="fa-regular fa-trash-can icon-delete" 
             onclick="openDeleteModal('product', '${prod.id}', '${prod.name}')"></i>
          <i class="fa-solid fa-pen icon-edit" 
             onclick="openProductModal('edit', '${prod.id}')"></i>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = htmlRows.join("");
  applyTableFilter("productTableBody", "prodStatusFilter", "prodSearchInput");
};

// ==========================================
// 5. TÌM KIẾM & LỌC DỮ LIỆU
// ==========================================
const applyTableFilter = (tableBodyId, statusFilterId, searchInputId) => {
  const statusVal = document.getElementById(statusFilterId)?.value || "all";
  const searchVal =
    document.getElementById(searchInputId)?.value.toLowerCase().trim() || "";
  const rows = document.getElementById(tableBodyId)?.querySelectorAll("tr");

  if (!rows) return;

  rows.forEach((row) => {
    const rowStatus = row.getAttribute("data-status");
    const itemName =
      row.querySelector(".item-name")?.textContent.toLowerCase() || "";

    const isStatusMatch = statusVal === "all" || rowStatus === statusVal;
    const isSearchMatch = itemName.includes(searchVal);

    row.style.display = isStatusMatch && isSearchMatch ? "" : "none";
  });
};

// Gắn sự kiện Lọc cho Danh mục
document
  .getElementById("catStatusFilter")
  ?.addEventListener("change", () => renderCategories());
document
  .getElementById("catSearchInput")
  ?.addEventListener("input", () => renderCategories());

// Gắn sự kiện Lọc cho Sản phẩm
document
  .getElementById("prodStatusFilter")
  ?.addEventListener("change", () => renderProducts());
document
  .getElementById("prodSearchInput")
  ?.addEventListener("input", () => renderProducts());

// ==========================================
// 6. XỬ LÝ MODAL: ĐÓNG / MỞ & RÀNG BUỘC (VALIDATE)
// ==========================================
const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    modal
      .querySelectorAll(".has-error")
      .forEach((g) => g.classList.remove("has-error"));
  }
};

// -- MODAL DANH MỤC --
const openCategoryModal = (mode, id = null) => {
  currentEditingType = "category";
  const title = document.getElementById("categoryModalTitle");
  const btn = document.getElementById("categorySubmitBtn");
  const codeInput = document.getElementById("catCodeInput");
  const nameInput = document.getElementById("catNameInput");

  // Xóa lỗi cũ
  document.getElementById("catCodeGroup").classList.remove("has-error");
  document.getElementById("catNameGroup").classList.remove("has-error");

  if (mode === "add") {
    currentEditingId = null;
    title.innerText = "Thêm mới danh mục";
    btn.innerText = "Thêm";
    codeInput.value = "";
    nameInput.value = "";
    codeInput.disabled = false; // Cho phép nhập ID mới
  } else if (mode === "edit" && id) {
    currentEditingId = id;
    title.innerText = "Cập nhật danh mục";
    btn.innerText = "Lưu";

    // Tìm dữ liệu trong mảng và điền lên form
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      codeInput.value = cat.id;
      nameInput.value = cat.name;
      codeInput.disabled = true; // Không cho phép sửa ID

      // Check đúng radio button trạng thái (Nếu HTML có cấu hình value)
      const radio = document.querySelector(
        `input[name="catStatus"][value="${cat.status}"]`,
      );
      if (radio) radio.checked = true;
    }
  }

  btn.onclick = () => submitCategory(mode);
  document.getElementById("categoryModalOverlay").style.display = "flex";
};

const submitCategory = (mode) => {
  const codeInput = document.getElementById("catCodeInput");
  const nameInput = document.getElementById("catNameInput");
  const codeVal = codeInput.value.trim();
  const nameVal = nameInput.value.trim();

  let isValid = true;
  document
    .getElementById("catCodeGroup")
    .classList.toggle("has-error", codeVal === "");
  if (codeVal === "") isValid = false;

  document
    .getElementById("catNameGroup")
    .classList.toggle("has-error", nameVal === "");
  if (nameVal === "") isValid = false;

  if (isValid) {
    // Lấy trạng thái từ thẻ HTML (Mặc định lấy 'active' nếu bạn chưa gắn attribute value vào HTML)
    const checkedRadio = document.querySelector(
      'input[name="catStatus"]:checked',
    );
    const statusVal =
      checkedRadio && checkedRadio.value ? checkedRadio.value : "active";

    if (mode === "add") {
      // Kiểm tra trùng ID
      if (categories.some((c) => c.id === codeVal)) {
        showToast("Lỗi", "Mã danh mục đã tồn tại!");
        return;
      }
      categories.push({ id: codeVal, name: nameVal, status: statusVal });
    } else if (mode === "edit") {
      const index = categories.findIndex((c) => c.id === currentEditingId);
      if (index !== -1) {
        categories[index].name = nameVal;
        categories[index].status = statusVal;
      }
    }

    renderCategories();
    showToast(
      "Thành công",
      `${mode === "add" ? "Thêm mới" : "Cập nhật"} danh mục thành công!`,
    );
    closeModal("categoryModalOverlay");
  }
};

// -- MODAL SẢN PHẨM --
// Áp dụng logic tương tự như danh mục
const openProductModal = (mode, id = null) => {
  currentEditingType = "product";
  const title = document.getElementById("productModalTitle");
  const btn = document.getElementById("productSubmitBtn");
  const codeInput = document.getElementById("prodCodeInput");
  const nameInput = document.getElementById("prodNameInput");

  document.getElementById("prodCodeGroup").classList.remove("has-error");
  document.getElementById("prodNameGroup").classList.remove("has-error");

  if (mode === "add") {
    currentEditingId = null;
    title.innerText = "Thêm mới sản phẩm";
    btn.innerText = "Thêm";
    codeInput.value = "";
    nameInput.value = "";
    codeInput.disabled = false;
  } else if (mode === "edit" && id) {
    currentEditingId = id;
    title.innerText = "Cập nhật sản phẩm";
    btn.innerText = "Lưu";

    const prod = products.find((p) => p.id === id);
    if (prod) {
      codeInput.value = prod.id;
      nameInput.value = prod.name;
      codeInput.disabled = true;
    }
  }

  btn.onclick = () => submitProduct(mode);
  document.getElementById("productModalOverlay").style.display = "flex";
};

const submitProduct = (mode) => {
  const codeVal = document.getElementById("prodCodeInput").value.trim();
  const nameVal = document.getElementById("prodNameInput").value.trim();

  let isValid = true;
  document
    .getElementById("prodCodeGroup")
    .classList.toggle("has-error", codeVal === "");
  if (codeVal === "") isValid = false;

  document
    .getElementById("prodNameGroup")
    .classList.toggle("has-error", nameVal === "");
  if (nameVal === "") isValid = false;

  if (isValid) {
    if (mode === "add") {
      if (products.some((p) => p.id === codeVal)) {
        showToast("Lỗi", "Mã sản phẩm đã tồn tại!");
        return;
      }
      // Dữ liệu mẫu (Tạm thời fix cứng giá và số lượng vì HTML bạn chưa cấp ID cho các input này)
      products.push({
        id: codeVal,
        name: nameVal,
        price: "10.000.000 đ",
        qty: 1,
        discount: "10%",
        status: "active",
      });
    } else if (mode === "edit") {
      const index = products.findIndex((p) => p.id === currentEditingId);
      if (index !== -1) {
        products[index].name = nameVal;
      }
    }

    renderProducts();
    showToast(
      "Thành công",
      `${mode === "add" ? "Thêm mới" : "Cập nhật"} sản phẩm thành công!`,
    );
    closeModal("productModalOverlay");
  }
};

// ==========================================
// 7. XÓA DỮ LIỆU TỪ MẢNG (DELETE LOGIC)
// ==========================================
const openDeleteModal = (type, id, itemName) => {
  itemToDeleteType = type;
  itemToDeleteId = id;

  const typeText = type === "category" ? "danh mục" : "sản phẩm";
  document.getElementById("deleteItemType").innerText = typeText;
  document.getElementById("deleteItemName").innerText = itemName;

  document.getElementById("deleteModalOverlay").style.display = "flex";
};

document.getElementById("confirmDeleteBtn")?.addEventListener("click", () => {
  if (itemToDeleteId && itemToDeleteType) {
    if (itemToDeleteType === "category") {
      // Dùng hàm filter() để loại bỏ phần tử có ID trùng với itemToDeleteId
      categories = categories.filter((c) => c.id !== itemToDeleteId);
      renderCategories();
    } else if (itemToDeleteType === "product") {
      products = products.filter((p) => p.id !== itemToDeleteId);
      renderProducts();
    }

    closeModal("deleteModalOverlay");
    showToast("Thành công", "Xóa dữ liệu thành công");

    // Reset trạng thái
    itemToDeleteId = null;
    itemToDeleteType = null;
  }
});

// ==========================================
// 8. KHỞI CHẠY LẦN ĐẦU KHI MỞ TRANG
// ==========================================
renderCategories();
renderProducts();

// (UI) Thiết lập click chọn trang (Phân trang chỉ đổi màu nút, dữ liệu chưa chia trang thực tế)
const setupPagination = (paginationId) => {
  document.querySelectorAll(`#${paginationId} .page-number`).forEach((btn) => {
    btn.addEventListener("click", function () {
      this.parentElement.querySelector(".active")?.classList.remove("active");
      this.classList.add("active");
    });
  });
};
setupPagination("catPagination");
setupPagination("prodPagination");
