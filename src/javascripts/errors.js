export function inputErrorBorderHighlight(inputId) {
    const errorColor = "#ff0000";
    const field = document.getElementById(inputId);
    field.style.borderColor = errorColor;
    field.style.borderWidth = '5px';
}

export function resetBorders(isTextInput, elementIds) {
    const borderColor = "#777";
    let borderWidth = "3px";
    elementIds.forEach((elementId) => {
        if (!isTextInput) {
            borderWidth = "1px";
        }
        document.getElementById(elementId).style.borderColor = borderColor;
        document.getElementById(elementId).style.borderWidth = borderWidth;
    });
    errorMessage(null, 'error-message');
}

export function errorMessage(message, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (message == null) {
        errorElement.innerHTML = "";
        errorElement.style.display = 'none';
    } else {
        errorElement.innerHTML = message;
        errorElement.style.display = 'block';
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
}
