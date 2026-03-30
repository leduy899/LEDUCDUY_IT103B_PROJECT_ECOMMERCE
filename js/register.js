document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    // Ngăn chặn hành vi tải lại trang
    event.preventDefault();

    // Xóa tất cả các cảnh báo lỗi trước mỗi lần submit
    clearErrors();

    let isValid = true;

    // Lấy giá trị từ các ô input
    const hoDem = document.getElementById("hoDem").value.trim();
    const ten = document.getElementById("ten").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    // Validate Họ đệm
    if (hoDem === "") {
      showError("hoDem", "error-hoDem", "Vui lòng nhập họ và tên đệm.");
      isValid = false;
    }

    // Validate Tên
    if (ten === "") {
      showError("ten", "error-ten", "Vui lòng nhập tên.");
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailRegex.test(email)) {
      showError("email", "error-email", "Vui lòng nhập địa chỉ email hợp lệ.");
      isValid = false;
    }

    // Validate Mật khẩu
    if (password.length < 8) {
      showError(
        "password",
        "error-password",
        "Mật khẩu phải có ít nhất 8 ký tự.",
      );
      isValid = false;
    }

    // Validate Xác nhận mật khẩu
    if (confirmPassword === "" || confirmPassword !== password) {
      showError(
        "confirmPassword",
        "error-confirmPassword",
        "Mật khẩu xác nhận không khớp.",
      );
      isValid = false;
    }

    // Validate Checkbox điều khoản
    if (!terms) {
      document.getElementById("error-terms").style.display = "block";
      isValid = false;
    }

    // Nếu không có lỗi nào, tiến hành xử lý thành công
    if (isValid) {
      Swal.fire({
        title: "Đăng ký thành công!",
        icon: "success",
        draggable: true,
      });

      // Bạn có thể xóa trắng form sau khi xử lý xong
      this.reset();
    }
  });

// Hàm dùng chung để hiển thị lỗi
const showError = (inputId, errorId, message) => {
  const inputElement = document.getElementById(inputId);
  const errorElement = document.getElementById(errorId);

  inputElement.classList.add("input-error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
};

// Hàm dùng chung để dọn dẹp các thông báo lỗi cũ
const clearErrors = () => {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => input.classList.remove("input-error"));

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((msg) => (msg.style.display = "none"));
};
