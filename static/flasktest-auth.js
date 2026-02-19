const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const nameField = document.getElementById("nameField");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("form");
const msg = document.getElementById("msg");
const title = document.getElementById("title");

//checkboxes functionality 
const checked = document.querySelectorAll('input[name="subteam"]:checked');
const subteams = Array.from(checked).map(cb => cb.value);

//sign up vs login tabs 
const signupOnly  = document.querySelectorAll(".signup-only");

tabLogin.onclick = () => {
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");

    signupOnly.forEach(el => el.classList.add("hidden"));
};

tabSignup.onclick = () => {
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");

    signupOnly.forEach(el => el.classList.remove("hidden"));
};

let mode = "login"; // or "signup"

function setMode(next) {
mode = next;
msg.textContent = "";

if (mode === "login") {
tabLogin.classList.add("active");
tabSignup.classList.remove("active");
nameField.classList.add("hidden");
submitBtn.textContent = "Login";
title.textContent = "Welcome back";
document.getElementById("password").autocomplete = "current-password";
} else {
tabSignup.classList.add("active");
tabLogin.classList.remove("active");
nameField.classList.remove("hidden");
submitBtn.textContent = "Create account";
title.textContent = "Create your account";
document.getElementById("password").autocomplete = "new-password";
}
}

tabLogin.addEventListener("click", () => setMode("login"));
tabSignup.addEventListener("click", () => setMode("signup"));

form.addEventListener("submit", async (e) => {
e.preventDefault();
msg.textContent = "Working...";

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;
const name = document.getElementById("name").value.trim();

try {
const res = await fetch(mode === "login" ? "/api/login" : "/api/signup", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(mode === "login" ? { email, password } : { email, password, name })
});

const data = await res.json();
if (!res.ok) {
msg.textContent = data.error || "Something went wrong.";
return;
}

msg.textContent = "Success! Redirecting...";
window.location.href = "index.html";
} catch (err) {
msg.textContent = "Network error. Is the server running?";
}
});

setMode("login");
