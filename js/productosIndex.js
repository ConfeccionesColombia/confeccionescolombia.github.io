"use strict";

class MainModel {
    constructor(it) {
        this.titulo = ko.observable(it.titulo);
        this.precio = ko.observable(it.precio);
        this.fotos = ko.observableArray(it.fotos);
        this.colores = ko.observableArray(it.colores);

        this.splitted = ko.pureComputed(() => {
            let list = this.fotos();
            return Services.split(list);
        }, this);
    }
}


$(function () {
    let sp = new URLSearchParams(window.location.search);
    let item = ko.utils.arrayFirst(productos, p => p.code === sp.get('code'));

    let main = new MainModel(item);
    Services.bind(main, "main:first");
});
