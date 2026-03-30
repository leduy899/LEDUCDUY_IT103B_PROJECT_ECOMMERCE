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
      alert("Đăng nhập thành công!");
      // Code gửi data lên server sẽ nằm ở đây
    }
  });

// Hàm hiển thị lỗi
const showError = (inputId, errorId, message) => {
  const inputElement = document.getElementById(inputId);
  const errorElement = document.getElementById(errorId);

  inputElement.classList.add("input-error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
};

// Hàm xóa lỗi
const clearErrors = () => {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => input.classList.remove("input-error"));

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((msg) => (msg.style.display = "none"));
};
