"use strict";

class Category {
    constructor(it) {
        this.code = ko.observable(it.code);
        this.title = ko.observable(it.title);
        this.desc = ko.observable(it.desc);
        this.imgpath = ko.observable(it.imgpath);
    }
}

class ProductoModel {
    constructor(it) {
        this.titulo = ko.observable(it.titulo);
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

        this.product = ko.observable();

        // data
        this.productos = ko.observableArray([]);
        this.categorias = ko.observableArray([]);

        this.scategorias = ko.pureComputed(() => {
            let list = this.categorias();
            return Services.split(list);
        }, this);

    }

    load(cats) {
        let list = ko.utils.arrayMap(cats, it => new Category(it));
        this.categorias(list);
    }

    setProduct(categoria) {
        const self = this;
        let prod = ko.utils.arrayFirst(self.productos(), p => p.code === categoria.code());
        this.product(new ProductoModel(prod));
    }

    removeProduct() {
        this.product(null);
    }
}


$(function () {

    let sp = new URLSearchParams(window.location.search);
    let isEditing = sp.get("edit") === "true";

    let main = new IndexModel(isEditing);
    Services.bind(main, "main");

    let catUrl = 'data/categorias.json';
    Services.getJson(catUrl, function (cats) {
        main.load(cats);
    });

    let prodUrl = 'data/productos.json';
    Services.getJson(prodUrl, function (prods) {
        main.productos(prods);
    });
});
