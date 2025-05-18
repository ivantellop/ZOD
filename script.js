const { z } = window.Zod;

// Esquema de validación con Zod
const registerSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    email: z.string().email("El correo no es válido."),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

// Elementos del DOM
const form = document.getElementById("registerForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const successMessage = document.getElementById("successMessage");

// Validación en tiempo real
const validateField = (field, value) => {
    try {
        registerSchema.pick({ [field]: true }).parse({ [field]: value });
        return "";
    } catch (err) {
        return err.errors[0].message;
    }
};

const handleRealtimeValidation = () => {
    nameInput.addEventListener("input", () => {
        nameError.textContent = validateField("name", nameInput.value.trim());
    });

    emailInput.addEventListener("input", () => {
        emailError.textContent = validateField("email", emailInput.value.trim());
    });

    passwordInput.addEventListener("input", () => {
        passwordError.textContent = validateField("password", passwordInput.value.trim());
    });
};

// Envío del formulario
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
    };

    const result = registerSchema.safeParse(formData);

    // Limpiar mensajes anteriores
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    successMessage.textContent = "";

    if (!result.success) {
        result.error.issues.forEach((issue) => {
            if (issue.path[0] === "name") nameError.textContent = issue.message;
            if (issue.path[0] === "email") emailError.textContent = issue.message;
            if (issue.path[0] === "password") passwordError.textContent = issue.message;
        });
    } else {
        successMessage.textContent = "✅ Registro exitoso. ¡Bienvenido!";
        successMessage.style.display = "block";

        // Ocultar mensaje de registro exitoso después de 5 segundos
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 5000);

        form.reset();
    }
});

handleRealtimeValidation();
