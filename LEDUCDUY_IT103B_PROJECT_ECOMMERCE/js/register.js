// 1. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP (ROUTE GUARD)
if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "./category-manager.html";
}

// 2. HÀM ẨN/HIỆN MẬT KHẨU (Đã bổ sung)
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

// 3. CÁC HÀM HIỂN THỊ VÀ XÓA LỖI
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

// 4. XỬ LÝ SỰ KIỆN SUBMIT FORM (Đã gộp thành 1)
document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    let isValid = true;
    const hoDem = document.getElementById("hoDem").value.trim();
    const ten = document.getElementById("ten").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    if (hoDem === "") {
      showError("hoDem", "error-hoDem", "Vui lòng nhập họ và tên đệm.");
      isValid = false;
    }

    if (ten === "") {
      showError("ten", "error-ten", "Vui lòng nhập tên.");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailRegex.test(email)) {
      showError("email", "error-email", "Vui lòng nhập địa chỉ email hợp lệ.");
      isValid = false;
    }

    if (password.length < 8) {
      showError(
        "password",
        "error-password",
        "Mật khẩu phải có ít nhất 8 ký tự.",
      );
      isValid = false;
    }

    if (confirmPassword === "" || confirmPassword !== password) {
      showError(
        "confirmPassword",
        "error-confirmPassword",
        "Mật khẩu xác nhận không khớp.",
      );
      isValid = false;
    }

    if (!terms) {
      document.getElementById("error-terms").style.display = "block";
      isValid = false;
    }

    // 5. XỬ LÝ KHI ĐĂNG KÝ THÀNH CÔNG
    if (isValid) {
      // Tùy chọn: Lưu thông tin người dùng vào localStorage để dùng cho màn hình Login
      const userData = {
        fullName: hoDem + " " + ten,
        email: email,
        password: password, // Lưu ý: Trong thực tế mật khẩu cần được mã hóa ở Backend
      };
      localStorage.setItem("registeredUser", JSON.stringify(userData));

      Swal.fire({
        title: "Đăng ký thành công!",
        icon: "success",
        draggable: true,
      }).then(() => {
        // Sau khi tắt thông báo, chuyển về trang đăng nhập
        window.location.href = "./login.html";
      });

      this.reset();
    }
  });
