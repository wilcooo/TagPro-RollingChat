// ==UserScript==
// @name         TagPro Rolling Chat
// @description  When composing a message, you'll still be able to use the arrow keys to roll around.
// @author       Ko
// @version      1.0
// @include      *.koalabeast.com:*
// @include      *.jukejuice.com:*
// @include      *.newcompte.fr:*
// @downloadURL  https://github.com/wilcooo/TagPro-RollingChat/raw/master/tprc.user.js
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://redd.it/no-post-yet
// @license      MIT
// ==/UserScript==



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
