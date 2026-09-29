let authForm = document.querySelector(".loginForm,.signupForm");
let isLoginPage = document.getElementById("name") === null;
const API = "http://localhost:3000";
authForm.onsubmit = function (e) {
  e.preventDefault();
  clearError();
  if (isLoginPage) {
    handleLogin();
  } else {
    handleRegister();
  }
};

async function handleLogin() {
  let inEmail = document.getElementById("email").value.trim();
  let inPassword = document.getElementById("password").value;

  if (!inEmail || !inPassword) {
    showError("Email and password required");
    return;
  }
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inEmail, password: inPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      showError(
        Array.isArray(data.message) ? data.message.join(", ") : data.message,
      );
      return;
    }
    localStorage.setItem("token", data.token);
    window.location.href = "../home/index.html";
  } catch {
    showError("server not reachable");
  }
}

async function handleRegister() {
  let name = document.getElementById("name").value.trim();
  let inEmail = document.getElementById("email").value.trim();
  let inPassword = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  if (!name || !inEmail || !inPassword || !confirmPassword) {
    showError("please fill all fields");
    return;
  }
  if (inPassword !== confirmPassword) {
    showError("passwords do not match");
    return;
  }
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inEmail, password: inPassword, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      showError(
        Array.isArray(data.message) ? data.message.join(", ") : data.message,
      );
      return;
    }
    window.location.href = "login.html";
  } catch {
    showError("server not reachable");
  }
}

function showError(message) {
  let errorMsg = document.querySelector(".error-message");
  if (!errorMsg) {
    errorMsg = document.createElement("p");
    errorMsg.className = "error-message";
    authForm.insertBefore(errorMsg, authForm.querySelector("button"));
  }
  errorMsg.textContent = message;
}
function clearError() {
  let errorMsg = document.querySelector(".error-message");
  if (errorMsg) errorMsg.remove();
}
