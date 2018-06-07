// ==UserScript==
// @name         TagPro Rolling Chat
// @description  When typing out a message, you'll be able to use the arrow keys for movement.
// @author       Ko
// @version      2.0
// @include      *.koalabeast.com:*
// @include      *.jukejuice.com:*
// @include      *.newcompte.fr:*
// @downloadURL  https://github.com/wilcooo/TagPro-RollingChat/raw/master/tprc.user.js
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://redd.it/no-post-yet
// @license      MIT
// ==/UserScript==




////////////////////////////////////////////////////////////////////////////////////////////
//     ### --- OPTIONS --- ###                                                            //
////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                      //  //
// Want to use the arrow keys while chatting? true or false                           //  //
const always_arrow = true;                                                            //  //
                                                                                      //  //
// Want to keep your 'concept' chat after pressing ESC? true or false                 //  //
const keep_chat = true;                                                               //  //
                                                                                      //  //
// This options lets you use the ESC key to cancel a message, without the             //  //
// scoreboard showing up. Pressing ESC again will open the scoreboard as usual.       //  //
// (this is an upcoming feature, ETA: tomorrow.)                                      //  //
const cancel_chat = true;                                                             //  //
                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////  //
//                                                     ### --- END OF OPTIONS --- ###     //
////////////////////////////////////////////////////////////////////////////////////////////





//////////////////////////////////////
// SCROLL FURTHER AT YOUR OWN RISK! //
//////////////////////////////////////




// These lines announce that this script is running (handy for other scripts, possibly):
// It doesn't influence the features of this script in any way.
var short_name = 'rollingchat';        // An alphabetic (no spaces/numbers) distinctive name for the script.
var version = GM_info.script.version;  // The version number is automatically fetched from the metadata.
var options = {always_arrow:always_arrow, keep_chat:keep_chat, cancel_chat:cancel_chat};
tagpro.ready(function(){ if (!tagpro.scripts) tagpro.scripts = {}; tagpro.scripts[short_name]={version:version,options:options};});
console.log('START: ' + GM_info.script.name + ' (v' + version + ' by ' + GM_info.script.author + ')');






if (always_arrow) {

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

                // Not necesarry, but useful for other scripts to 'hook onto'
                if (!releasing && tagpro.events.keyDown) tagpro.events.keyDown.forEach(f => f.keyDown(arrow));
                if (releasing && tagpro.events.keyUp) tagpro.events.keyUp.forEach(f => f.keyUp(arrow));
                tagpro.players[tagpro.playerId][arrow] = !releasing;
            }
        }
    });
}


// And now for the keep_chat magic:

if (keep_chat) {

    // the box you type in:
    var chat_input = document.getElementById('chat'),
        backup = '';

    // Backup your 'concept' when canceling the chat
    document.addEventListener('keydown', function(keydown) {
        if ( tagpro.keys.cancelChat.includes(keydown.keyCode) )
            backup = chat_input.value;
    });

    // When 'opening' the chat, restore that backup (only if the box is empty):
    chat_input.onfocus = function(){ if (!chat_input.value) chat_input.value = backup; backup = ''; };
}



// And the last feature of this script: UPCOMING

if (cancel_chat) {

    console.warn('The "cancel_chat" option of the Rolling Chat script doesn\'t work yet. Check again in a day or two.');

    /*
    var org_showOptions = tagpro.showOptions;

    tagpro.showOptions = function(){
        if (!tagpro.disableControls) return org_showOptions();
    };
    */
}
