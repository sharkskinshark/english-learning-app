// Practice calendar functionality
const CALENDAR_KEY = 'englishAppCalendar';

function getCalendarData() {
    const saved = localStorage.getItem(CALENDAR_KEY);
    return saved ? JSON.parse(saved) : {};
}

function updateCalendarData(date = new Date()) {
    const dateStr = date.toISOString().split('T')[0];
    const calendarData = getCalendarData();
    
    if (!calendarData[dateStr]) {
        calendarData[dateStr] = {
            wordsLearned: 0,
            reviewsDone: 0,
            score: 0,
            dailyCompleted: false
        };
    }
    
    calendarData[dateStr].wordsLearned++;
    localStorage.setItem(CALENDAR_KEY, JSON.stringify(calendarData));
    return calendarData[dateStr];
}

function generateCalendarHTML(year, month) {
    const date = new Date(year, month);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const calendarData = getCalendarData();
    const currentDate = new Date();
    
    let html = `
        <div class="calendar-header">
            <button id="prevMonth">◀</button>
            <h3>${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}</h3>
            <button id="nextMonth">▶</button>
        </div>
        <div class="calendar-grid">
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
    `;
    
    // Add empty cells for days before start of month
    for (let i = 0; i < startDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = calendarData[dateStr];
        
        const isToday = currentDate.toISOString().split('T')[0] === dateStr;
        const hasActivity = dayData && (dayData.wordsLearned > 0 || dayData.reviewsDone > 0);
        const isComplete = dayData?.dailyCompleted;
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${hasActivity ? 'has-activity' : ''} ${isComplete ? 'complete' : ''}">
                <span class="day-number">${day}</span>
                ${hasActivity ? `
                    <div class="day-stats">
                        ${dayData.wordsLearned > 0 ? `<span title="Words Learned">📚 ${dayData.wordsLearned}</span>` : ''}
                        ${dayData.reviewsDone > 0 ? `<span title="Reviews Done">🔄 ${dayData.reviewsDone}</span>` : ''}
                    </div>
                ` : ''}
                ${isComplete ? '<span class="complete-mark">✅</span>' : ''}
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

// Helper function to update calendar display
function updateCalendarDisplay() {
    const calendarView = document.getElementById('calendarView');
    if (!calendarView) return;
    
    const today = new Date();
    calendarView.innerHTML = generateCalendarHTML(today.getFullYear(), today.getMonth());
    
    // Add event listeners for month navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        const [year, month] = getCurrentCalendarDate();
        const newDate = new Date(year, month - 1);
        calendarView.innerHTML = generateCalendarHTML(newDate.getFullYear(), newDate.getMonth());
        updateCalendarDisplay();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        const [year, month] = getCurrentCalendarDate();
        const newDate = new Date(year, month + 1);
        calendarView.innerHTML = generateCalendarHTML(newDate.getFullYear(), newDate.getMonth());
        updateCalendarDisplay();
    });
}

function getCurrentCalendarDate() {
    const headerText = document.querySelector('.calendar-header h3').textContent;
    const [month, year] = headerText.split(' ');
    const monthIndex = new Date(Date.parse(`${month} 1, ${year}`)).getMonth();
    return [parseInt(year), monthIndex];
}