/**
 * Kandy.io Screensharing Demo
 * View this tutorial and others at https://developer.kandy.io/tutorials
 */

/**
 * Note: This demo currently only works on Chrome, and requires an
 * extension (https://chrome.google.com/webstore/detail/kandyio-screen-sharing/daohbhpgnnlgkipndobecbmahalalhcp)
 * to enable desktop capturing with Chrome.
 */

// Variables for logging in.
var projectAPIKey = "DAK8e73b6cfb27644c0b0cb92bd94083361";
var username = "user2@tahpro.gmail.com";
var password = "2voluptatemquosqu2";

// Setup Kandy to handle calls and check for media support.
kandy.setup({
  // Designate an HTML element to be our stream container.
  remoteVideoContainer: document.getElementById('remote-container'),

  // Register listeners to call events.
  listeners: {
    // Call Events
    callinitiated: onCallInitiated,
    callincoming: onCallIncoming,
    callestablished: onCallEstablished,
    callended: onCallEnded,
    // Media Event
    media: onMediaError,
    // Screensharing Event
    callscreenstopped: onStopSuccess
  },

  // Reference the default Chrome extension.
  chromeExtensionId: {
    chromeExtensionId: 'daohbhpgnnlgkipndobecbmahalalhcp'
  }
});

// Login automatically as the application starts.
kandy.login(projectAPIKey, username, password, onLoginSuccess, onLoginFailure);

// What to do on a successful login.
function onLoginSuccess() {
  log('Login was successful.');
}

// What to do on a failed login.
function onLoginFailure() {
  log('Login failed. Make sure you input the user\'s credentials!');
}

// Utility function for appending messages to the message div.
function log(message) {
  document.getElementById('log').innerHTML = '<div>' + message + '</div>';
}

// Executed when a call button is clicked.
function toggleCall() {
  // Check if we have a callId, meaning if a call is in progress.
  if (callId) {
    // Tell Kandy to end the call.
    kandy.call.endCall(callId);
    callId = null;
  } else {
    // Get user input and make the call.
    var callee = document.getElementById('callee').value;
    kandy.call.makeCall(callee, true);
  }
}

// Keep track of the callId.
var callId;

// Executed when the user makes a call.
function onCallInitiated(call, calleeName) {
  log('Making call to ' + calleeName);
  // Store the callId.
  callId = call.getId();
}

// Executed when the user is being called.
function onCallIncoming(call) {
  // Store the callId.
  callId = call.getId();

  // Automatically answer the call.
  kandy.call.answerCall(callId, true);
}

// Executed when a call is established.
function onCallEstablished(call) {
  log("Call established.");

  // Handle UI changes. Call in progress.
  document.getElementById("make-call").disabled = true;
  document.getElementById("screensharing").disabled = false;
  document.getElementById("end-call").disabled = false;
}

// Executed when a call is ended.
function onCallEnded() {
  log('Call ended.');
  // Handle UI changes. No longer in a call.
  document.getElementById('make-call').disabled = false;
  document.getElementById('screensharing').disabled = true;
  document.getElementById('end-call').disabled = true;

  // Update screensharing status.
  isSharing = false;
}

// Called when the media event is triggered.
function onMediaError(error) {
  switch (error.type) {
    case kandy.call.MediaErrors.NOT_FOUND:
      log("No WebRTC support was found.");
      break;
    case kandy.call.MediaErrors.NO_SCREENSHARING_WARNING:
      log("WebRTC supported, but no screensharing support was found.");
      break;
    default:
      log('Other error or warning encountered.');
      break;
  }
}

// Keep track of screensharing status.
var isSharing = false;

// Executed when the user clicks on the 'Toggle Screensharing' button.
function toggleScreensharing() {
  // Check if we should start or stop sharing.
  if (callId && isSharing) {
    // Stop screensharing.
    kandy.call.stopScreenSharing(callId, onStopSuccess, onStopFailure);
  } else {
    // Start screensharing.
    kandy.call.startScreenSharing(callId, onStartSuccess, onStartFailure);
  }
}

// What to do on a successful screenshare start.
function onStartSuccess() {
  log('Screensharing started.');
  isSharing = true;
}

// What to do on a failed screenshare start.
function onStartFailure() {
  log('Failed to start screensharing.');
}

// What to do on a successful screenshare stop.
function onStopSuccess() {
  log('Screensharing stopped.');
  isSharing = false;
}

// What to do on a failed screenshare stop.
function onStopFailure() {
  log('Failed to stop screensharing.');
}