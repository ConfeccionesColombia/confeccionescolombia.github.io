"use strict";

let Services = {
    split: function (list) {	
	let split = [];
	for (let i = 0; i < list.length; i++) { 
	    if (i === 0 || i % 3 === 0) {
		split.push([]);
	    }
	    
	    let arr = split[split.length -1];
	    arr.push(list[i]);
	}
    
	return split;
    },
    bind: function (model, selector) {
	let jqObj = $(selector);
	if (jqObj.length === 0) {
	    return;
	}

	let domObj = jqObj[0];
	ko.cleanNode(domObj);
	ko.applyBindings(model, domObj);
    }
}
