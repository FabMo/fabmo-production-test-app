registerTest({
	name : 'Z Extents',
	description : 'Confirm correct operation of the Z prox switch, wiring, and Z travel',
	f : function() {
		var test_result = {}
		return doModal({title:'Moving Z Axis', message:'Preparing to move the Z.  Make sure the area is clear.'})
			.then(
				function resolve() {
					return doSBPURL('tests/sbp/z-extents.sbp');
				}
			)
			.then(
				function resolve() {
					return new Promise(function(resolve, reject) {
						fabmo.getConfig(function(err, data) {
							if(err) { reject(err); }
							try {								
								var dist = data.opensbp.variables.zpcheck;
								if(Math.abs(dist-0.5) > 0.005) {
									var e = new Error('Proximity switch distance discrepancy too great: ' + dist)
									return reject(e)
								}
								resolve({dist : dist});
							} catch(e) {
								reject(e);
							}						
						});
					});
				}
			);
	}
});

registerTest({
	name : 'Y Extents',
	description : 'Confirm correct operation of the Y prox switch, wiring, and Y travel',
	f : function() {
		var test_result = {}
		return doModal({title:'Moving Y Axis', message:'Preparing to move the Y.  Make sure the area is clear.'})
			.then(
				function resolve() {
					return doSBPURL('tests/sbp/y-extents.sbp');
				}
			)
			.then(
				function resolve() {
					return new Promise(function(resolve, reject) {
						fabmo.getConfig(function(err, data) {
							if(err) { reject(err); }
							try {								
								var yp = data.opensbp.variables.yp;
								var yn = data.opensbp.variables.yn;
								var ypcheck = data.opensbp.variables.ypcheck;
								var yncheck = data.opensbp.variables.yncheck;

								if(Math.abs(ypcheck-0.5) > 0.005) {
									var e = new Error('Proximity switch distance discrepancy too great at positive stop: ' + Math.abs(ypcheck))
									return reject(e)
								}

								if(Math.abs(yncheck-0.5) > 0.005) {
									var e = new Error('Proximity switch distance discrepancy too great at negative stop: ' + Math.abs(yncheck))
									return reject(e)
								}

								resolve({dist : dist});
							} catch(e) {
								reject(e);
							}						
						});
					});
				}
			);
	}
});

