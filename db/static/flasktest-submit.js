const params = new URLSearchParams(window.location.search);
const memberId = params.get('id');

if (!memberId) {
    document.getElementById('member-name').textContent = 'Invalid check-in link.';
    document.getElementById('submit-btn').disabled = true;
}

async function submitAttendance() {
    const btn = document.getElementById('submit-btn');
    const msg = document.getElementById('msg');
    btn.disabled = true;
    msg.textContent = 'Submitting...';

    const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId })
    });

    const data = await res.json();
    if (res.ok) {
        msg.textContent = 'Attendance recorded!';
    } else {
        msg.textContent = data.error || 'Something went wrong.';
        btn.disabled = false;
    }
}
