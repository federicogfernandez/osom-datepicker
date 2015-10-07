# OSOM DATEPICKER #
A javascript datepicker with multiple dates selection capability.
It has no dependencies, so download it and use it.
### Installation ###
```bash
bower install --save osom-datepicker-2
```
### Usage ###
```javascript
var datepicker = new OsomDatepicker({
	selector: '#osom-datepicker',
	selectedDates: [new Date()], //array of javascript Date objects
	fromDate: new Date(2015, 0, 21), //initial Date object
	animation: 'horizontal', //animation direction
	showMultipleDays: true, //show multiple days selection checkbox
	monthNames: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ], //array month names if you want something different than January February March April May June July August September October November December
	dayNames: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], //array day names if you want something different than S, M, T, W, T, F, S
	weekStart: 'Monday', //day of week start default Sunday, possible value Monday
	onDateSelected: function(dates){} //callback that triggers when selected dates change
});
datepicker.initialize();
```
### What means 'osom'? ###
It's the spanish pronunciaton for Awesome