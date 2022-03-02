export class Errors {

    static inputErrorBorderHighlight(inputId) {
        const errorColor = "#ff0000";
        const field = document.getElementById(inputId);
        field.style.borderColor = errorColor;
        field.style.borderWidth = '5px';
    }

    static resetBorders(borderAttributes, elementIds) {
        const borderColor = borderAttributes[0];
        const borderWidth = borderAttributes[1];
        elementIds.forEach(function(elementId) {
            document.getElementById(elementId).style.borderColor = borderColor;
            document.getElementById(elementId).style.borderWidth = borderWidth;
        });
        try {
            errorMessage(null, 'error-message');
        } catch { }
        try {
            infoMessage(null, 'info-message');
        } catch { }
    }

    static errorMessage(message, errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        if (message == null) {
            errorElement.innerHTML = "";
            errorElement.style.display = 'none';
        } else {
            errorElement.innerHTML = message;
            errorElement.style.display = 'block';
            this.scrollToTop();
        }
    }

    static infoMessage(message, infoElementId) {
        const infoElement = document.getElementById(infoElementId);
        if (message == null) {
            infoElement.innerHTML = "";
            infoElement.style.display = 'none';
        } else {
            infoElement.innerHTML = message;
            infoElement.style.display = 'block';
            this.scrollToTop();
        }
    }

    static scrollToTop() {
        document.getElementById('scroll').scrollTo(0, 0);
        document.getElementById('scroll').scrollTop = 0; // For Safari
        document.getElementById('scroll').scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
}