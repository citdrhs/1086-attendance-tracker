const PWD   = 'bluecheese123';
const TOTAL = 10;
const VET_MIN = 7;
const ROO_MIN = 5;

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
  const res = await fetch('/api/members');
  all = await res.json();
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
      <td>${m.grade ? m.grade + 'th' : '—'}</td>
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

