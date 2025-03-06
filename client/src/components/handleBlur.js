const handleBlur = (setFocused, field, value) => {
    if (!value) {
        setFocused((prev) => {
            return { ...prev, [field]: false }
        });
    }
}

export default handleBlur;