        class HotelBookingCalendar {
            constructor() {
                this.checkInDate = new Date('2025-05-29');
                this.checkOutDate = new Date('2025-05-30');
                this.currentMonth = 4; // May (0-indexed)
                this.currentYear = 2025;
                this.selectingCheckIn = true;
                this.guests = { rooms: 1, adults: 1, children: 0 };
                
                this.months = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];

                this.init();
            }

            init() {
                // Event listeners
                document.getElementById('checkInInput').addEventListener('click', () => this.openCalendar(true));
                document.getElementById('checkOutInput').addEventListener('click', () => this.openCalendar(false));
                document.getElementById('guestsInput').addEventListener('click', () => this.toggleGuestsDropdown());
                document.getElementById('closeBtn').addEventListener('click', () => this.closeCalendar());
                document.getElementById('confirmBtn').addEventListener('click', () => this.closeCalendar());
                document.getElementById('calendarOverlay').addEventListener('click', (e) => {
                    if (e.target === document.getElementById('calendarOverlay')) {
                        this.closeCalendar();
                    }
                });
                document.getElementById('prevBtn').addEventListener('click', () => this.navigateMonth(-1));
                document.getElementById('nextBtn').addEventListener('click', () => this.navigateMonth(1));

                // Guest controls
                document.getElementById('roomsPlus').addEventListener('click', () => this.updateGuests('rooms', 1));
                document.getElementById('roomsMinus').addEventListener('click', () => this.updateGuests('rooms', -1));
                document.getElementById('adultsPlus').addEventListener('click', () => this.updateGuests('adults', 1));
                document.getElementById('adultsMinus').addEventListener('click', () => this.updateGuests('adults', -1));
                document.getElementById('childrenPlus').addEventListener('click', () => this.updateGuests('children', 1));
                document.getElementById('childrenMinus').addEventListener('click', () => this.updateGuests('children', -1));

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.guests-container')) {
                        this.closeGuestsDropdown();
                    }
                });

                this.updateInputs();
                this.renderCalendar();
                this.updateGuestsDisplay();
            }

            toggleGuestsDropdown() {
                const dropdown = document.getElementById('guestsDropdown');
                dropdown.classList.toggle('show');
            }

            closeGuestsDropdown() {
                const dropdown = document.getElementById('guestsDropdown');
                dropdown.classList.remove('show');
            }

            updateGuests(type, change) {
                const newValue = this.guests[type] + change;
                if (newValue >= 0 && newValue <= 10) { // Set reasonable limits
                    if (type === 'adults' && newValue === 0) return; // At least 1 adult required
                    if (type === 'rooms' && newValue === 0) return; // At least 1 room required
                    
                    this.guests[type] = newValue;
                    this.updateGuestsDisplay();
                }
            }

            updateGuestsDisplay() {
                document.getElementById('roomsCount').textContent = this.guests.rooms;
                document.getElementById('adultsCount').textContent = this.guests.adults;
                document.getElementById('childrenCount').textContent = this.guests.children;
                
                // Update buttons state
                document.getElementById('roomsMinus').disabled = this.guests.rooms <= 1;
                document.getElementById('adultsMinus').disabled = this.guests.adults <= 1;
                document.getElementById('childrenMinus').disabled = this.guests.children <= 0;
                
                // Update input display
                const guestsText = `${this.guests.rooms} Room, ${this.guests.adults} Adult, ${this.guests.children} Child`;
                document.getElementById('guestsInput').value = guestsText;
            }

            openCalendar(selectingCheckIn) {
                this.selectingCheckIn = selectingCheckIn;
                document.getElementById('modalTitle').textContent = 
                    selectingCheckIn ? 'Select Check-in Date' : 'Select Check-out Date';
                document.getElementById('calendarOverlay').style.display = 'block';
                this.renderCalendar();
            }

            closeCalendar() {
                document.getElementById('calendarOverlay').style.display = 'none';
            }

            navigateMonth(direction) {
                this.currentMonth += direction;
                if (this.currentMonth < 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                } else if (this.currentMonth > 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                }
                this.renderCalendar();
            }

            renderCalendar() {
                this.renderMonth(this.currentMonth, this.currentYear, 'currentMonthHeader', 'currentMonthGrid');
                
                let nextMonth = this.currentMonth + 1;
                let nextYear = this.currentYear;
                if (nextMonth > 11) {
                    nextMonth = 0;
                    nextYear++;
                }
                this.renderMonth(nextMonth, nextYear, 'nextMonthHeader', 'nextMonthGrid');
                this.updateFooter();
            }

            renderMonth(month, year, headerId, gridId) {
                const header = document.getElementById(headerId);
                const grid = document.getElementById(gridId);
                
                header.textContent = `${this.months[month]} ${year}`;
                
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const daysInMonth = lastDay.getDate();
                const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0
                
                grid.innerHTML = '';
                
                // Previous month's trailing days
                const prevMonth = month === 0 ? 11 : month - 1;
                const prevYear = month === 0 ? year - 1 : year;
                const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
                
                for (let i = startingDayOfWeek - 1; i >= 0; i--) {
                    const day = daysInPrevMonth - i;
                    const dayElement = this.createDayElement(day, prevMonth, prevYear, true);
                    grid.appendChild(dayElement);
                }
                
                // Current month's days
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayElement = this.createDayElement(day, month, year, false);
                    grid.appendChild(dayElement);
                }
                
                // Next month's leading days
                const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
                const nextMonthDays = totalCells - (startingDayOfWeek + daysInMonth);
                
                const nextMonthIndex = month === 11 ? 0 : month + 1;
                const nextYearIndex = month === 11 ? year + 1 : year;
                
                for (let day = 1; day <= nextMonthDays; day++) {
                    const dayElement = this.createDayElement(day, nextMonthIndex, nextYearIndex, true);
                    grid.appendChild(dayElement);
                }
            }

            createDayElement(day, month, year, isOtherMonth) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day;
                
                if (isOtherMonth) {
                    dayElement.classList.add('other-month');
                }
                
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const currentDate = new Date(dateString);
                
                // Check if it's today
                const today = new Date();
                if (currentDate.toDateString() === today.toDateString()) {
                    dayElement.classList.add('today');
                }
                
                // Check if selected
                if (this.isSameDate(currentDate, this.checkInDate) || this.isSameDate(currentDate, this.checkOutDate)) {
                    dayElement.classList.add('selected');
                }
                
                // Check if in range
                if (currentDate > this.checkInDate && currentDate < this.checkOutDate) {
                    dayElement.classList.add('in-range');
                }
                
                if (!isOtherMonth) {
                    dayElement.addEventListener('click', () => this.selectDate(currentDate));
                }
                
                return dayElement;
            }

            selectDate(date) {
                if (this.selectingCheckIn) {
                    this.checkInDate = date;
                    this.selectingCheckIn = false;
                    document.getElementById('modalTitle').textContent = 'Select Check-out Date';
                } else {
                    if (date <= this.checkInDate) {
                        // If checkout is before checkin, swap them
                        this.checkOutDate = this.checkInDate;
                        this.checkInDate = date;
                    } else {
                        this.checkOutDate = date;
                    }
                    this.closeCalendar();
                }
                
                this.updateInputs();
                this.renderCalendar();
            }

            isSameDate(date1, date2) {
                return date1.toDateString() === date2.toDateString();
            }

            formatDate(date) {
                return date.getFullYear() + '-' + 
                       String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(date.getDate()).padStart(2, '0');
            }

            updateInputs() {
                document.getElementById('checkInInput').value = this.formatDate(this.checkInDate);
                document.getElementById('checkOutInput').value = this.formatDate(this.checkOutDate);
            }

            updateFooter() {
                document.getElementById('selectedCheckIn').textContent = this.formatDate(this.checkInDate);
                document.getElementById('selectedCheckOut').textContent = this.formatDate(this.checkOutDate);
            }
        }

    // Initialize the calendar when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        new HotelBookingCalendar();
    });