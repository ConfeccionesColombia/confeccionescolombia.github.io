"use strict";

class MainModel {    
    constructor(items) {
	this.items = ko.observableArray(items);
	this.splitted = ko.pureComputed(() => {
	    let list = this.items();
	    return Services.split(list);
	}, this);
    }
}


$(function(){    
    let main = new MainModel(Categories);
    Services.bind(main, "main:first");
});
