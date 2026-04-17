const PWD   = 'bluecheese123';
const TOTAL = 10;
const VET_MIN = 7;
const ROO_MIN = 5;

let all = [], shown = [];

// login and logout for admin

function login() {
  if (document.getElementById('pw').value !== PWD) { //shows error and resets input if password is incorrect
    document.getElementById('err').style.display = 'block';
    document.getElementById('pw').value = '';
    return;
  }
  document.getElementById('login').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  loadMembers(); //loads member data
}

function logout() {
  document.getElementById('login').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  document.getElementById('pw').value = '';
  document.getElementById('err').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => //allows pressing enter to log in
  document.getElementById('pw').addEventListener('keydown', e => e.key === 'Enter' && login())
);

// data

async function loadMembers() {
  const res = await fetch('/api/members');
  all = await res.json(); //stores full dataset
  shown = [...all]; 
  render();
  renderReport(); //renders table and view
}

// tabs and filters

function tab(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  btn.classList.add('active');
}

function filter() { //filters members based on dropdown and search
  const sub  = document.getElementById('fSub').value;
  const type = document.getElementById('fType').value;
  const s    = document.getElementById('fSearch').value.toLowerCase();
  shown = all.filter(m =>
    (!sub  || m.subteam === sub) &&
    (!type || m.type === type) &&
    (!s    || m.name.toLowerCase().includes(s))
  );
  render();
}

// rendering

function typeBadge(t) { //returns HTML for member type
  return t === 'Veteran'
    ? '<span class="badge b-blue">Veteran</span>'
    : '<span class="badge b-gray">Rookie</span>';
}

function riskBadge(n) { //returns risk level based on attendance percentage
  const pct = n / TOTAL; 
  if (pct < 0.3) return '<span class="badge b-red">High</span>';
  if (pct < 0.5) return '<span class="badge b-orange">Medium</span>';
  return '<span class="badge b-yellow">Low</span>';
}

function render() {
  document.getElementById('tMembers').innerHTML =
    shown.map(m => `<tr>
      <td><strong>${m.name}</strong></td>
      <td>${m.grade ? m.grade + 'th' : '—'}</td>
      <td>${m.subteam}</td>
      <td>${typeBadge(m.type)}</td>
      <td>${m.actual_n} / ${TOTAL}</td>
    </tr>`).join('') || `<tr><td colspan="5" class="empty">No results found.</td></tr>`;

  const risks = [...shown.filter(m => m.risk)].sort((a, b) => a.actual_n - b.actual_n); //at-risk members sorted by lowest attendance
  document.getElementById('tRisk').innerHTML = risks.length
    ? risks.map(m => `<tr>
        <td><strong>${m.name}</strong></td>
        <td>${m.subteam}</td>
        <td>${typeBadge(m.type)}</td>
        <td>${m.actual_n} / ${TOTAL}</td>
        <td>${riskBadge(m.actual_n)}</td>
      </tr>`).join('')
    : `<tr><td colspan="5" class="empty">No at-risk members — great work.</td></tr>`;
}




function getStatus(m) { //finds if a member is passing, at-risk, or failing
  const min = m.type === 'Veteran' ? VET_MIN : ROO_MIN;
  if (m.actual_n > min)   return 'Passing';
  if (m.actual_n === min) return 'At-Risk';
  return 'Failing';
}

function renderReport() { //renders full report with status
  const sorted = [...all].sort((a, b) => {
    const order = { 'Failing': 0, 'At-Risk': 1, 'Passing': 2 };
    return order[getStatus(a)] - order[getStatus(b)];
  });

  document.getElementById('tReport').innerHTML = sorted.map(m => { //builds report table
    const status = getStatus(m);
    const min = m.type === 'Veteran' ? VET_MIN : ROO_MIN;
    const statusBadge =
      status === 'Passing'  ? '<span class="badge b-green">Passing</span>'  :
      status === 'At-Risk'  ? '<span class="badge b-yellow">At-Risk</span>' :
                              '<span class="badge b-red">Failing</span>';
    return `<tr>
      <td><strong>${m.name}</strong></td>
      <td>${m.subteam}</td>
      <td>${typeBadge(m.type)}</td>
      <td>${m.actual_n} / ${TOTAL}</td>
      <td>${min} / ${TOTAL}</td>
      <td>${statusBadge}</td>
    </tr>`;
  }).join('');
  //summary counts
  const passing = sorted.filter(m => getStatus(m) === 'Passing').length;
  const atrisk  = sorted.filter(m => getStatus(m) === 'At-Risk').length;
  const failing = sorted.filter(m => getStatus(m) === 'Failing').length;
  document.getElementById('reportSummary').textContent =
    `${passing} passing · ${atrisk} at-risk · ${failing} failing`;
}

