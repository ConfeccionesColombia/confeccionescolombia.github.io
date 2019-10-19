"use strict";

class ProductoModel {
    constructor(it) {
        this.code = ko.observable(it.code);
        this.titulo = ko.observable(it.titulo);
        this.desc = ko.observable(it.desc);
        this.precio = ko.observable(it.precio);
        this.fotos = ko.observableArray(it.fotos);
        this.colores = ko.observableArray(it.colores);

        this.sfotos = ko.pureComputed(() => {
            let list = this.fotos();
            return Services.split(list);
        }, this);
    }
}

class IndexModel {
    constructor(isEditing) {
        this.isEditing = ko.observable(isEditing);
        this.selected = ko.observable();
        this.list = ko.observableArray([]);

        this.splitted = ko.pureComputed(() => {
            let list = this.list();
            return Services.split(list);
        }, this);

    }

    load(prods) {
        let list = ko.utils.arrayMap(prods, it => new ProductoModel(it));
        this.list(list);
    }

    setProduct(prod) {
        this.selected(prod);
    }

    removeProduct() {
        this.selected(null);
    }
}


$(function () {

    let sp = new URLSearchParams(window.location.search);
    let isEditing = sp.get("edit") === "true";

    let main = new IndexModel(isEditing);
    Services.bind(main, "main");

    let prodUrl = 'data/productos.json';
    Services.getJson(prodUrl, function (prods) {
        main.load(prods);
    });
});
