const memberId = localStorage.getItem('member_id'); 

//PAGE LOAD
document.addEventListener('DOMContentLoaded', () => { 
    const nameEl = document.getElementById('member-name');
    const submitBtn = document.getElementById('submit-btn');

    if (!memberId) { //IF user is not logged in, disables check in
        nameEl.textContent = 'You must be logged in to check in.';
        submitBtn.disabled = true;
        return;
    }

    nameEl.textContent = 'Ready to check in'; //shows ready message if logged in

    // default the date field to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin-date').value = today;
});

//SUBMIT ATTENDANCE
async function submitAttendance() {
    const btn = document.getElementById('submit-btn');
    const msg = document.getElementById('msg');
    const eventName = document.getElementById('event-name').value.trim();
    const checkinDate = document.getElementById('checkin-date').value;

    if (!eventName) { //gets user inputs
        msg.textContent = 'Please enter an event name.';
        return;
    }
    if (!checkinDate) { //validates inputs
        msg.textContent = 'Please select a date.';
        return;
    }

    btn.disabled = true; //disables button to stop duplicate submissions
    msg.textContent = 'Submitting...';

    try {
        const res = await fetch('/api/checkin', { //sends checkin request to backend
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                member_id: parseInt(memberId), //sends member id + event info
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
    } catch (err) { //handles network failure
        msg.textContent = 'Network error. Please try again.';
        btn.disabled = false;
    }
}


