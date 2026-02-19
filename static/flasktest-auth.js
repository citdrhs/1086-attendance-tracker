// ---------------- ELEMENTS ----------------
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("form");
const msg = document.getElementById("msg");
const title = document.getElementById("title");

// all fields that should ONLY appear during signup
const signupOnly = document.querySelectorAll(".signup-only");

// mode state
let mode = "login"; // "login" or "signup"


// ---------------- SHOW/HIDE SIGNUP FIELDS ----------------
function toggleSignupFields(show) {
  signupOnly.forEach(el => {
    el.style.display = show ? "block" : "none";
  });
}


// ---------------- SWITCH MODE ----------------
function setMode(next) {
  mode = next;
  msg.textContent = "";

  if (mode === "login") {
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");

    toggleSignupFields(false);

    submitBtn.textContent = "Login";
    title.textContent = "Welcome";
    document.getElementById("password").autocomplete = "current-password";

  } else {
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");

    toggleSignupFields(true);

    submitBtn.textContent = "Create Account";
    title.textContent = "Sign Up";
    document.getElementById("password").autocomplete = "new-password";
  }
}


// ---------------- TAB CLICKS ----------------
tabLogin.addEventListener("click", () => setMode("login"));
tabSignup.addEventListener("click", () => setMode("signup"));


// ---------------- FORM SUBMIT ----------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Working...";

  const name = document.getElementById("name").value.trim();
  const password = document.getElementById("password").value.trim();

  const emailField = document.getElementById("email");
  const email = emailField ? emailField.value.trim() : "";

  // collect subteam checkboxes
  const checked = document.querySelectorAll('input[name="subteam"]:checked');
  const subteams = Array.from(checked).map(cb => cb.value);

  const memberTypeField = document.getElementById("member-type");
  const memberType = memberTypeField ? memberTypeField.value.trim() : "";

  try {
    const res = await fetch(
      mode === "login" ? "/api/login" : "/api/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login"
            ? { name, password }
            : { name, password, email, subteams, memberType }
        ),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.error || "Something went wrong.";
      return;
    }

    msg.textContent = "Success! Redirecting...";
    window.location.href = "index.html";

  } catch (err) {
    msg.textContent = "Network error. Is server running?";
  }
});


// ---------------- DEFAULT MODE ON LOAD ----------------
setMode("login");
