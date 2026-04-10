const memberId = localStorage.getItem('member_id');

document.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.getElementById('member-name');
    const submitBtn = document.getElementById('submit-btn');

    if (!memberId) {
        nameEl.textContent = 'You must be logged in to check in.';
        submitBtn.disabled = true;
        return;
    }

    nameEl.textContent = 'Ready to check in';

    // default the date field to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin-date').value = today;
});

async function submitAttendance() {
    const btn = document.getElementById('submit-btn');
    const msg = document.getElementById('msg');
    const eventName = document.getElementById('event-name').value.trim();
    const checkinDate = document.getElementById('checkin-date').value;

    if (!eventName) {
        msg.textContent = 'Please enter an event name.';
        return;
    }
    if (!checkinDate) {
        msg.textContent = 'Please select a date.';
        return;
    }

    btn.disabled = true;
    msg.textContent = 'Submitting...';

    try {
        const res = await fetch('/api/checkin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                member_id: parseInt(memberId),
                event_name: eventName,
                check_in_date: checkinDate
            })
        });

        const data = await res.json();
        if (res.ok) {
            msg.textContent = 'Attendance recorded!';
        } else {
            msg.textContent = data.error || 'Something went wrong.';
            btn.disabled = false;
        }
    } catch (err) {
        msg.textContent = 'Network error. Please try again.';
        btn.disabled = false;
    }
}


