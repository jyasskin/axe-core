/*global dom */
/*jshint maxcomplexity: 20 */

/**
 * Normalize a CSS font-weight to an integer 100-900.
 * @method normalizeFontWeight
 * @memberof axe.commons.dom
 * @instance
 * @param  {string}  fontWeight  The result of getComputedStyle(node).getPropertyValue('font-weight')
 * @return {number}
 */
dom.normalizeFontWeight = function (weight) {
	switch (weight) {
		case 'normal': return 400;
		case 'bold': return 700;
        // These two cases should not appear in a computed style.
        case 'lighter': return 100;
		case 'bolder': return 900;
	}
	weight = parseInt(weight);
	return !isNaN(weight) ? weight : 400;
};