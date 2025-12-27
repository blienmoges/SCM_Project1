async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function getCurrentUser() {
  return sessionStorage.getItem("sp_current_user");
}

function logout() {
  sessionStorage.removeItem("sp_current_user");
  window.location.href = "login.html";
}

function loadRegistrations() {
  const raw = localStorage.getItem("sp_registrations");
  return raw ? JSON.parse(raw) : [];
}

function saveRegistrations(regs) {
  localStorage.setItem("sp_registrations", JSON.stringify(regs));
}

function ensureUserReg(regs, username) {
  let userReg = regs.find(r => r.username === username);
  if (!userReg) {
    userReg = { username, courses: [] };
    regs.push(userReg);
    saveRegistrations(regs);
  }
  return userReg;
}

function renderMyCourses(userReg, coursesById, regs) {
  const container = document.getElementById("myCourses");
  container.innerHTML = "";

  if (!userReg.courses.length) {
    container.innerHTML = `<p style="color:#64748b;margin:10px 0;">No registered courses yet.</p>`;
    return;
  }

  userReg.courses.forEach(courseId => {
    const c = coursesById[courseId];
    const title = c ? `${c.code} - ${c.title}` : courseId;

    const item = document.createElement("div");
    item.className = "course-item";

    const left = document.createElement("div");
    left.innerHTML = `<div class="course-title">${title}</div>
                      <div class="course-sub">Status: Registered</div>`;

    const dropBtn = document.createElement("button");
    dropBtn.className = "small-btn danger";
    dropBtn.textContent = "Drop";

    // ✅ DROP WORKS HERE
    dropBtn.addEventListener("click", () => {
      userReg.courses = userReg.courses.filter(id => id !== courseId);
      saveRegistrations(regs);
      renderMyCourses(userReg, coursesById, regs);

      const msg = document.getElementById("regMsg");
      msg.className = "msg success";
      msg.textContent = `Dropped: ${title}`;
    });

    item.appendChild(left);
    item.appendChild(dropBtn);
    container.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const username = getCurrentUser();
  if (!username) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("logoutBtn").addEventListener("click", logout);

  try {
    const students = await loadJson("./data/students.json");
    const courses = await loadJson("./data/courses.json");

    const student = students.find(s => s.username === username);
    document.getElementById("studentName").textContent = student ? student.name : username;
    document.getElementById("studentIdBadge").textContent = student ? student.studentId : "ID";
    document.getElementById("profileInfo").textContent = student
      ? `Program: ${student.program} | Year: ${student.year}`
      : "Profile not found.";

    const courseSelect = document.getElementById("courseSelect");
    courseSelect.innerHTML = "";
    courses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.code} - ${c.title}`;
      courseSelect.appendChild(opt);
    });

    const coursesById = {};
    courses.forEach(c => (coursesById[c.id] = c));

    const regs = loadRegistrations();
    const userReg = ensureUserReg(regs, username);

    // render existing
    renderMyCourses(userReg, coursesById, regs);

    document.getElementById("registerBtn").addEventListener("click", () => {
      const selectedId = courseSelect.value;
      const msg = document.getElementById("regMsg");

      if (userReg.courses.includes(selectedId)) {
        msg.className = "msg error";
        msg.textContent = "You already registered this course.";
        return;
      }

      userReg.courses.push(selectedId);
      saveRegistrations(regs);
      renderMyCourses(userReg, coursesById, regs);

      const c = coursesById[selectedId];
      msg.className = "msg success";
      msg.textContent = `Registered: ${c.code} - ${c.title}`;
    });

  } catch (err) {
    const msg = document.getElementById("regMsg");
    msg.className = "msg error";
    msg.textContent = `Error: ${err.message}`;
  }
});
