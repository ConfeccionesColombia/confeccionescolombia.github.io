"use strict";

class MainModel {    
    constructor(items) {
	this.items = ko.observableArray(items);
	this.splitted = ko.pureComputed(() => {
	    let list = this.items();
	    let split = [];
	    for (let i = 0; i < list.length; i++) { 
		if (i === 0 || i % 3 === 0) {
		    split.push([]);
		}
		let arr = split[split.length -1];
		arr.push(list[i]);
	    }
	    
	    
	    return split;
	}, this);
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
