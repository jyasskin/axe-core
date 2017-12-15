if (!axe.commons.dom.isVisible(node, false)) {
	return true;
}

var noScroll = !!(options || {}).noScroll;
var bgNodes = [],
	bgColor = axe.commons.color.getBackgroundColor(node, bgNodes, noScroll),
	fgColor = axe.commons.color.getForegroundColor(node, noScroll);

var nodeStyle = window.getComputedStyle(node);
var fontSize = parseFloat(nodeStyle.getPropertyValue('font-size'));
var fontWeight = axe.commons.dom.normalizeFontWeight(nodeStyle.getPropertyValue('font-weight'));

var cr = axe.commons.color.hasValidContrastRatio(bgColor, fgColor, fontSize, fontWeight);

// truncate ratio to three digits while rounding down
// 4.499 = 4.49, 4.019 = 4.01
var truncatedResult = Math.floor(cr.contrastRatio * 100) / 100;

// if fgColor or bgColor are missing, get more information.
var missing;
if (bgColor === null) {
	missing = axe.commons.color.incompleteData.get('bgColor');
}

let equalRatio = false;
if (truncatedResult === 1) {
	equalRatio = true;
	missing = axe.commons.color.incompleteData.set('bgColor', 'equalRatio');
}
// need both independently in case both are missing
var data = {
	fgColor: fgColor ? fgColor.toHexString() : undefined,
	bgColor: bgColor ? bgColor.toHexString() : undefined,
	contrastRatio: cr ? truncatedResult : undefined,
	fontSize: (fontSize * 72 / 96).toFixed(1) + 'pt',
	fontWeight: fontWeight >= 600 ? 'bold' : 'normal',
	missingData: missing,
	expectedContrastRatio: cr.expectedContrastRatio + ':1'
};

this.data(data);

//We don't know, so we'll put it into Can't Tell
if (fgColor === null || bgColor === null || equalRatio) {
	missing = null;
	axe.commons.color.incompleteData.clear();
	this.relatedNodes(bgNodes);
	return undefined;

} else if (!cr.isValid) {
	this.relatedNodes(bgNodes);
}
return cr.isValid;
