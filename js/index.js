"use strict";

class MainModel {
    
    constructor(items) {
	this.items = ko.observableArray(items)
    }
}

class Binder {
    bind(model, selector) {
	let jqObj = $(selector);
	if (jqObj.length === 0) {
	    return;
	}

	let domObj = jqObj[0];
	ko.cleanNode(domObj);
	ko.applyBindings(model, domObj);
    }
}


$(function(){
    let binder = new Binder();
    let main = new MainModel(Categories);
    binder.bind(main, "main:first");
});
