var tests = []
testInProgress = false;

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
			test_output.end_time = new Date()
			test_output.state = 'pass'
			test_output.result = data
			passTest(test);
			console.info(test_output)
		},
		function reject(error) {
			test_output.end_time = new Date()
			test_output.state = 'fail'
			test_output.data = error.message || error
			failTest(test);
			console.info(test_output)
	});
}

function setupTestMenu(options) {
	document.getElementById('txt-test-title').innerHTML = options.title || 'Test Application'
	console.log(tests)
	tests.forEach(function(test) {
		test.ui = addTestMenuItem(test);	
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

function setupButton(id, options) {
	options = options || {};
	var btn = document.getElementById(id);
	var icon = btn.getElementsByClassName('icon');
	var text = btn.getElementsByClassName('text');
	icon = icon.length > 0 ? icon[0].getElementsByTagName('i')[0] : null
	text = text.length > 0 ? text[0] : null

	if(btn) {
		if(text && options.text) { text.innerHTML = options.text; }
		if(icon && options.icon) { icon.className =  'fa ' + options.icon;}
		if(options.visible) {
			btn.style.visibility = 'visible';
		} else {
			btn.style.visibility = 'hidden'
		}		
		if(options.click) {
			var new_btn = btn.cloneNode(true);
			btn.parentNode.replaceChild(new_btn, btn);
			new_btn.addEventListener('click', options.click)
		}

	}
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
	setupButtons({
		'btn-nav-left' : {visible : false},
		'btn-nav-right' : {visible : false}
	});
	setNavText();
	showScreen('screen-home');
}

function initHomeScreen(options) {
	listButton = document.getElementById('btn-wo-list');
	listButton.addEventListener('click', function(evt) {
		goWorkOrderSelection();
	});

	listButton = document.getElementById('btn-wo-go');
	listButton.addEventListener('click', function(evt) {
		resetTests();
		goTestMenu();
	});
}

function closeModal(ok) {
	var modal = document.getElementById('modal')
	okButton.removeEventListener('click', okButtonHandler)
	cancelButton.removeEventListener('click', cancelButtonHandler)
	modal.className = 'modal';			
	if(okButtonHandler) {
		if(ok) {
			okButtonHandler(ok);
		}
	}
	if(cancelButtonHandler) {
		if(!ok) {
			cancelButtonHandler(new Error('cancel'));
		}
	}
}

function doModal(options) {
	options = options || {};
	return new Promise(function(fulfill, reject) {
		var modal = document.getElementById('modal')
		okButton = document.getElementById('btn-modal-ok');
		cancelButton = document.getElementById('btn-modal-cancel');
		okButtonHandler = function(arg) {
			fulfill(arg);
		}
		cancelButtonHandler = function(arg) {
			reject(arg);
		}
		okButton.addEventListener('click',function(evt) {closeModal(true)});
		cancelButton.addEventListener('click',function(evt) {closeModal(false)});
		
		document.getElementById('txt-modal-message').innerHTML = options.message || '&nbsp;';
		document.getElementById('txt-modal-title').innerHTML = options.title || '&nbsp;';

		modal.className = 'modal is-active'
	});
}


function init(options) {
	options = options || {};
	setupTestMenu(options);
	initHomeScreen(options);
	showScreen('screen-home');
}