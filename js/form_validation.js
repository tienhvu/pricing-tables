const form = document.querySelector('#registrationForm, #loginForm');
const submitBtn = document.getElementById('submitBtn');
const modal = document.getElementById('successModal');
let hasErrors = false;

const isRegistrationForm = form?.id === 'registrationForm';

function validateName(name) {
    const vietnameseNameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    return vietnameseNameRegex.test(name);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
    return passwordRegex.test(password);
}

function showError(input, errorElement, message) {
    errorElement.style.display = 'block';
    errorElement.textContent = message;
    hasErrors = true;
}

function hideError(errorElement) {
    errorElement.style.display = 'none';
}

function validateInput(input, validationFn, errorMsg) {
    const errorElement = document.getElementById(`${input.id}Error`);
    if (!validationFn(input.value)) {
        showError(input, errorElement, errorMsg);
    } else {
        hideError(errorElement);
    }
    checkFormValidity();
}

function resetForm() {
    form.reset();
    submitBtn.disabled = true;
}

function checkFormValidity() {
    hasErrors = false;
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    if (!validateEmail(email.value)) hasErrors = true;
    if (!validatePassword(password.value)) hasErrors = true;
    
    if (isRegistrationForm) {
        const name = document.getElementById('name');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (!validateName(name.value)) hasErrors = true;
        if (password.value !== confirmPassword.value) hasErrors = true;
    }
    
    submitBtn.disabled = hasErrors;
}

if (form) {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    email.addEventListener('input', function() {
        validateInput(this, validateEmail, 'Email không hợp lệ');
    });
    
    password.addEventListener('input', function() {
        validateInput(this, validatePassword, 'Mật khẩu phải có 8-32 ký tự, ít nhất 1 chữ hoa và 1 chữ thường');
    });
    
    if (isRegistrationForm) {
        const name = document.getElementById('name');
        const confirmPassword = document.getElementById('confirmPassword');
        
        name.addEventListener('input', function() {
            validateInput(this, validateName, 'Tên không hợp lệ (chỉ chấp nhận chữ cái và khoảng trắng)');
        });
        
        password.addEventListener('input', function() {
            if (confirmPassword.value) {
                validateInput(
                    confirmPassword,
                    (value) => value === this.value,
                    'Mật khẩu xác nhận không khớp'
                );
            }
        });
        
        confirmPassword.addEventListener('input', function() {
            validateInput(
                this,
                (value) => value === password.value,
                'Mật khẩu xác nhận không khớp'
            );
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!hasErrors) {
            modal.style.display = 'block';
        }
    });
}

function closeModal() {
    modal.style.display = 'none';
    resetForm();
}

window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

if (form) {
    checkFormValidity();
}