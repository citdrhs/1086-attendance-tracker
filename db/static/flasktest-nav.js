document.addEventListener("DOMContentLoaded", () => {
    const loggedIn = !!localStorage.getItem("member_id");
    document.getElementById("nav-profile").style.display = loggedIn ? "inline-block" : "none";
    document.getElementById("nav-signin").style.display = loggedIn ? "none" : "inline-block";
});
