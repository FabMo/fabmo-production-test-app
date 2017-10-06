/**
 * Show the modal dialog
 * options : {
 *       title : Title to show at the top of the dialog
 *     message : Text to show in the body of the dialog
 *       image : URL to an image to display at the top of the dialog.  (No image shown if omitted)	
 *    onCancel : callback to call if the dialog is cancelled
 *        onOk : callback to call if the dialog is dismissed with the  "ok" button
 *      hideOk : If true, no OK button shown
 *  hideCancel : If true, no cancel button shown
 * }
 */
function doModal(options) {
	options = options || {};
	return new Promise(function(fulfill, reject) {
		var modal = document.getElementById('modal')
		var imgCard = document.getElementById('modal-image')
		if(options.image) {
			document.getElementById('img-modal').src = options.image
			imgCard.style.display = 'block';
		} else {
			document.getElementById('img-modal').src = ''
			imgCard.style.display = 'none';
		}
		okButton = document.getElementById('btn-modal-ok');
		cancelButton = document.getElementById('btn-modal-cancel');
		
		okButton.style.display = options.hideOk ? 'none' : 'block'
		cancelButton.style.display = options.hideCancel ? 'none' : 'block'
		
		okButton.innerHTML = options.okText || 'Ok'
		cancelButton.innerHTML = options.cancelText || 'Cancel'

		okButtonHandler = function(arg) {
			(options.onOk || function() {})()
			fulfill(arg);
		}
		cancelButtonHandler = function(arg) {
			(options.onCancel || function() {})()
			reject(arg);
		}
		okButton.addEventListener('click',function(evt) {closeModal(true)});
		cancelButton.addEventListener('click',function(evt) {closeModal(false)});
		
		document.getElementById('txt-modal-message').innerHTML = options.message || '&nbsp;';
		document.getElementById('txt-modal-title').innerHTML = options.title || '&nbsp;';

		modal.className = 'modal is-active'
	});
}

function clearAllListeners(id) {
	var old_element = document.getElementById(id);
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);
}	

/*
 * Close the modal dialog that is currently displayed
 * ok : If true, the modal will be dismissed as if "ok" was clicked, otherwise, it is as if "cancel" was clicked.
 */
function closeModal(ok) {
	var modal = document.getElementById('modal')

	clearAllListeners('btn-modal-ok')
	clearAllListeners('btn-modal-cancel')

	modal.className = 'modal';			
	if(okButtonHandler) {
		if(ok) {
			okButtonHandler(ok);
		}
	}
	if(cancelButtonHandler) {
		if(!ok) {
			cancelButtonHandler(new Error('Cancelled by user.'));
		}
	}
}


/*
 * Configure the specified button
 * options : {
 *        text : The text for the button (No text if omitted)
 *        icon : font-awesome icon class for the button (no icon if omitted)
 *    visibile : If true, show the button
 *       click : Handler to call on the click event (optional)
 * }  
 */
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