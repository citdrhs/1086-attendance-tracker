const PWD   = 'bluecheese123';
const TOTAL = 10;
const VET_MIN = 7;
const ROO_MIN = 5;

const modal = document.getElementById("profileModal");


let all = [], shown = [];

// login for admin

function login() {
  if (document.getElementById('pw').value !== PWD) {
    document.getElementById('err').style.display = 'block';
    document.getElementById('pw').value = '';
    return;
  }
  document.getElementById('login').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  loadMembers();
}

function logout() {
  document.getElementById('login').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  document.getElementById('pw').value = '';
  document.getElementById('err').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () =>
  document.getElementById('pw').addEventListener('keydown', e => e.key === 'Enter' && login())
);

// data

async function loadMembers() {
  // connect to flask here to get real data instead of mock data
  all = getMockData();
  shown = [...all];
  render();
  renderReport();
}

// tabs and filters

function tab(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  btn.classList.add('active');
}

function filter() {
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

function typeBadge(t) {
  return t === 'Veteran'
    ? '<span class="badge b-blue">Veteran</span>'
    : '<span class="badge b-gray">Rookie</span>';
}

function riskBadge(n) {
  const pct = n / TOTAL;
  if (pct < 0.3) return '<span class="badge b-red">High</span>';
  if (pct < 0.5) return '<span class="badge b-orange">Medium</span>';
  return '<span class="badge b-yellow">Low</span>';
}

function render() {
  document.getElementById('tMembers').innerHTML =
    shown.map(m => `<tr>
      <td><strong>${m.name}</strong></td>
      <td>${m.grade}th</td>
      <td>${m.subteam}</td>
      <td>${typeBadge(m.type)}</td>
      <td>${m.actual_n} / ${TOTAL}</td>
    </tr>`).join('') || `<tr><td colspan="5" class="empty">No results found.</td></tr>`;

  const risks = [...shown.filter(m => m.risk)].sort((a, b) => a.actual_n - b.actual_n);
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




function getStatus(m) {
  const min = m.type === 'Veteran' ? VET_MIN : ROO_MIN;
  if (m.actual_n > min)   return 'Passing';
  if (m.actual_n === min) return 'At-Risk';
  return 'Failing';
}

function renderReport() {
  const sorted = [...all].sort((a, b) => {
    const order = { 'Failing': 0, 'At-Risk': 1, 'Passing': 2 };
    return order[getStatus(a)] - order[getStatus(b)];
  });

  document.getElementById('tReport').innerHTML = sorted.map(m => {
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

  const passing = sorted.filter(m => getStatus(m) === 'Passing').length;
  const atrisk  = sorted.filter(m => getStatus(m) === 'At-Risk').length;
  const failing = sorted.filter(m => getStatus(m) === 'Failing').length;
  document.getElementById('reportSummary').textContent =
    `${passing} passing · ${atrisk} at-risk · ${failing} failing`;
}

//function downloadReport() {
//  window.open('/api/report');
//}

function downloadReport() {
  window.print();
}

// mock data ( TO BE REMOVED WHEN CONNECTED TO BACKEND FLASK)

function getMockData() {
  return [
    { name: 'Aatish Iyer',           grade: 10, subteam: 'Programming', type: 'Rookie',  actual_n: 5,  risk: true  },
    { name: 'Aditi Inamdar',         grade: 10, subteam: 'Build',    type: 'Rookie',  actual_n: 8,  risk: false },
    { name: 'Ibrahim Alnaqshabandi', grade: 11, subteam: 'Impact',  type: 'Veteran', actual_n: 9,  risk: false },
    { name: 'Nidhira Palakolanu',    grade: 11, subteam: 'Outreach',         type: 'Veteran', actual_n: 7,  risk: false },
    { name: 'Ishant Mekala',          grade: 11, subteam: 'Media',  type: 'Veteran', actual_n: 10, risk: false },
    { name: 'Wuyou Zhan',            grade: 10, subteam: 'Design', type: 'Rookie',  actual_n: 4,  risk: true  },
    { name: 'Yagna Patel',           grade: 11, subteam: 'Media',       type: 'Veteran', actual_n: 8,  risk: false },
    { name: 'Yathu Suryavanshi',     grade: 10,  subteam: 'Build',    type: 'Rookie',  actual_n: 6,  risk: true  },
  ];
  

}

// profile card 
document.getElementById("tMembers").addEventListener("click", function(e) {

  const row = e.target.closest("tr");
  if (!row) return;

  const cells = row.querySelectorAll("td");

  document.getElementById("profileName").textContent = cells[0].innerText;
  document.getElementById("profileGrade").textContent = cells[1].innerText;
  document.getElementById("profileSubteam").textContent = cells[2].innerText;
  document.getElementById("profileType").textContent = cells[3].innerText;
  document.getElementById("profileMeetings").textContent = cells[4].innerText;

  modal.style.display = "block";
});

document.querySelector(".close-btn").onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target == modal) {
      modal.style.display = "none";
  }
};

function editField(id) {

  const span = document.getElementById(id);
  const currentValue = span.textContent;

  const input = document.createElement("input");
  input.value = currentValue;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";

  saveBtn.onclick = () => {
    span.textContent = input.value;
    input.remove();
    saveBtn.remove();
  };

  span.textContent = "";
  span.appendChild(input);
  span.appendChild(saveBtn);
}


