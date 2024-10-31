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
      message: "Tên là bắt buộc",
    },
    letters: {
      value: true,
      message: "Tên chỉ chấp nhận chữ cái và khoảng trắng",
    },
  },
  email: {
    required: {
      value: true,
      message: "Email là bắt buộc",
    },
    email: {
      value: true,
      message: "Email không hợp lệ",
    },
  },
  password: {
    required: {
      value: true,
      message: "Mật khẩu là bắt buộc",
    },
    lowercase: {
      value: true,
      message: "Mật khẩu phải có ít nhất 1 chữ thường",
    },
    uppercase: {
      value: true,
      message: "Mật khẩu phải có ít nhất 1 chữ hoa",
    },
    minLength: {
      value: 8,
      message: "Mật khẩu phải có ít nhất 8 ký tự",
    },
    maxLength: {
      value: 32,
      message: "Mật khẩu không được vượt quá 32 ký tự",
    },
  },
  confirmPassword: {
    required: {
      value: true,
      message: "Xác nhận mật khẩu là bắt buộc",
    },
    match: {
      value: "password",
      message: "Mật khẩu không khớp",
    },
  },
};

const loginRules = {
  email: {
    required: {
      value: true,
      message: "Email là bắt buộc",
    },
    email: {
      value: true,
      message: "Email không hợp lệ",
    },
  },
  password: {
    required: {
      value: true,
      message: "Mật khẩu là bắt buộc",
    },
    lowercase: {
      value: true,
      message: "Mật khẩu phải có ít nhất 1 chữ thường",
    },
    uppercase: {
      value: true,
      message: "Mật khẩu phải có ít nhất 1 chữ hoa",
    },
    minLength: {
      value: 8,
      message: "Mật khẩu phải có ít nhất 8 ký tự",
    },
    maxLength: {
      value: 32,
      message: "Mật khẩu không được vượt quá 32 ký tự",
    },
  },
};

function showError(input, message) {
  const errorElement = document.getElementById(`${input.name}Error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
    errorElement.classList.add("error");
  }
}

function hideError(input) {
  const errorElement = document.getElementById(`${input.name}Error`);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
    errorElement.classList.remove("error");
  }
}

function validateField(formElement, input, validationRules) {
  const fieldValue = input.value;
  const rulesForField = validationRules[input.name];
  if (!rulesForField) return true;

  const ruleNames = Object.keys(rulesForField);

  for (const ruleName of ruleNames) {
    const ruleDetails = rulesForField[ruleName];

    let isValid = true;

    if (regex[ruleName]) {
      isValid = regex[ruleName].test(fieldValue);
    } else {
      switch (ruleName) {
        case "minLength":
          isValid = fieldValue.length >= ruleDetails.value;
          break;
        case "maxLength":
          isValid = fieldValue.length <= ruleDetails.value;
          break;
        case "match":
          const targetInput = formElement.querySelector(
            `[name="${ruleDetails.value}"]`
          );
          isValid = targetInput && fieldValue === targetInput.value;
          break;
      }
    }

    if (!isValid) {
      showError(input, ruleDetails.message);
      return false;
    }
  }

  hideError(input);

  return true;
}

function validateMatchPassword(formElement, input, validationRules) {
  if (formElement.id !== "registrationForm") return;

  Object.entries(validationRules).forEach(([fieldName, fieldRules]) => {
    if (fieldRules.match && fieldRules.match.value === input.name) {
      const matchInput = formElement.querySelector(`[name="${fieldName}"]`);
      if (matchInput) {
        validateField(formElement, matchInput, validationRules);
      }
    }
  });
}

function isFormValid(form, rules) {
  const noErrors = !form.querySelector(".error");

  const requiredFields = Object.entries(rules).filter(
    ([fieldRules]) => fieldRules.required
  );

  const allRequiredFilled = requiredFields.every(([fieldName]) => {
    const input = form.querySelector(`[name="${fieldName}"]`);
    return input && input.value.trim() !== "";
  });

  return noErrors && allRequiredFilled;
}

function validateForm(formId, rules) {
  const form = document.getElementById(formId);
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');
  if (!submitBtn) return;
  submitBtn.disabled = true;

  const inputs = Array.from(form.querySelectorAll("input")).filter(
    (input) => rules[input.name]
  );

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const isValid = validateField(form, input, rules);
      if (isValid) {
        validateMatchPassword(form, input, rules);
      }
      submitBtn.disabled = !isValid;
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const modal = document.getElementById("successModal");
    if (modal) modal.style.display = "block";
  });
}

function closeModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.style.display = "none";
    const form = document.querySelector("form");
    if (form) {
      form.reset();
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      const inputs = form.querySelectorAll("input");
      inputs.forEach((input) => hideError(input));
    }
  }
}

validateForm("loginForm", loginRules);
validateForm("registrationForm", registrationRules);
