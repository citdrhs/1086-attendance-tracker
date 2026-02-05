window.onload = function() {
  document.getElementById("get_something").addEventListener("click", function(e) {
    alert("You clicked");
  });

  document.getElementById("post_something").addEventListener("click", function(e) {
    alert("You clicked");
  });
}

// Log out button functionality 
document.getElementById("logoutBtn").addEventListener("click", async() => {
  await fetch("/api/logut", { method:"POST"});
  window.location.href = "auth.html";
});
