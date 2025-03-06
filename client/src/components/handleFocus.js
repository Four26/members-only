const handleFocus = (setFocused, field) => setFocused((prev) => ({ ...prev, [field]: true }));

export default handleFocus;
