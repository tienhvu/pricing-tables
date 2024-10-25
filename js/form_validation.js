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

function validateRule(rule, value, options = {}) {
    const validationRule = validationRules[rule];
    if (!validationRule) return { isValid: true };

    if (rule === 'match' && options.matchValue !== undefined) {
        return validationRule.validate(value, options.matchValue);
    }
    
    return validationRule.validate(value);
}

function updateErrorDisplay(errorElement, { isValid, message }) {
    if (!errorElement) return;
    
    errorElement.textContent = message || '';
    errorElement.style.display = isValid ? 'none' : 'block';
}

function validateInput(input, showError) {
    const rules = [
        ...(input.dataset.required ? ['required'] : []),
        ...(input.dataset.validate?.split(' ') || [])
    ].filter(Boolean);

    const errorElement = document.getElementById(`${input.name}Error`);
    let result = { isValid: true, message: '' };

    if (input.value.trim() || rules.includes('required')) {
        for (const rule of rules) {
            const options = {
                matchValue: rule === 'match' ? 
                    document.getElementById(input.dataset.match)?.value : 
                    undefined
            };

            result = validateRule(rule, input.value, options);

            if (!result.isValid) break;
        }
    }

    if (showError) {
        updateErrorDisplay(errorElement, result);
    }
    return result.isValid;
}

function checkFormValidity(form) {
    const inputs = form.querySelectorAll('input[name]');
    return Array.from(inputs).every(input => validateInput(input, true));
}

function setupFormValidation(formSelector = 'form') {
    document.querySelectorAll(formSelector).forEach(form => {
        const submitBtn = form.querySelector('[type="submit"]');
        
        function updateSubmitButton() {
            const isValid = checkFormValidity(form);
            submitBtn.disabled = !isValid;
        }

        form.querySelectorAll('input[name]').forEach(input => {
            input.addEventListener('input', () => {
                validateInput(input, true);
                updateSubmitButton();
            });

            input.addEventListener('blur', () => {
                validateInput(input, true);
                updateSubmitButton();
            });

            if (input.dataset.match) {
                const targetInput = document.getElementById(input.dataset.match);
                if (targetInput) {
                    targetInput.addEventListener('input', () => {
                        validateInput(input, true);
                        updateSubmitButton();
                    });
                }
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            form.querySelectorAll('input[name]').forEach(input => {
                const inputIsValid = validateInput(input, true);
                if (!inputIsValid) isValid = false;
            });
            
            if (isValid) {
                const modal = document.getElementById('successModal');
                if (modal) modal.style.display = 'block';
            }
        });
    });
}

function resetForm(form) {
    form.reset();
    form.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
    });
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.querySelector('form');
        if (form) resetForm(form);
    }
}

setupFormValidation();
