// ==UserScript==
// @name         TagPro Rolling Chat
// @description  When typing out a message, you'll be able to use the arrow keys for movement.
// @author       Ko
// @version      3.0
// @include      *.koalabeast.com:*
// @include      *.jukejuice.com:*
// @include      *.newcompte.fr:*
// @downloadURL  https://github.com/wilcooo/TagPro-RollingChat/raw/master/tprc.user.js
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://redd.it/no-post-yet
// @license      MIT
// ==/UserScript==



// These lines announce that this script is running (handy for other scripts, possibly):
// It doesn't influence the features of this script in any way.
var short_name = 'rollingchat';        // An alphabetic (no spaces/numbers) distinctive name for the script.
var version = GM_info.script.version;  // The version number is automatically fetched from the metadata.
tagpro.ready(function(){ if (!tagpro.scripts) tagpro.scripts = {}; tagpro.scripts[short_name]={version:version};});
console.log('START: ' + GM_info.script.name + ' (v' + version + ' by ' + GM_info.script.author + ')');


// Return if rollingchat is already enabled (f.e. included in another script)
// Otherwise the keypresses will be sent twice
if (tagpro.rollingchat) return;
tagpro.rollingchat = true;


// Wait for the game to be ready:
tagpro.ready(function() {

    // intercept all key presses and releases:
    document.addEventListener('keydown', keyUpOrDown);
    document.addEventListener('keyup', keyUpOrDown);

    function keyUpOrDown( event ) {

        // The key that is pressed/released (undefined when it is any other key)
        var arrow = ['left','up','right','down'][[37,38,39,40].indexOf(event.keyCode)]

        // Only if the controls are disabled (usually while composing a message)
        // AND the key is indeed an arrow (not undefined)
        if (tagpro.disableControls && arrow) {

            // Whether you are releasing instead of pressing the key:
            var releasing = event.type == 'keyup';

            // Prevent the 'default' thing to happen, which is the cursor moving through the message you are typing
            event.preventDefault();

            // Send the key press/release to the server!
            tagpro.sendKeyPress(arrow, releasing);
            console.log('ROLLING ROLLING');

            // Not necesarry, but useful for other scripts to 'hook onto'
            if (!releasing && tagpro.events.keyDown) tagpro.events.keyDown.forEach(f => f.keyDown(arrow));
            if (releasing && tagpro.events.keyUp) tagpro.events.keyUp.forEach(f => f.keyUp(arrow));
            tagpro.ping.avg&&setTimeout(()=>(tagpro.players[tagpro.playerId][arrow]=!releasing),tagpro.ping.avg/2);
        }
    }
});
