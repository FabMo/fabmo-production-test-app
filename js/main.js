var tests = []
testInProgress = false;
currentWorkOrderNumber = null;
var appSettings = {
	testGroup : 'gantry'
};

var fabmo = new FabMoDashboard()

var okButtonHandler = null;
var cancelButtonHandler = null;

function registerTest(test) {
	tests.push(test);
}

function addTestMenuItem(test) {
	
	var item = document.createElement('a')
	item.className = 'panel-block'
	var span = document.createElement('span')
	span.className = 'panel-icon is-large'
	
	var icon = document.createElement('i')
	icon.className = 'fa fa-circle'
	span.appendChild(icon)
	item.appendChild(span)
	
	var label = document.createElement('h1');
	label.appendChild(document.createTextNode(test.name))
	item.appendChild(label);

	document.getElementById('test-menu-list').appendChild(item)
	item.addEventListener('click', function() {
		runTest(test);
	});

	return {icon : icon, label : label}
}

function removeAllTestMenuItems() {
	document.getElementById('test-menu-list').innerHTML = '';
}

function resetTest(test) {
	testInProgress = false;
	if(test.ui) {
		test.ui.icon.className = 'fa fa-circle'
		test.ui.label.className = ''
	}		
}

function resetTests() {
	tests.forEach(function(test) {
		resetTest(test);
	})
}
function passTest(test) {
	testInProgress = false;
	if(test.ui) {
		test.ui.icon.className = 'fa fa-check test-pass'
		test.ui.label.className = 'test-pass'
	}	
}

function failTest(test) {
	testInProgress = false;
	if(test.ui) {
		test.ui.icon.className = 'fa fa-times test-fail'
		test.ui.label.className = 'test-fail'
	}
}
function activateTest(test) {
	testInProgress = true;
	if(test.ui) {
		test.ui.icon.className = 'fa fa-circle-o-notch fa-spin'
		test.ui.label.className = 'test-working'

	}
}

function runTest(test) {
	if(testInProgress) {
		throw new Error('Cannot start test.  A test is already in progress.');
	}
	var test_output = {
		name : test.name,
		description : test.description,
		start_time : new Date()
	}

	activateTest(test);
	test.f().then(
		function resolve(data) {
			test_output.end_time = new Date();
			test_output.state = 'pass';
			test_output.result = data;
			test_output.work_order = currentWorkOrderNumber;
			passTest(test);
			console.info(test_output);
			if(keen) {
				keen.recordEvent('test', test_output);
			}						
		},
		function reject(error) {
			test_output.end_time = new Date();
			test_output.state = 'fail';
			test_output.data = error.message || error;
			test_output.work_order = currentWorkOrderNumber;
			failTest(test);
			console.info(test_output);
			if(keen) {
				keen.recordEvent('test', test_output);
			}						
	});
}

function setupTestMenu(options) {
	options = options || {}
	removeAllTestMenuItems();
	document.getElementById('txt-test-title').innerHTML = options['title'] || 'Test Application'
	var testGroup = appSettings['testGroup'] || 'gantry';	
	console.log("Setting up the test menu")
	console.log(testGroup)
	tests.forEach(function(test) {
		if(test.group === testGroup) {
			test.ui = addTestMenuItem(test);				
		}
	});	
}
/*
function showTestMenu() {
	document.getElementById('test-runner').style.display = 'none';
	document.getElementById('test-menu').style.display = 'block';
}*/

function showScreen(id) {
	elements = document.getElementsByClassName('screen');

	for(var i=0; i<elements.length; i++) {
		elements[i].style.display = 'none';
	}
	document.getElementById(id).style.display='block';
}

function setupButtons(buttons) {
	buttons = buttons || {};
	for(var id in buttons) {
		setupButton(id,buttons[id]);
	}
}

function setNavText(text) {
	text = text || '';
	document.getElementById('txt-nav').innerHTML = text;
}

function goWorkOrderSelection() {
	setupButton('btn-nav-left', {text : 'Back', visible : true, icon : 'fa-arrow-left', click : goHome})
	setupButton('btn-nav-right', {text : 'Select', icon : 'fa-check', visible: false})
	setNavText('Select a Work Order')
	showScreen('screen-workorder-select')
}

function goTestMenu() {
	setupButton('btn-test-done', {visible : true, click : goHome});
	showScreen('screen-test-menu')
}

function goHome() {
	console.log(appSettings);
	setupButtons({
		'btn-nav-left' : {visible : false},
		'btn-nav-right' : {visible : false}
	});
	setNavText();
	showScreen('screen-home');
}

function goSettings() {
	setupButton('btn-nav-left', {
		text : 'Cancel', 
		visible : true, 
		icon : 'fa-arrow-left', 
		click : function() {
				goHome();
		}
	});
	setNavText('Settings');
	showScreen('screen-settings')
}

function initHomeScreen(options) {
	listButton = document.getElementById('btn-wo-list');
	listButton.addEventListener('click', function(evt) {
		goWorkOrderSelection();
	});

	workOrderButton = document.getElementById('btn-wo-go');
	workOrderButton.addEventListener('click', function(evt) {
		workOrderNumberField = document.getElementById('txt-wo-number');
		workOrderNumberFieldIcon = document.getElementById('txt-wo-number-icon');

		currentWorkOrderNumber = workOrderNumberField.value;
		if(currentWorkOrderNumber) {
			resetTests();
			goTestMenu();
		} else {
			doModal({
				title:'Need Work Order Number', 
				message:'You must enter a work-order number to run a test.',
				hideCancel : true,
			});
		}

	});

	settingsButton = document.getElementById('btn-settings-go');
	settingsButton.addEventListener('click', function(evt) {
		goSettings();
	});
}

function initSettingsScreen() {
	var testGroupSelect = document.getElementById( "test-select" );
	
	for(var i=0; i<testGroupSelect.options.length; i++) {
		if(testGroupSelect.options[i].value === appSettings.testGroup) {
			testGroupSelect.selectedIndex = i;
		}
	}
	
	settingsOkButton = document.getElementById('btn-settings-ok');
	settingsOkButton.addEventListener('click', function(evt) {
		appSettings.testGroup = testGroupSelect.options[testGroupSelect.selectedIndex].value
		saveConfig();
		setupTestMenu();
		goHome();	
	});
}
function loadConfig(callback) {
	fabmo.getAppConfig(function(err, cfg) {
		appSettings = cfg;
		console.log(appSettings);
		(callback || function() {})()
	});
}

function saveConfig() {
	fabmo.setAppConfig(appSettings, function(err, cfg) {
		console.log("Set app config");
	});	
}

function init(options) {
	options = options || {};
	loadConfig(function() {
		setupTestMenu();
		initHomeScreen(options);
		initSettingsScreen();
		showScreen('screen-home');		
	});
}