/**
 * wunderlist.settings.js
 *
 * Class for handling all the settings
 * 
 * @author Christian Reber, Dennis Schneider, Daniel Marschner
 */
var settings = settings || {}

settings.init = function() {
	settings.sidebar_opened_status = 'true';
	settings.invited               = 'false';
	settings.shortcutkey           = (Ti.Platform.name.toLowerCase() == 'darwin') ? 'command' : 'Ctrl';
	
	// The timeout for sending a request e. g. with AJAX
	settings.REQUEST_TIMEOUT = 100 * 1000;	
	
	// Count how often the program has been started
	var runtime = Ti.App.Properties.getString('runtime', '1');
	runtimeInt  = parseInt(runtime);
	runtime++;
	Ti.App.Properties.setString('runtime', runtime.toString());
	
	settings.os = Ti.Platform.name.toLowerCase();
	
	/**
	 * Load default App Settings
	 *
	 * @author Dennis Schneider
	 */
	if (Ti.App.Properties.hasProperty('first_run') == false)
	{
		Ti.App.Properties.setString('active_theme', 'bgone');
		Ti.App.Properties.setString('first_run', '0');
		Ti.App.Properties.setString('user_height', '400');
		Ti.App.Properties.setString('user_width', '760');
		Ti.App.Properties.setString('runtime', '1');
		Ti.App.Properties.setString('dateformat', wunderlist.language.code);
		Ti.App.Properties.setString('delete_prompt', '1');
		Ti.App.Properties.setString('invited', settings.invited.toString());
	}
	else
	{
		// Load Window Size and Position
		var currentWindow = Ti.UI.getMainWindow();
		
		if (Ti.App.Properties.getString('maximized', 'false') == 'true') {
			currentWindow.maximize();
		}
		else
		{
			currentWindow.height = parseInt(Ti.App.Properties.getString('user_height', '400'));
			currentWindow.width  = parseInt(Ti.App.Properties.getString('user_width',  '760'));
			var user_x = Ti.App.Properties.getString('user_x', 'none');
			var user_y = Ti.App.Properties.getString('user_y', 'none');
	
			if(user_x != 'none') currentWindow.x = parseInt(user_x);
			if(user_y != 'none') currentWindow.y = parseInt(user_y);
		}
	
		// Load the sidebar opened status
		settings.sidebar_opened_status = Ti.App.Properties.getString('settings.sidebar_opened_status', 'true');
	
		// Load the invited status
		settings.invited = Ti.App.Properties.getString('invited', 'false');
	}
	
	settings.position_saved = false;
	
	Ti.API.addEventListener(Ti.CLOSE, settings.save_window_position);
	Ti.API.addEventListener(Ti.EXIT,  settings.save_window_position);
	
	Ti.API.addEventListener(Ti.CLOSE, settings.save_sidebar_opened_status);
	Ti.API.addEventListener(Ti.EXIT,  settings.save_sidebar_opened_status);		
	
	// Change the top header color on blur
	Ti.API.addEventListener(Ti.UNFOCUSED, function() {
		$("body").css("border-top", "1px solid #b9b9b9");
	});
	
	// Change the top header color on blur
	Ti.API.addEventListener(Ti.FOCUSED, function() {
		$("body").css("border-top", "1px solid #666");
	
	});		
};

// GET the sidebar position
settings.getSidebarPosition = function() {
	return Ti.App.Properties.getString('sidebar_position', 'right');
};

// GET the selected datformat
settings.getDateformat = function() {
	return Ti.App.Properties.getString('dateformat', wunderlist.language.code);
};

// GET the selected week start day
settings.getWeekstartday = function() {
	return Ti.App.Properties.getString('weekstartday', '1');
};

// GET the selected week start day
settings.getDeleteprompt = function() {
	return parseInt(Ti.App.Properties.getString('delete_prompt', '1'));
};

/**
 * Save Window Size and Position on exit
 *
 * @author Christian Reber
 */
settings.save_window_position = function() {
	var currentWindow = Ti.UI.getMainWindow();

	if (settings.position_saved == false && currentWindow.isMinimized() == false)
	{
		Ti.App.Properties.setString('maximized',   currentWindow.isMaximized().toString());
		Ti.App.Properties.setString('user_height', currentWindow.height.toString());
		Ti.App.Properties.setString('user_width',  currentWindow.width.toString());
		Ti.App.Properties.setString('user_x',      currentWindow.x.toString());
		Ti.App.Properties.setString('user_y',      currentWindow.y.toString());
		settings.position_saved = true;
	}
};

/**
 * Save Note Window Size and Position on close
 *
 * @author Daniel Marschner
 */
settings.save_note_window_position = function(noteWindow) {
	if (noteWindow.isMinimized() == false)
	{
		Ti.App.Properties.setString('note_maximized',   noteWindow.isMaximized().toString());
		Ti.App.Properties.setString('note_user_height', noteWindow.height.toString());
		Ti.App.Properties.setString('note_user_width',  noteWindow.width.toString());
		Ti.App.Properties.setString('note_user_x',      noteWindow.x.toString());
		Ti.App.Properties.setString('note_user_y',      noteWindow.y.toString());
	}
};

/**
 * Load last opened list
 *
 * @author Daniel Marschner
 */
settings.load_last_opened_list = function() {
	return Ti.App.Properties.getString('last_opened_list', '1');
}

/**
 * Save last opened list
 *
 * @author Daniel Marschner
 */
settings.save_last_opened_list = function(list_id) {
	Ti.App.Properties.setString('last_opened_list', list_id.toString());
};

/**
 * Save last opened list
 *
 * @author Daniel Marschner
 */
settings.clear_last_opened_list = function() {
	Ti.App.Properties.setString('last_opened_list', '1');
};

/**
 * Save last sidebar opened status
 *
 * @author Daniel Marschner
 */
settings.save_sidebar_opened_status = function() {
	Ti.App.Properties.setString('sidebar_opened_status', settings.sidebar_opened_status.toString());
};

/**
 * Save the invited status
 *
 * @author Daniel Marschner
 */
settings.save_invited = function(value) {
	settings.invited = value.toString();
	Ti.App.Properties.setString('invited', settings.invited);
};