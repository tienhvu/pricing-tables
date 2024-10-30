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

function validateField(formElement, fieldName, fieldValue, validationRules) {
    const rulesForField = validationRules[fieldName];
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
                    isValid =  fieldValue.length <= ruleDetails.value;
                    break;
                case 'match':
                    const targetInput = formElement.querySelector(`[name="${ruleDetails.value}"]`);
                    isValid = targetInput && fieldValue === targetInput.value;
                    break;
            }
        }

        if (!isValid) {
            return {
                isValid: false,
                message: ruleDetails.message
            };
        }
    }
    
    return { isValid: true };
}

function setupFormValidation(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) return;

    const submitBtn = form.querySelector('[type="submit"]');

    function validateAndShowError(fieldName, showErrors = true) {
        const input = form.querySelector(`[name="${fieldName}"]`);
        if (!input) return { isValid: true };

        const result = validateField(form, fieldName, input.value, rules);
        const errorElement = document.getElementById(`${fieldName}Error`);

        if (errorElement && showErrors) {
            errorElement.textContent = result.isValid ? '' : result.message;
            errorElement.style.display = result.isValid ? 'none' : 'block';
        }

        return result;
    }

    function validateAllFields(showErrors = true) {
        let isValid = true;
        Object.keys(rules).forEach(fieldName => {
            const result = validateAndShowError(fieldName, showErrors);
            if (!result.isValid) isValid = false;
        });
        return isValid;
    }

    Object.keys(rules).forEach(fieldName => {
        const input = form.querySelector(`[name="${fieldName}"]`);
        if (!input) return;

        input.addEventListener('input', () => {
            validateAndShowError(fieldName, true);
            if (submitBtn) {
                submitBtn.disabled = !validateAllFields(false);
            }
        });

        input.addEventListener('blur', () => {
            validateAndShowError(fieldName, true);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateAllFields(true)) {
            const modal = document.getElementById('successModal');
            if (modal) modal.style.display = 'block';
        }
    });
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.querySelector('form');
        if (form) {
            form.reset();
            form.querySelectorAll('.error-message').forEach(error => {
                error.style.display = 'none';
                error.textContent = '';
            });
        }
    }
}

setupFormValidation('loginForm', loginRules);
setupFormValidation('registrationForm', registrationRules);
