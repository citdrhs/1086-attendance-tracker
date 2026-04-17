let memberId = localStorage.getItem("member_id"); //gets member ID from local storage, used to check if user is logged in or not

//PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    loadProfile();

    document.getElementById("save-btn").addEventListener("click", saveProfile);
    document.getElementById("signout-btn").addEventListener("click", () => {
        if (memberId) {
            localStorage.removeItem("member_id"); //if logged in, clear session and redirect to home
            window.location.href = "/";
        } else {
            window.location.href = "/auth"; //redirect to auth page if not logged in
        }
    });

    const navMenu = document.querySelector('.nav-menu'); //closes menu  when a link is clicked
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                }
            });
        });
    }
});

//MOBILE MENU TOGGLE
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('open'); //opens/closes the menu
    }
}

//LOAD PROFILE
async function loadProfile() {
    const msg = document.getElementById("profile-msg"); //disables editing and shows placeholders if not logged in
    if (!memberId) {
        document.getElementById("save-btn").disabled = true;
        document.getElementById("signout-btn").textContent = "Sign Out";
        document.getElementById("usernameText").textContent = "—";
        document.getElementById("passwordText").textContent = "—";
        document.getElementById("nameText").textContent = "—";
        document.getElementById("emailText").textContent = "—";
        document.getElementById("statusText").textContent = "—";
        document.getElementById("subteamText").textContent = "—";
        document.getElementById("gradeText").textContent = "—";
        return;
    }

    const res = await fetch("/api/profile?member_id=" + memberId); //gets profile data from backend
    if (!res.ok) {
        msg.textContent = "Unable to load profile. Please sign in again."; //forced relogin if request fails
        document.getElementById("save-btn").disabled = true;
        document.getElementById("signout-btn").textContent = "Sign In";
        return;
    }

    const data = await res.json(); //populates UI with profile data
    document.getElementById("usernameText").textContent = data.username;
    document.getElementById("usernameInput").value = data.username;
    document.getElementById("nameText").textContent = data.name;
    document.getElementById("emailText").textContent = data.email;
    document.getElementById("statusText").textContent = data.status;
    document.getElementById("subteamText").textContent = data.subteam || "—";
    document.getElementById("gradeText").textContent = data.grade ? data.grade + "th" : "—";
}

//INLINE EDITING
function editField(field) {
    const text = document.getElementById(field + "Text");
    const input = document.getElementById(field + "Input");
    const saveBtn = document.getElementById("save-btn");

    if (input.style.display === "none" || input.style.display === "") { //shows input if currently hidden
        input.style.display = "inline-block";
        text.style.display = "none";
        saveBtn.style.display = "block";
    } else {
        text.textContent = input.value || text.textContent; //saves locally
        input.style.display = "none";
        text.style.display = "inline";
    }
}

//SAVE PROFILE
async function saveProfile() {
    const msg = document.getElementById("profile-msg");
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");

    const body = { member_id: parseInt(memberId) };

    if (usernameInput.style.display !== "none" && usernameInput.style.display !== "") { //only includes fields that are currently being edited
        body.username = usernameInput.value.trim();
    }
    if (passwordInput.style.display !== "none" && passwordInput.style.display !== "") {
        body.password = passwordInput.value.trim();
    }

    if (!body.username && !body.password) { 
        msg.textContent = "Nothing to save.";
        return;
    }

    const res = await fetch("/api/profile", { //sends update request
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok) {
        msg.textContent = "Profile updated!";
        if (body.username) { //updates UI after success
            document.getElementById("usernameText").textContent = body.username;
            usernameInput.style.display = "none";
            document.getElementById("usernameText").style.display = "inline";
        }
        if (body.password) {
            passwordInput.style.display = "none";
            document.getElementById("passwordText").style.display = "inline"; //hides save button after update
        }
        document.getElementById("save-btn").style.display = "none";
    } else {
        msg.textContent = data.error || "Something went wrong.";
    }
}
