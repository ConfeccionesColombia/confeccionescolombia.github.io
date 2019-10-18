"use strict";

class MainModel {    
    constructor(it) {
	this.titulo = ko.observable(it.titulo);
	this.precio = ko.observable(it.precio);
	this.fotos = ko.observableArray(it.fotos);
	this.colores = ko.observableArray(it.colores);

	this.splitted = ko.pureComputed(() => {
	    let list = this.fotos();
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
    let searchParams = new URLSearchParams(window.location.search);
    let product = ko.utils.arrayFirst(productos, p => p.code === searchParams.get('code'));
    
    let main = new MainModel(product);
    binder.bind(main, "main:first");
});
