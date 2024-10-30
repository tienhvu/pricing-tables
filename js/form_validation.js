const regex = {
    required: /^(?!\s*$).+/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    letters: /^[a-zA-ZÀ-ỹ\s]+$/,
    lowercase: /^(?=.*[a-z])/,
    uppercase: /^(?=.*[A-Z])/,
};

const registrationRules = {
    name: {
        required: {
            value: true,
            message: 'Tên là bắt buộc'
        },
        letters: {
            value: true,
            message: 'Tên chỉ chấp nhận chữ cái và khoảng trắng'
        }
    },
    email: {
        required: {
            value: true,
            message: 'Email là bắt buộc'
        },
        email: {
            value: true,
            message: 'Email không hợp lệ'
        }
    },
    password: {
        required: {
            value: true,
            message: 'Mật khẩu là bắt buộc'
        },
        lowercase: {
            value: true,
            message: 'Mật khẩu phải có ít nhất 1 chữ thường'
        },
        uppercase: {
            value: true,
            message: 'Mật khẩu phải có ít nhất 1 chữ hoa'
        },
        minLength: {
            value: 8,
            message: 'Mật khẩu phải có ít nhất 8 ký tự'
        },
        maxLength: {
            value: 32,
            message: 'Mật khẩu không được vượt quá 32 ký tự'
        }
    },
    confirmPassword: {
        required: {
            value: true,
            message: 'Xác nhận mật khẩu là bắt buộc'
        },
        match: {
            value: 'password',
            message: 'Mật khẩu không khớp'
        }
    }
};

const loginRules = {
    email: {
        required: {
            value: true,
            message: 'Email là bắt buộc'
        },
        email: {
            value: true,
            message: 'Email không hợp lệ'
        }
    },
    password: {
        required: {
            value: true,
            message: 'Mật khẩu là bắt buộc'
        },
        lowercase: {
            value: true,
            message: 'Mật khẩu phải có ít nhất 1 chữ thường'
        },
        uppercase: {
            value: true,
            message: 'Mật khẩu phải có ít nhất 1 chữ hoa'
        },
        minLength: {
            value: 8,
            message: 'Mật khẩu phải có ít nhất 8 ký tự'
        },
        maxLength: {
            value: 32,
            message: 'Mật khẩu không được vượt quá 32 ký tự'
        }
    }
};

function validateField(formElement, input, validationRules) {
    const fieldValue = input.value;
    const rulesForField = validationRules[input.name];
    if (!rulesForField) return { isValid: true };

    const ruleNames = Object.keys(rulesForField);

    for (const ruleName of ruleNames) {
        const ruleDetails = rulesForField[ruleName];
        let isValid = true;

        if (regex[ruleName]) {
            isValid = regex[ruleName].test(fieldValue);
        } else {
            switch (ruleName) {
                case 'minLength':
                    isValid = fieldValue.length >= ruleDetails.value;
                    break;
                case 'maxLength':
                    isValid = fieldValue.length <= ruleDetails.value;
                    break;
                case 'match':
                    const targetInput = formElement.querySelector(`[name="${ruleDetails.value}"]`);
                    isValid = targetInput && fieldValue === targetInput.value;
                    break;
            }
        }

        if (!isValid) {
            const errorElement = document.getElementById(`${input.name}Error`);
            if (errorElement) {
                errorElement.textContent = ruleDetails.message;
                errorElement.style.display = 'block';
            }
            return {
                isValid: false,
                message: ruleDetails.message
            };
        }
    }

    const errorElement = document.getElementById(`${input.name}Error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    return { isValid: true };
}

function validateForm(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    if (!submitBtn) return;
    const inputs = Array.from(form.querySelectorAll('input'))
    .filter(input => rules[input.name]);

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateField(form, input, rules);
            const allFieldsValid = inputs.every(input => {
                const result = validateField(form, input, rules);
                return result.isValid;
            });

            submitBtn.disabled = !allFieldsValid;
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const modal = document.getElementById('successModal');
        if (modal) modal.style.display = 'block';
    });

}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.querySelector('form');
        if (form) {
            form.reset();
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            form.querySelectorAll('.error-message').forEach(error => {
                error.style.display = 'none';
                error.textContent = '';
            });
        }
    }
}

validateForm('loginForm', loginRules);
validateForm('registrationForm', registrationRules);
