var OsomDatepicker = (function(){

	"use strict";

	var OsomDatepickerPrivate = function(options){
		this.options = options;
		this.selectedDates = this.options.selectedDates || [new Date()];
		this.selectedDates.forEach(function(date){
			Helper.resetTime(date);
		});
		this.currentMonth = 0;
		this.centralMonth = 0;
		this.firstMonth = -1;
		this.lastMonth = 1;
		this.multipleDays = this.selectedDates.length > 1 ? true : false;
		this.uniqueId = Date.now();
	};

	OsomDatepickerPrivate.prototype = {

		wrapperClass: 'osom-datepicker-wrapper',
		containerClass: 'osom-datepicker-container',
		sliderClass: 'osom-datepicker-slider',
		monthClass: 'osom-datepicker-month',
		dayClass: 'osom-datepicker-day',
		dayDisabledClass: 'osom-datepicker-daydisabled',
		selectedDayClass: 'osom-datepicker-selectedday',
		animatedClass: 'osom-datepicker-animated',
		upButtonClass: 'osom-datepicker-upbutton',
		downButtonClass: 'osom-datepicker-downbutton',
		multipleDaysClass: 'osom-datepicker-multipledays',
		layoutVerticalClass: 'osom-datepicker-layoutvertical',
		layoutHorizontalClass: 'osom-datepicker-layouthorizontal',

		dayNames: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

		initialize: function(){
			var html = '';
			this.el = document.querySelector(this.options.selector);

			this.el.classList.add(this.wrapperClass);
			if(this.options.animation === 'horizontal'){
				this.el.classList.add(this.layoutHorizontalClass);
			}else{
				this.el.classList.add(this.layoutVerticalClass);
			}

			html += '<div class="osom-datepicker-buttonscontainer">';

			if(this.options.showMultipleDays){
				html += '<input type="checkbox" class="' + this.multipleDaysClass + '" name="' + this.multipleDaysClass + '" id="' + this.multipleDaysClass + '-' + this.uniqueId + '" ' + (this.multipleDays ? 'checked="checked"' : '') + ' />';
				html += '<label for="' + this.multipleDaysClass + '-' + this.uniqueId + '">Multiple Days</label>';
			}

			if(this.options.animation === 'horizontal'){
				html += '<button class="' + this.upButtonClass + '">&#9668;</button>';
				html += '<button class="' + this.downButtonClass + '">&#9658;</button>';
			}else{
				html += '<button class="' + this.upButtonClass + '">&#9650;</button>';
				html += '<button class="' + this.downButtonClass + '">&#9660;</button>';
			}
			html += '</div>';

			html += '<div class="' + this.containerClass + '">';
			html += '<div class="' + this.sliderClass + '">';
			for(var i = -1; i <= 1; i++){
				var date = Helper.addMonth(this.selectedDates[0], i);
				html += this.renderMonth(date);
			}
			html += '</div>';
			html += '</div>';

			this.el.innerHTML = html;

			this.bindEvents();
		},

		renderMonth: function(date){
			var html = '';
			var year = date.getMonth()+1 <= 11 ? date.getFullYear() : date.getFullYear()+1;
			var month = date.getMonth()+1 <= 11 ? date.getMonth()+1 : 0;
			var auxDate = new Date(year, month, 0);
			
			html += '<div class="' + this.monthClass + '"><span>' + Helper.getMonthName(date.getMonth(), this.options.monthNames) + ' ' + date.getFullYear() + '</span><table>';

			html += '<thead>';
			var names = this.options.dayNames || this.dayNames;
			names.forEach(function(day){
				html += '<th>' + day + '</th>';
			});
			html += '</thead>';

			html += '<tbody>';
			var dayNumber = 0;
			for(var week = 1; week <= 6; week++){
				var dayOfWeek = this.options.weekStart === 'Monday' ? 1 : 0;
				html += '<tr>';
				do{
					var day = new Date(date.getFullYear(), date.getMonth(), dayNumber+1);
					var currentDayOfWeek = (day.getDay() === 0 && this.options.weekStart === 'Monday') ? 7 : day.getDay();

					if(currentDayOfWeek === dayOfWeek && dayNumber <= day.getDate()){
						var classes = this.dayClass;
						html += '<td>';

						if(this.options.fromDate){
							Helper.resetTime(this.options.fromDate);
							if(day < this.options.fromDate){
								classes += ' ' + this.dayDisabledClass;
							}
						}

						if(this.selectedDates.map(Number).indexOf(+day) !== -1){
							classes += ' ' + this.selectedDayClass;
						}

						html += '<button class="' + classes + '" data-date="' + day.getTime() + '">' + day.getDate() + '</button>';
						html += '</td>';
						dayNumber++;
					}else{
						html += '<td>&nbsp;</td>';
					}
					dayOfWeek++;
				}while((this.options.weekStart === 'Monday' && dayOfWeek <= 7) || dayOfWeek <= 6);
				html += '</tr>';
			}
			html += '</tbody>';
			html += '</table></div>';

			return html;
		},

		prevMonth: function(){
			var prevMonth = this.options.fromDate ? Helper.addMonth(this.options.fromDate, this.currentMonth-1) : null;
			console.log(prevMonth, this.options.fromDate);
			if(!this.animating && (!prevMonth || this.options.fromDate <= prevMonth)){
				var self = this;
				this.animating = true;

				this.currentMonth--;
				var slider = this.el.querySelector('.' + this.sliderClass);
				var monthWidth = slider.offsetWidth / slider.children.length;
				var monthHeight = slider.offsetHeight / slider.children.length;
				var sliderStyle = window.getComputedStyle(slider, null);

				if(this.currentMonth < this.firstMonth){
					this.firstMonth = this.currentMonth;

					var date = Helper.addMonth(this.selectedDates[0], this.currentMonth);
					slider.insertAdjacentHTML('afterbegin', this.renderMonth(date));
					if(this.options.animation === 'horizontal'){
						slider.style.left = (parseInt(sliderStyle.left, 10) - monthWidth) + 'px';
						//FORCING REPAINT
						slider.offsetWidth;
					}else{
						slider.style.top = (parseInt(sliderStyle.top, 10) - monthHeight) + 'px';
						//FORCING REPAINT
						slider.offsetHeight;
					}
				}
				
				slider.classList.add(this.animatedClass);
				if(this.options.animation === 'horizontal'){
					slider.style.left = parseInt(slider.style.left || sliderStyle.left, 10) + monthWidth + 'px';
				}else{
					slider.style.top = parseInt(slider.style.top || sliderStyle.top, 10) + monthHeight + 'px';
				}
				
				setTimeout(function(){
					self.animating = false;
					slider.classList.remove(self.animatedClass);
				}, 1000);
			}
		},

		nextMonth: function(){
			if(!this.animating){
				var self = this;
				this.animating = true;

				this.currentMonth++;
				var slider = this.el.querySelector('.' + this.sliderClass);
				var monthWidth = slider.offsetWidth / slider.children.length;
				var monthHeight = slider.offsetHeight / slider.children.length;
				var sliderStyle = window.getComputedStyle(slider, null);

				if(this.currentMonth > this.lastMonth){
					this.lastMonth = this.currentMonth;

					var date = Helper.addMonth(this.selectedDates[0], this.currentMonth);
					slider.insertAdjacentHTML('beforeend', this.renderMonth(date));
				}

				slider.classList.add(this.animatedClass);
				if(this.options.animation === 'horizontal'){
					slider.style.left = parseInt(slider.style.left || sliderStyle.left, 10) - monthWidth + 'px';
				}else{
					slider.style.top = parseInt(slider.style.top || sliderStyle.top, 10) - monthHeight + 'px';
				}
				setTimeout(function(){
					self.animating = false;
					slider.classList.remove(self.animatedClass);
				}, 800);
			}
		},

		bindEvents: function(){
			var self = this;
			var upButton = this.el.querySelector('.'+this.upButtonClass);
			var downButton = this.el.querySelector('.'+this.downButtonClass);
			var slider = this.el.querySelector('.' + this.sliderClass);
			var multipleDays = this.el.querySelector('.' + this.multipleDaysClass);

			upButton.addEventListener('click', function(){
				self.prevMonth();
			});

			downButton.addEventListener('click', function(){
				self.nextMonth();
			});

			if(this.options.showMultipleDays){
				multipleDays.addEventListener('change', function(){
					self.toggleMultipleDays();
				});
			}

			slider.addEventListener('click', function(e){
				if(e.target.classList.contains(self.dayClass) && !e.target.classList.contains(self.dayDisabledClass)){
					self.handleDayClick(e.target);
				}
			});
		},

		handleDayClick: function(day){
			var self = this;

			if(!this.multipleDays){
				var days = this.el.querySelectorAll('.' + this.selectedDayClass);

				Array.prototype.forEach.call(days, function(d){
					d.classList.remove(self.selectedDayClass);
				});

				this.selectedDates = [new Date(parseInt(day.dataset.date, 10))];
			}else{
				if(day.classList.contains(this.selectedDayClass)){
					var index = this.selectedDates.map(Number).indexOf(+new Date(parseInt(day.dataset.date, 10)));
					if(index !== -1){
						this.selectedDates.splice(index, 1);
					}
				}else{
					this.selectedDates.push(new Date(parseInt(day.dataset.date, 10)));
					this.selectedDates.sort(Helper.sortDates);
				}
			}

			day.classList.toggle(this.selectedDayClass);

			if(this.options.onDateSelected){
				this.options.onDateSelected(this.selectedDates);
			}
		},

		toggleMultipleDays: function(){
			this.multipleDays = !this.multipleDays;

			if(this.selectedDates.length > 1){
				var day = this.el.querySelector('button[data-date="' + this.selectedDates[0].getTime() + '"]');
				this.handleDayClick(day);
			}
		},

		setDates: function(dates){
			var self = this;
			var checkbox = this.el.querySelector('.' + this.multipleDaysClass);
			var days = this.el.querySelectorAll('.' + this.selectedDayClass);

			Array.prototype.forEach.call(days, function(d){
				d.classList.remove(self.selectedDayClass);
			});

			if(dates.length > 1){
				this.multipleDays = true;
				checkbox.checked = true;
			}else{
				this.multipleDays = false;
				checkbox.checked = false;
			}
			this.selectedDates = dates;
			this.selectedDates.sort(Helper.sortDates);

			this.selectedDates.forEach(function(date){
				Helper.resetTime(date);
				var day = self.el.querySelector('button[data-date="' + date.getTime() + '"]');
				day.classList.toggle(self.selectedDayClass);
			});

			if(this.options.onDateSelected){
				this.options.onDateSelected(this.selectedDates);
			}
		}

	};

	//HELPER
	var Helper = {
		addMonth: function(date, add){
			var newDate = new Date(date.getTime());
			newDate.setDate(1);
			newDate.setMonth(date.getMonth()+add);
			newDate.setDate(date.getDate());

			return newDate;
		},

		getMonthName: function(month, monthNames){
			monthNames = monthNames || [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
			return monthNames[month];
		},

		resetTime: function(date){
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
		},

		sortDates: function(a, b){
			if(a < b){
				return -1;
			}else if(a > b){
				return 1;
			}
			return 0;
		}
	};

	//PUBLIC API
	var datepickerInstance = null;
	var OsomDatepickerPublic = function(options){
		datepickerInstance = new OsomDatepickerPrivate(options);
	}

	OsomDatepickerPublic.prototype = {

		initialize: function(){
			datepickerInstance.initialize();
		},

		setDates: function(dates){
			datepickerInstance.setDates(dates);
		},

		getSelectedDates: function(dates){
			return datepickerInstance.selectedDates;
		},

		toggleMultipleDays: function(){
			datepickerInstance.toggleMultipleDays();
		}

	};

	return OsomDatepickerPublic;

});

if ( typeof define === "function" && define.amd ) {
	define( "osomdatepicker", [], function() {
		return OsomDatepicker();
	});
}else{
	OsomDatepicker = OsomDatepicker();
}