export function inputErrorBorderHighlight(inputId) {
    const errorColor = "#ff0000";
    const field = document.getElementById(inputId);
    field.style.borderColor = errorColor;
    field.style.borderWidth = '5px';
}

export function resetBorders(borderAttributes, elementIds) {
    const borderColor = borderAttributes[0];
    const borderWidth = borderAttributes[1];
    elementIds.forEach((elementId) => {
        document.getElementById(elementId).style.borderColor = borderColor;
        document.getElementById(elementId).style.borderWidth = borderWidth;
    });
    try {
        errorMessage(null, 'error-message');
    } catch{}
    try {
        infoMessage(null, 'info-message');
    } catch{}
}

export function errorMessage(message, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (message == null) {
        errorElement.innerHTML = "";
        errorElement.style.display = 'none';
    } else {
        errorElement.innerHTML = message;
        errorElement.style.display = 'block';
        document.getElementById('scroll').scrollTo(0, 0);
        document.getElementById('scroll').scrollTop = 0; // For Safari
        document.getElementById('scroll').scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
}

export function infoMessage(message, infoElementId) {
    const infoElement = document.getElementById(infoElementId);
    if (message == null) {
        infoElement.innerHTML = "";
        infoElement.style.display = 'none';
    } else {
        infoElement.innerHTML = message;
        infoElement.style.display = 'block';
        document.getElementById('scroll').scrollTo(0, 0);
        document.getElementById('scroll').scrollTop = 0; // For Safari
        document.getElementById('scroll').scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
}
