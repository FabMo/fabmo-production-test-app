registerTest({
	group : 'gantry',
	name : 'Z Extents',
	description : 'Confirm correct operation of the Z prox switch, wiring, and Z travel',
	f : function() {
		var test_result = {}

		return doModal({
			title:'Moving Z Axis', 
			message:'Place the Z-Zero plate underneath the spindle plate, attach the alligator clip to the spindle plate, and connect the Z-Zero cable assembly to the connector on the Y-Z car.  Make sure the deck is clear of obstruction before continuing.',
			image: 'tests/images/zzero-plate.jpg'})
			.then(
				function resolve() {
					return doSBPURL('tests/sbp/z-extents.sbp');
				}
			)
			.then(
				function resolve() {
					return new Promise(function(resolve, reject) {
						fabmo.getConfig(function(err, data) {
							if(err) { return reject(err); }
								var zp = data.opensbp.variables.zp;
								var zn = data.opensbp.variables.zn;
								var zpcheck = data.opensbp.variables.zpcheck;
								var zncheck = data.opensbp.variables.zncheck;

							try {								
								if(Math.abs(Math.abs(zpcheck)-0.5) > 0.010) {
									var e = new Error('Proximity switch distance discrepancy too great at positive stop: ' + Math.abs(ypcheck))
									return reject(e)
								}

								if(Math.abs(Math.abs(zncheck)-0.5) > 0.010) {
									var e = new Error('Proximity switch distance discrepancy too great at negative stop: ' + Math.abs(yncheck))
									return reject(e)
								}
								resolve({
									dist : Math.abs(zp-zn).toFixed(3),
									zpcheck : zpcheck.toFixed(3),
									zncheck : zncheck.toFixed(3)
								});
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
	group : 'gantry',
	name : 'Y Extents',
	description : 'Confirm correct operation of the Y prox switch, wiring, and Y travel',
	f : function() {
		var test_result = {}
		var allowedBeamLengths = [60.0, 48.0, 72.0];
		var overTravel = 1.4;
		var allowedError = 0.5
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
							if(err) { return reject(err); }
							try {								
								var yp = data.opensbp.variables.yp;
								var yn = data.opensbp.variables.yn;
								var ypcheck = data.opensbp.variables.ypcheck;
								var yncheck = data.opensbp.variables.yncheck;

								if(Math.abs(Math.abs(ypcheck)-0.5) > 0.010) {
									var e = new Error('Proximity switch distance discrepancy too great at positive stop: ' + Math.abs(ypcheck))
									return reject(e)
								}

								if(Math.abs(Math.abs(yncheck)-0.5) > 0.010) {
									var e = new Error('Proximity switch distance discrepancy too great at negative stop: ' + Math.abs(yncheck))
									return reject(e)
								}

								resolve({
									dist : Math.abs(yp-yn).toFixed(3),
									ypcheck : ypcheck.toFixed(3),
									yncheck : yncheck.toFixed(3)
								});
							} catch(e) {
								reject(e);
							}						
						});
					});
				}
			);
	}
});
/*
registerTest({
	group : 'gantry',
	name : 'Z-Zero Wiring',
	description : 'Confirm that the input wiring for the Z-Zero connector is correct.',
	f : function() {
		var onStatus = function(status) {
			try {
				if(status.in1) {
					closeModal(true); // Pass
				}
			} catch(e) {
				closeModal(false); // Fail
			}
		}
		fabmo.on('status', onStatus);
		var p = doModal({
			title:'Connect Z-Zero Jumper', 
			message:'Connect the short jumper to the z-zero plate connector.  This message will close when the jumper is detected.',
			image:'tests/images/zzero-plug.jpg',
			hideOk : true,
			onCancel: function() {
				fabmo.off('status', onStatus);
			}
		})

		// Return the promise for the modal, which resolves when either the input is detected, or the user cancels.
		return p;
	}
})*/

registerTest({
	group : 'gantry',
	name : 'Stop Button (Standard Only)',
	description : 'Confirm that the input wiring for stop button is correct.',
	f : function() {
		var onStatus = function(status) {
			try {
				if(status.in4) {
					closeModal(true); // Pass
				}
			} catch(e) {
				closeModal(false); // Fail
			}
		}
		fabmo.on('status', onStatus);
		var p = doModal({
			title:'Press Stop Button', 
			message:'Press the stop button at the end of the gantry.  You do not need to perform this test for alpha tools.',
			image:'tests/images/stop-button-standard.jpg',
			hideOk : true,
			onCancel: function() {
				fabmo.off('status', onStatus);
			}
		})

		// Return the promise for the modal, which resolves when either the input is detected, or the user cancels.
		return p;
	}
})


registerTest({
	group : 'indexer',
	name : 'Motor, Driver and Cable',
	description : 'Confirm that cable and driver are correctly wired',
	f : function() {
		return doModal({
			title:'Connect Driver and Cable', 
			message:'Connect the driver and cable as shown.',
			image:'tests/images/indexer-hookup.png'//,
			//hideOk : true
		}).then(
			function resolve() {
				fabmo.runSBP('ZX\nMX,10000', );
				return Promise.resolve();
			}
		)
		.then(
			function resolve() {
				return doModal({
					title:'Clockwise (Slow)', 
					message:'Is the motor moving smoothly in the clockwise direction?',
					okText : 'Yes',
					cancelText : 'No'
					//image:'tests/images/stop-button-standard.jpg'//,
					//hideOk : true
				})
			}
		)
		.then(
			function resolve() {
				fabmo.runSBP('ZX\nMX,-10000', );
				return Promise.resolve();
			}
		)
		.then(
			function resolve() {
				return doModal({
					title:'Clockwise (Slow)', 
					message:'Is the motor moving smoothly in the counter-clockwise direction?',
					okText : 'Yes',
					cancelText : 'No'
					//image:'tests/images/stop-button-standard.jpg'//,
					//hideOk : true
				})
			}
		)
		.then(
			function resolve() {
				fabmo.quit();
			}
		)
		.then(
			function resolve() {
				return doModal({
					title:'Observe counterclockwise motion', 
					message:'Watch the motor for counterclockwise motion.',
					image:'tests/images/stop-button-standard.jpg'//,
//					hideOk : true
				});
			}
		);;

		// Return the promise for the modal, which resolves when either the input is detected, or the user cancels.
		return p;
	}
})