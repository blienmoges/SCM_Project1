// Simple JSON-based login (prototype)
async function loadStudents() {
  const res = await fetch("./data/students.json");
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

function getSession() {
  return sessionStorage.getItem("sp_current_user");
}

function clearSession() {
  sessionStorage.removeItem("sp_current_user");
}

document.addEventListener("DOMContentLoaded", () => {
  const remembered = getRememberedUser();
  if (remembered) {
    // If user was remembered, auto-fill username (simple implementation)
    document.getElementById("username").value = remembered;
    document.getElementById("rememberMe").checked = true;
  }

  // If already logged in for this session, go to dashboard
  if (getSession()) {
    window.location.href = "dashboard.html";
  }

  document.getElementById("loginBtn").addEventListener("click", async () => {
    const msg = document.getElementById("msg");
    msg.textContent = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    if (!username || !password) {
      msg.textContent = "Please enter username and password.";
      return;
    }

    try {
      const students = await loadStudents();
      const user = students.find(s => s.username === username && s.password === password);

      if (!user) {
        msg.textContent = "Invalid credentials. Try again.";
        clearSession();
        return;
      }

      setSession(user.username);

      if (rememberMe) setRememberedUser(user.username);
      else localStorage.removeItem("sp_remembered_user");

      window.location.href = "dashboard.html";
    } catch (e) {
      msg.textContent = "Failed to load student data. Check file paths.";
    }
  });
});
