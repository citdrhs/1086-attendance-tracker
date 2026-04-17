document.addEventListener("DOMContentLoaded", () => { //runs code when HTML is fully loaded
    const loggedIn = !!localStorage.getItem("member_id");
    document.getElementById("nav-profile").style.display = loggedIn ? "inline-block" : "none";// shows profile button if logged in and hides it if not
    document.getElementById("nav-signin").style.display = loggedIn ? "none" : "inline-block";//hides sign in button if logged in, shows it if not
});
