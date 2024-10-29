const registrationRules = {
    name: {
        required: {
            validate: value => value.trim().length > 0,
            message: 'Tên là bắt buộc'
        },
        pattern: {
            validate: value => /^[a-zA-ZÀ-ỹ\s]+$/.test(value),
            message: 'Tên chỉ chấp nhận chữ cái và khoảng trắng'
        }
    },
    email: {
        required: {
            validate: value => value.trim().length > 0,
            message: 'Email là bắt buộc'
        },
        pattern: {
            validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Email không hợp lệ'
        }
    },
    password: {
        required: {
            validate: value => value.trim().length > 0,
            message: 'Mật khẩu là bắt buộc'
        },
        lowercase: {
            validate: value => /^(?=.*[a-z])/.test(value),
            message: 'Mật khẩu phải có ít nhất 1 chữ thường'
        },
        uppercase: {
            validate: value => /^(?=.*[A-Z])/.test(value),
            message: 'Mật khẩu phải có ít nhất 1 chữ hoa'
        },
        minLength: {
            validate: value => /^(?=.{8,32})/.test(value),
            message: 'Mật khẩu phải có 8-32 ký tự'
        },
    },
    confirmPassword: {
        required: {
            validate: value => value.trim().length > 0,
            message: 'Xác nhận mật khẩu là bắt buộc'
        },
        match: {
            validate: (value, form) => value === form.querySelector('[name="password"]').value,
            message: 'Mật khẩu không khớp'
        }
    }
            
};

const loginRules = {
    email: {
        required: {
            validate: value => value.trim().length > 0,
            message: 'Email là bắt buộc'
        },
        pattern: {
            validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Email không hợp lệ'
        }
    },
    password: {
        required: {
            validate: value => value.trim().length > 0,
            message: 'Mật khẩu là bắt buộc'
        },
        lowercase: {
            validate: value => /^(?=.*[a-z])/.test(value),
            message: 'Mật khẩu phải có ít nhất 1 chữ thường'
        },
        uppercase: {
            validate: value => /^(?=.*[A-Z])/.test(value),
            message: 'Mật khẩu phải có ít nhất 1 chữ hoa'
        },
        minLength: {
            validate: value => /^(?=.{8,32})/.test(value),
            message: 'Mật khẩu phải có 8-32 ký tự'
        },
    },
}


const FormValidation = {
    rules: {},

    registerForm(formId, formRules) {
        this.rules[formId] = formRules;
        this.setupFormValidation(formId);
    },

    getFormRules(formId) {
        return this.rules[formId];
    },

    validateField(form, fieldName, value) {
        const formId = form.id;
        const fieldRules = this.rules[formId]?.[fieldName];
        if (!fieldRules) return { isValid: true };

        for (const [ruleName, rule] of Object.entries(fieldRules)) {
            const isValid = rule.validate(value, form);
            if (!isValid) {
                return {
                    isValid: false,
                    message: rule.message
                };
            }
        }

        return { isValid: true };
    },

    setupFormValidation(formId) {
        const form = document.getElementById(formId);
        if (!form || !this.rules[formId]) return;

        const formConfig = this.rules[formId];
        const submitBtn = form.querySelector('[type="submit"]');

        const validateAndShowError = (fieldName, showErrors = true) => {
            const input = form.querySelector(`[name="${fieldName}"]`);
            if (!input) return { isValid: true };

            const result = this.validateField(form, fieldName, input.value);
            const errorElement = document.getElementById(`${fieldName}Error`);

            if (errorElement && showErrors) {
                errorElement.textContent = result.isValid ? '' : result.message;
                errorElement.style.display = result.isValid ? 'none' : 'block';
            }

            return result;
        };

        const validateAllFields = (showErrors = true) => {
            let isValid = true;
            Object.keys(formConfig).forEach(fieldName => {
                const result = validateAndShowError(fieldName, showErrors);
                if (!result.isValid) isValid = false;
            });
            return isValid;
        };

        Object.keys(formConfig).forEach(fieldName => {
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
    },
    closeModal() {
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
};

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

FormValidation.registerForm('loginForm', loginRules);
FormValidation.registerForm('registrationForm', registrationRules);
