export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateForm = (formData, fields) => {
  const errors = {};
  
  fields.forEach(field => {
    const value = formData[field.name];
    
    if (field.required && !validateRequired(value)) {
      errors[field.name] = `${field.label} is required`;
    } else if (field.type === 'email' && value && !validateEmail(value)) {
      errors[field.name] = 'Please enter a valid email address';
    } else if (field.type === 'password' && value && !validatePassword(value)) {
      errors[field.name] = 'Password must be at least 6 characters long';
    } else if (field.minLength && value && value.length < field.minLength) {
      errors[field.name] = `${field.label} must be at least ${field.minLength} characters long`;
    } else if (field.maxLength && value && value.length > field.maxLength) {
      errors[field.name] = `${field.label} cannot exceed ${field.maxLength} characters`;
    }
  });
  
  return errors;
};