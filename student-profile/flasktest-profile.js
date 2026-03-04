document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile(){

const response = await fetch("/api/profile");

const data = await response.json();

document.getElementById("username").value = data.username;
document.getElementById("email").value = data.email;
document.getElementById("phone").value = data.phone;
document.getElementById("discord").value = data.discord;
document.getElementById("status").value = data.status;
document.getElementById("subteam").value = data.subteam;

}


document.getElementById("profileForm").addEventListener("submit", async function(e){

e.preventDefault();

const updatedProfile = {

username: document.getElementById("username").value,
email: document.getElementById("email").value,
phone: document.getElementById("phone").value,
discord: document.getElementById("discord").value,
password: document.getElementById("password").value,
status: document.getElementById("status").value,
subteam: document.getElementById("subteam").value

};

const response = await fetch("/api/profile", {

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify(updatedProfile)

});

if(response.ok){

alert("Profile updated!");

}else{

alert("Error updating profile");

}

});