//function downloadReport() {
//  window.open('/api/report');
//}

function downloadReport() { //generates and downloads reports as a csv
  const headers = ['Name', 'Grade', 'Subteam', 'Type', 'Attended', 'Required', 'Total', 'Status', 'At Risk'];

  const escape = (val) => {
    const s = String(val ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const rows = all.map(m => { //builds rows
    const status = getStatus(m);
    const required = m.type === 'Veteran' ? VET_MIN : ROO_MIN;
    return [
      m.name,
      m.grade || '',
      m.subteam,
      m.type,
      m.actual_n,
      required,
      TOTAL,
      status,
      m.risk ? 'Yes' : 'No'
    ].map(escape).join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n'); //creates downloadable file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `2-week-report-${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// profile card 
document.addEventListener("DOMContentLoaded", function () { //shows member details when a row is clicked
  const profileModal = document.getElementById("profileModal");
  const tMembers = document.getElementById("tMembers");
  const profileCloseBtn = profileModal.querySelector(".close-btn");

  tMembers.addEventListener("click", function (e) {
    const row = e.target.closest("tr");
    if (!row) return;

    document.querySelectorAll("#tMembers tr").forEach(r => r.classList.remove("selected")); //highlights selected row
    row.classList.add("selected");

    const cells = row.querySelectorAll("td");
    if (cells.length < 5) return;

    document.getElementById("profileName").textContent = cells[0].innerText;
    document.getElementById("profileGrade").textContent = cells[1].innerText;
    document.getElementById("profileSubteam").textContent = cells[2].innerText;
    document.getElementById("profileType").textContent = cells[3].innerText;
    document.getElementById("profileMeetings").textContent = cells[4].innerText;

    profileModal.style.display = "block";
  });

  profileCloseBtn.onclick = () => {
    profileModal.style.display = "none";
  };

  window.addEventListener("click", function (e) {
    if (e.target === profileModal) {
      profileModal.style.display = "none";
    }
  });
});

// CALENDAR VIEW - pulls real meetings + attendees from the database
const calendarModal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const attendeeList = document.getElementById("attendeeList");

let calendar;

document.addEventListener('DOMContentLoaded', function () { //initializes calender and loads events
  const calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto',
    events: function(info, successCallback, failureCallback) {
      fetch('/api/events')
        .then(r => r.json())
        .then(successCallback)
        .catch(failureCallback);
    },
    eventClick: function(info) { //shows modal when event is clicked
      modalTitle.textContent = info.event.title;

      const date = new Date(info.event.start);
      modalDate.textContent = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      attendeeList.innerHTML = "";
      info.event.extendedProps.attendees.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        attendeeList.appendChild(li);
      });

      calendarModal.classList.remove("hidden");
    }
  });

  calendar.render();
});

function tab(id, btn) { //handles tab switching and mobile behavior
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));

  document.getElementById('sec-' + id).classList.add('active');
  btn.classList.add('active');

  if (window.innerWidth <= 768) {
    document.querySelector('.tabs').classList.remove('open');
  }

  if (id === 'calendar' && calendar) {
    setTimeout(() => {
      calendar.updateSize();
    }, 50);
  }
}

function toggleMenu() {
  const tabs = document.querySelector('.tabs');
  tabs.classList.toggle('open');
}

function editField(id) { //allows editing a field inline
  const span = document.getElementById(id);
  const currentValue = span.textContent;

  span.innerHTML = "";

  const input = document.createElement("input");
  input.type = "text";
  input.value = currentValue;

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.textContent = "Save";

  saveBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    span.textContent = input.value;
  });

  span.appendChild(input);
  span.appendChild(saveBtn);
}

