const PWD   = 'bluecheese123';
const TOTAL = 10, MIN = 7;

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
  all = getMockData();
  shown = [...all];
  render();
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

// mock data ( TO BE REMOVED WHEN CONNECTED TO BACKEND FLASK)

function getMockData() {
  return [
    { name: 'Aatish Iyer',           grade: 10, subteam: 'Fabrication', type: 'Rookie',  actual_n: 5,  risk: true  },
    { name: 'Aditi Inamdar',         grade: 10, subteam: 'Business',    type: 'Rookie',  actual_n: 8,  risk: false },
    { name: 'Ibrahim Alnaqshabandi', grade: 11, subteam: 'Impact',  type: 'Veteran', actual_n: 9,  risk: false },
    { name: 'Nidhira Palakolanu',    grade: 11, subteam: 'CAD',         type: 'Veteran', actual_n: 7,  risk: false },
    { name: 'Ishant Mekala',          grade: 11, subteam: 'Media',  type: 'Veteran', actual_n: 10, risk: false },
    { name: 'Wuyou Zhan',            grade: 10, subteam: 'Fabrication', type: 'Rookie',  actual_n: 4,  risk: true  },
    { name: 'Yagna Patel',           grade: 11, subteam: 'Media',       type: 'Veteran', actual_n: 8,  risk: false },
    { name: 'Yathu Suryavanshi',     grade: 10,  subteam: 'Strategy',    type: 'Rookie',  actual_n: 6,  risk: true  },
  ];
}