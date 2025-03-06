const togglePassword = (setShowPassword, field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
}

export default togglePassword;