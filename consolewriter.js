/**
 * consolewriter.js
 * 
 * Simple Console Utility to format Output in Blocks.
 * 
 * Usage:
 *  cw = require('./consolewriter.js');
 *  cw.add('Simple Console Utility to format Output in Blocks.');
 *  cw.add();
 *  cw.add('Usage:');
 *  cw.add(" cw = require('./consolewriter.js');");
 *  cw.add(" cw.add('Example Text');");
 *  cw.add(" console.log(cw.get('Test'));");
 *  console.log(cw.get('consolewriter.js'));
 * 
 * Output:                                               
 *  ################## consolewriter.js ##################
 *  # Simple Console Utility to format Output in Blocks. #
 *  #                                                    #
 *  # Usage:                                             #
 *  #  cw = require('./consolewriter.js');               #
 *  #  cw.add('Example Text');                           #
 *  #  console.log(cw.get('Test'));                      #
 *  ######################################################
 */

// Begin Variables
const EOL = require('os').EOL;

var char = '#';                 // Default Separator Character. Example Separator: '####################'
var inline_char = '=';          // Default Inline Separator Character.    Example: '#                  #'
var inBlock = false;            // Monitor Variable which tells wether a new Block has been started.
var input = [];                 // Stores Text of Block
var default_maxwidth = 100;     // Maximum Console Width to default to if a Check with process.stdout.columns fails.

module.exports = {
    /**
     * Adds specified Text to the Input Buffer and, if not already in one, signals the Start of a new Block.
     * @param text The Text to be added. If text contains more than one Line, each Line will be added separately.
     */
    add: function (text) {
        inBlock = true;                                         // Start new Block
        text = text === undefined ? String() : String(text);    // Catch no Argument
        input = input.concat(text.split(EOL));                 // Append new Text
    },

    /**
     * Returns the formatted Block as a single String with Line Breaks.
     * In Case no Lines have been added using add() the Return Value will be a full Width Separator. 
     * @param title Will be embedded in the leading Separator if supplied and not longer than the Width within the Block.
     */
    get: function (title) {
        // Query Width at each Execution so it is up to Date since the Console might be resized
        var maxwidth = process.stdout.columns === undefined ? default_maxwidth : process.stdout.columns - 1;    // Get Console Width from stdout, if that fails fall back to Default
        var usewidth = maxwidth - 4;    // Calculate usable Width (Maximum Width minus (Seperator Char + Whitespace) times two)
        var max_len = 0;    // Length of longest Text Line
        var output = [];    // Output Buffer

        if (!inBlock) { return getSeparator(maxwidth); }    // If we are not inside a Block return a Separator with maxwidth

        output.push('');    // Reserve first Line for Separator

        for (item of input) {   // Append each Line to the Output Buffer prefixed with inline_char and determine the Length of the longest Line
            while (item.length > usewidth) {    // In Case a Line contains more Text than can be displayed in the usable Width wordwrap it
                var splitAt = item.lastIndexOf(" ", usewidth);
                var to_push = String(inline_char + ' ' + item.substring(0, splitAt));   // Wordwrap
                max_len = to_push.length > max_len ? to_push.length : max_len;  // Length Determination for wordwrapped lines
                output.push(to_push);
                item = item.substring(splitAt + 1);     // Rest of Line
            }
            max_len = item.length > max_len ? item.length : max_len;    // Length Determination
            output.push(String(inline_char + ' ' + item));
        }

        max_len = max_len > usewidth ? usewidth : max_len;  // If max_len is greater than the usable Width default back to it

        var separator = char.repeat(max_len + 4);   // Create Separator

        if (title !== undefined && (title = String(title).trim()) !== '' && title.length <= usewidth) {     // If a Title has been specified, embed it in the leading Separator
            var arr = separator.split('');  // Translate String to Array [We need the Array Functionalities]
            arr.splice((separator.length - title.length - 2) / 2, title.length + 2, ' ' + title + ' ');     // Replace centered Part with Title surrounded by Whitespaces
            output[0] = arr.join('');   // Translate back to String and write to preserved Position
        } else {
            output[0] = separator;  // Write Separator to preserved Position
        }
        output.push(separator);     // Add Separator at the End of the Block

        output.forEach(function (item, index, array) {  // Add the trailing inline_char to each Line after max_len has been determined 
            if (item != separator && item != output[0]) {
                array[index] = item + ' '.repeat(max_len - item.length + 3) + inline_char;
            }
        })

        inBlock = false;    // Block has been finished

        return output.join(EOL);   // Return Result as single String for comfort (can be printed with console.log())
    },

    /**
     * Set the Character to be used to build the Separators.
     * @param new_char The new Character for the Separator
     */
    setSeparatorChar: function (new_char) {
        char = String(new_char)[0].trim().length == 0 ? char : String(new_char);
    },

    /**
     * Set the Character to surround the Text within the Block with (left and right side).
     * @param new_char The new Character for the inline Separator
     */
    setInlineSeparatorChar: function (new_char) {
        inline_char = String(new_char)[0].length == 0 ? char : String(new_char);
    },

    /**
     * Returns a Separator with the given Length
     * @param length The Length of the Separator
     */
    getSeparator: function (length) {
        length = (length = Number(length).abs()) == 0 ? 1 : length;
        return char.repeat(length);
    },

    /**
     * Set default maximum Width to fall back to if Console Width Determination fails (E.g. no Console attached).
     * @param width New default maximum Width
     */
    setDefaultMaxWidth: function(width) {
        default_maxwidth = Math.abs(Number(width));
    }
}