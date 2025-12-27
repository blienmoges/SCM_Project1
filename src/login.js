async function loadStudents() {
  const res = await fetch("./data/students.json");
  if (!res.ok) throw new Error("students.json not found");
  return res.json();
}

function setRememberedUser(username) {
  localStorage.setItem("sp_remembered_user", username);
}
function getRememberedUser() {
  return localStorage.getItem("sp_remembered_user");
}
function setSession(username) {
  sessionStorage.setItem("sp_current_user", username);
}

document.addEventListener("DOMContentLoaded", () => {
  const msg = document.getElementById("msg");

  // CR-01: Remember Me behavior (auto-fill username)
  const remembered = getRememberedUser();
  if (remembered) {
    document.getElementById("username").value = remembered;
    document.getElementById("rememberMe").checked = true;
  }

  document.getElementById("loginBtn").addEventListener("click", async () => {
    msg.textContent = "";
    msg.className = "msg";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    if (!username || !password) {
      msg.className = "msg error";
      msg.textContent = "Please enter username and password.";
      return;
    }

    try {
      const students = await loadStudents();
      const user = students.find(s => s.username === username && s.password === password);

      if (!user) {
        msg.className = "msg error";
        msg.textContent = "Invalid credentials. Try again.";
        return;
      }

      setSession(user.username);

      if (rememberMe) setRememberedUser(user.username);
      else localStorage.removeItem("sp_remembered_user");

      window.location.href = "dashboard.html";
    } catch (e) {
      msg.className = "msg error";
      msg.textContent = "Cannot load students.json. Run with Live Server / localhost and check /src/data path.";
    }
  });
});
