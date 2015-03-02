# OSOM DATEPICKER #
A javascript datepicker with multiple dates selection capability.
It has no dependencies, so download it and use it.
### Installation ###
```bash
bower install --save osom-datepicker
```
### Usage ###
```javascript
var datepicker = new OsomDatepicker({
	selector: '#osom-datepicker',
	selectedDates: [new Date()] //array of javascript Date objects
});
datepicker.initialize();
```
### Events ###
```javascript
datepicker.on('DATE_SELECTED', function(e){
	console.log(e.detail);
});
```
### What means 'osom'? ###
It's the spanish pronunciaton for Awesome