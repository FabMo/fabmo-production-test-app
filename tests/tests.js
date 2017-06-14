registerTest({
	name : 'Z Extents',
	description : 'Confirm correct operation of the Z prox switch, wiring, and Z travel',
	f : function() {
		return doSBP('MZ,1\nMZ,0\n');
	}
});

registerTest({
	name : 'Y Extents',
	description : 'Confirm correct operation of the Y prox switch, wiring, and Y travel',
	f : function() {
		return doSBP('END "This file is forked."\n');
	}
});

registerTest({
	name : 'X Prox',
	description : 'Check X Prox Switch Wiring',
	f : function() {
		return new Promise(function(fulfill, reject) {
			//fabmo.runImmediate('ZZ,PZ,10-,3.0,1\n')
			setTimeout(function() {
				fulfill();
			}, 3000)
		});
	}
});
