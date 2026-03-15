const memberId = localStorage.getItem("member_id");

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();

    document.getElementById("save-btn").addEventListener("click", saveProfile);
    document.getElementById("signout-btn").addEventListener("click", () => {
        localStorage.removeItem("member_id");
        window.location.href = "/";
    });
});

async function loadProfile() {
    if (!memberId) {
        window.location.href = "/";
        return;
    }

    const res = await fetch("/api/profile?member_id=" + memberId);
    if (!res.ok) {
        window.location.href = "/";
        return;
    }

    const data = await res.json();
    document.getElementById("usernameText").textContent = data.username;
    document.getElementById("usernameInput").value = data.username;
    document.getElementById("nameText").textContent = data.name;
    document.getElementById("emailText").textContent = data.email;
    document.getElementById("statusText").textContent = data.status;
    document.getElementById("subteamText").textContent = data.subteam || "—";
    document.getElementById("gradeText").textContent = data.grade ? data.grade + "th" : "—";
}

function editField(field) {
    const text = document.getElementById(field + "Text");
    const input = document.getElementById(field + "Input");
    const saveBtn = document.getElementById("save-btn");

    if (input.style.display === "none" || input.style.display === "") {
        input.style.display = "inline-block";
        text.style.display = "none";
        saveBtn.style.display = "block";
    } else {
        text.textContent = input.value || text.textContent;
        input.style.display = "none";
        text.style.display = "inline";
    }
}

async function saveProfile() {
    const msg = document.getElementById("profile-msg");
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");

    const body = { member_id: parseInt(memberId) };

    if (usernameInput.style.display !== "none" && usernameInput.style.display !== "") {
        body.username = usernameInput.value.trim();
    }
    if (passwordInput.style.display !== "none" && passwordInput.style.display !== "") {
        body.password = passwordInput.value.trim();
    }

    if (!body.username && !body.password) {
        msg.textContent = "Nothing to save.";
        return;
    }

    const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok) {
        msg.textContent = "Profile updated!";
        if (body.username) {
            document.getElementById("usernameText").textContent = body.username;
            usernameInput.style.display = "none";
            document.getElementById("usernameText").style.display = "inline";
        }
        if (body.password) {
            passwordInput.style.display = "none";
            document.getElementById("passwordText").style.display = "inline";
        }
        document.getElementById("save-btn").style.display = "none";
    } else {
        msg.textContent = data.error || "Something went wrong.";
    }
}
