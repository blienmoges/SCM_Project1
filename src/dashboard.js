async function loadJson(path) {
  const res = await fetch(path);
  return res.json();
}

function getCurrentUser() {
  return sessionStorage.getItem("sp_current_user");
}

function logout() {
  sessionStorage.removeItem("sp_current_user");
  window.location.href = "login.html";
}

function saveRegistrations(registrations) {
  // Browser can't write to local JSON file directly.
  // For prototype, we store registrations in localStorage.
  localStorage.setItem("sp_registrations", JSON.stringify(registrations));
}

function loadRegistrations() {
  const raw = localStorage.getItem("sp_registrations");
  return raw ? JSON.parse(raw) : [];
}

function renderMyCourses(myCourses, coursesById) {
  const ul = document.getElementById("myCourses");
  ul.innerHTML = "";

  if (myCourses.length === 0) {
    ul.innerHTML = "<li class='small'>No registered courses yet.</li>";
    return;
  }

  myCourses.forEach(courseId => {
    const li = document.createElement("li");
    const course = coursesById[courseId];
    const title = course ? `${course.code} - ${course.title}` : courseId;

    li.textContent = title + " ";

    // CR-02: Drop course
    const dropBtn = document.createElement("button");
    dropBtn.textContent = "Drop";
    dropBtn.style.marginLeft = "10px";
    dropBtn.style.padding = "6px 10px";
    dropBtn.style.borderRadius = "8px";
    dropBtn.style.cursor = "pointer";

    dropBtn.addEventListener("click", () => {
      const user = getCurrentUser();
      const regs = loadRegistrations();
      const userReg = regs.find(r => r.username === user);

      if (!userReg) return;
      userReg.courses = userReg.courses.filter(id => id !== courseId);

      saveRegistrations(regs);
      renderMyCourses(userReg.courses, coursesById);

      const msg = document.getElementById("regMsg");
      msg.className = "success";
      msg.textContent = `Dropped course: ${title}`;
    });

    li.appendChild(dropBtn);
    ul.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("logoutBtn").addEventListener("click", logout);

  const students = await loadJson("./data/students.json");
  const courses = await loadJson("./data/courses.json");

  const student = students.find(s => s.username === user);
  document.getElementById("studentName").textContent = student ? student.name : user;
  document.getElementById("studentIdBadge").textContent = student ? student.studentId : "ID";

  // CR-03: Profile section
  document.getElementById("profileInfo").textContent =
    student ? `Program: ${student.program} | Year: ${student.year}` : "Profile not found.";

  // Fill course dropdown
  const courseSelect = document.getElementById("courseSelect");
  courseSelect.innerHTML = "";
  courses.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = `${c.code} - ${c.title}`;
    courseSelect.appendChild(option);
  });

  // Prepare lookup
  const coursesById = {};
  courses.forEach(c => (coursesById[c.id] = c));

  // Load registrations (prototype storage)
  const regs = loadRegistrations();
  let userReg = regs.find(r => r.username === user);
  if (!userReg) {
    userReg = { username: user, courses: [] };
    regs.push(userReg);
    saveRegistrations(regs);
  }

  renderMyCourses(userReg.courses, coursesById);

  document.getElementById("registerBtn").addEventListener("click", () => {
    const selectedId = courseSelect.value;
    const course = coursesById[selectedId];

    const msg = document.getElementById("regMsg");
    msg.className = "";

    if (userReg.courses.includes(selectedId)) {
      msg.className = "error";
      msg.textContent = "You already registered this course.";
      return;
    }

    userReg.courses.push(selectedId);
    saveRegistrations(regs);

    renderMyCourses(userReg.courses, coursesById);

    msg.className = "success";
    msg.textContent = `Registered successfully: ${course.code} - ${course.title}`;
  });
});
