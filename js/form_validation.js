const validationRules = {
    required: {
        validate: value => ({
            isValid: value.trim().length > 0,
            message: 'Trường này là bắt buộc'
        })
    },
    email: {
        validate: value => ({
            isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Email không hợp lệ'
        })
    },
    password: {
        validate: value => {
            const conditions = [
                {
                    check: value => /^(?=.{8,32})/.test(value),
                    message: 'Mật khẩu phải có 8-32 ký tự'
                },
                {
                    check: value => /^(?=.*[a-z])/.test(value),
                    message: 'Mật khẩu phải có ít nhất 1 chữ thường'
                },
                {
                    check: value => /^(?=.*[A-Z])/.test(value),
                    message: 'Mật khẩu phải có ít nhất 1 chữ hoa'
                }
            ];
            
            for (const condition of conditions) {
                if (!condition.check(value)) {
                    return {
                        isValid: false,
                        message: condition.message
                    };
                }
            }
            return { isValid: true };
        }
    },
    name: {
        validate: value => ({
            isValid: /^[a-zA-ZÀ-ỹ\s]+$/.test(value),
            message: 'Tên không hợp lệ (chỉ chấp nhận chữ cái và khoảng trắng)'
        })
    },
    match: {
        validate: (value, matchValue) => ({
            isValid: value === matchValue,
            message: 'Giá trị không khớp'
        })
    }
};

const formRules = {
    registrationForm: {
        name: [
            {type: 'required', message: 'Tên là bắt buộc'},
            {type: 'name', message: 'Tên chỉ chấp nhận chữ cái và khoảng trắng'}
        ],  
        email: [
            { type: 'required', message: 'Email là bắt buộc' },
            { type: 'email' }
        ],
        password: [
            { type: 'required', message: 'Mật khẩu là bắt buộc' },
            { type: 'password' }
        ],
        confirmPassword: [
            { type: 'required', message: 'Xác nhận mật khẩu là bắt buộc' },
            { type: 'match', matchField: 'password', message: 'Mật khẩu không khớp' }
        ]
    },

    loginForm: {
        email: [
            { type: 'required', message: 'Email là bắt buộc' },
            { type: 'email' }
        ],
        password: [
            { type: 'required', message: 'Mật khẩu là bắt buộc' },
            { type: 'password'}
        ]
    }
};

function validateField(formId, fieldName, value, allValues = {}) {
    const formConfig = formRules[formId];
    if (!formConfig || !formConfig[fieldName]) return { isValid: true };

    const fieldRules = formConfig[fieldName];
    
    for (const rule of fieldRules) {
        const validationRule = validationRules[rule.type];
        if (!validationRule) continue;

        let result;
        if (rule.type === 'match') {
            const matchValue = allValues[rule.matchField];
            result = validationRule.validate(value, matchValue);
        } else {
            result = validationRule.validate(value);
        }

        if (!result.isValid) {
            return {
                isValid: false,
                message: rule.message || result.message
            };
        }
    }

    return { isValid: true };
}

function setupFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form || !formRules[formId]) return;

    const formConfig = formRules[formId];
    const submitBtn = form.querySelector('[type="submit"]');

    function getAllFormValues() {
        const values = {};
        Object.keys(formConfig).forEach(fieldName => {
            const input = form.querySelector(`[name="${fieldName}"]`);
            if (input) values[fieldName] = input.value;
        });
        return values;
    }

    function validateAndShowError(fieldName, showErrors = true) {
        const input = form.querySelector(`[name="${fieldName}"]`);
        if (!input) return { isValid: true };

        const allValues = getAllFormValues();
        const result = validateField(formId, fieldName, input.value, allValues);
        const errorElement = document.getElementById(`${fieldName}Error`);

        if (errorElement && showErrors) {
            errorElement.textContent = result.isValid ? '' : result.message;
            errorElement.style.display = result.isValid ? 'none' : 'block';
        }

        return result;
    }

    function validateAllFields(showErrors = true) {
        let isValid = true;
        Object.keys(formConfig).forEach(fieldName => {
            const result = validateAndShowError(fieldName, showErrors);
            if (!result.isValid) isValid = false;
        });
        return isValid;
    }

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

setupFormValidation('registrationForm');
setupFormValidation('loginForm');
