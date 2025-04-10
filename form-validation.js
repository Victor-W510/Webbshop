document.getElementById("orderForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission if input is not correct

    let isValid = true;

    // Clear previous error messages
    document.querySelectorAll(".error-message").forEach((element) => (element.textContent = ""));

    // Form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const street = document.getElementById("street").value.trim();
    const postcode = document.getElementById("postcode").value.trim();
    const city = document.getElementById("city").value.trim();

    // Error message function (inserts div content in HTML)
    function showError(inputId, message) {
        const inputField = document.getElementById(inputId);
        const errorDiv = inputField.nextElementSibling; // Select the error message div
        errorDiv.textContent = message;
        inputField.classList.add("is-invalid"); // Add Bootstrap invalid class
        isValid = false;
    }

    function clearError(inputId) {
        let inputField = document.getElementById(inputId);
        let errorDiv = inputField.nextElementSibling;
        errorDiv.textContent = "";
        inputField.classList.remove("is-invalid"); // Remove Bootstrap invalid class
    }

    // Helper functions for validation
    function validateEmail(email) {
        const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regEx.test(email);
    }

    function validatePhone(phone) {
        const regEx = /^[0-9\-–—()]+$/;
        return regEx.test(phone);
    }

    function validatePostcode(postcode) {
        const regEx = /^(\d{5}|\d{3}\s\d{2})$/; // Accepts both 12345 and 123 45
        return regEx.test(postcode);
    }

    function validateStringLength(input) {
        return !(input.length < 2 || input.length > 50);
    }

    // Validation
    if (!validateStringLength(name)) showError("name", "Namnet måste vara minst 2 tecken och max 50 tecken.");
    else clearError("name");

    if (!validateEmail(email)) showError("email", "Ogiltig e-postadress.");
    else clearError("email");

    if (!validatePhone(phone)) showError("phone", "Ogiltigt telefonnummer. Numret får endast innehålla siffror, bindestreck och parenteser.");
    else clearError("phone");

    if (!validateStringLength(street)) showError("street", "Gatuadress måste vara minst 2 tecken och max 50 tecken.");
    else clearError("street");

    if (!validatePostcode(postcode)) showError("postcode", "Postnummer måste vara 5 siffror.");
    else clearError("postcode");

    if (!validateStringLength(city)) showError("city", "Ort måste vara minst 2 tecken och max 50 tecken.");
    else clearError("city");

    // If valid, submit form
    if (isValid) {
        const successAlert = document.getElementById('successAlert');
        successAlert.style.display = 'block';
        successAlert.style.opacity = '0';

        let opacity = 0;
        const fadeIn = setInterval(() => {
            opacity += 0.1;
            successAlert.style.opacity = opacity;
            if (opacity >= 1) clearInterval(fadeIn);
        }, 50);
    }
});

let products = JSON.parse(localStorage.getItem('chosenProducts')) || [];
let productContainer = document.getElementById("order-summary");

if (products.length === 0) {
    productContainer.innerHTML = "<p>Din varukorg är tom.</p>";
} else {
    products.forEach(product => {
        let productElement = document.createElement("div");
        productElement.className = "m-2";
        productElement.innerHTML = `
            <img src="${product.image}" width="50">
            <span><strong>${product.title}</strong> - ${product.antal || 1} st - ${product.price} $</span>
        `;
        productContainer.appendChild(productElement);
    });

    let totalPrice = products.reduce((sum, item) => sum + (item.price * (item.antal || 1)), 0);
    let totalElement = document.createElement("p");
    totalElement.innerHTML = `<strong>Totalt: ${totalPrice.toFixed(2)} $</strong>`;
    productContainer.appendChild(totalElement);
}
