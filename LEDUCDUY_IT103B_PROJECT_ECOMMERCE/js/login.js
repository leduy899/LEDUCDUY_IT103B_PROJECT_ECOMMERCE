// 1. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP (ROUTE GUARD)
// Nếu người dùng đã đăng nhập, không cho phép ở lại trang login
if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "./category-manager.html";
}

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    let isValid = true;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      showError("email", "error-email", "Vui lòng nhập địa chỉ email.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError("email", "error-email", "Email không đúng định dạng.");
      isValid = false;
    }

    if (password === "") {
      showError("password", "error-password", "Vui lòng nhập mật khẩu.");
      isValid = false;
    }

    // 2. XỬ LÝ KHI ĐĂNG NHẬP THÀNH CÔNG
    if (isValid) {
      // Lưu trạng thái đăng nhập vào localStorage
      localStorage.setItem("isLoggedIn", "true");
      // Chuyển hướng sang trang quản lý
      window.location.href = "./category-manager.html";
    }
  });

const showError = (inputId, errorId, message) => {
  const inputElement = document.getElementById(inputId);
  const errorElement = document.getElementById(errorId);
  inputElement.classList.add("input-error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
};

const clearErrors = () => {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => input.classList.remove("input-error"));
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((msg) => (msg.style.display = "none"));
};

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    // Ngăn chặn trang tải lại khi ấn nút
    event.preventDefault();

    // Dọn dẹp lỗi cũ trước khi kiểm tra lại
    clearErrors();

    let isValid = true;

    // Lấy giá trị input
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Biểu thức chính quy kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate Email
    if (email === "") {
      showError("email", "error-email", "Vui lòng nhập địa chỉ email.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError("email", "error-email", "Email không đúng định dạng.");
      isValid = false;
    }

    // Validate Mật khẩu
    if (password === "") {
      showError("password", "error-password", "Vui lòng nhập mật khẩu.");
      isValid = false;
    }

    // Nếu thông tin hợp lệ
    if (isValid) {
      // Code gửi data lên server sẽ nằm ở đây
    }
  });
// Hàm hiển thị Password
const togglePasswordVisibility = (inputId, iconElement) => {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    iconElement.classList.remove("fa-eye-slash");
    iconElement.classList.add("fa-eye");
  } else {
    input.type = "password";
    iconElement.classList.remove("fa-eye");
    iconElement.classList.add("fa-eye-slash");
  }
};
