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

    mvLeft(foto) {
        const self = this;
        let index = self.fotos.indexOf(foto);
        if (index === 0) return;

        let tmp = self.fotos()[index - 1];
        self.fotos()[index - 1] = foto;
        self.fotos()[index] = tmp;
        self.fotos.valueHasMutated();
    }

    mvRight(foto) {
        const self = this;
        let index = self.fotos.indexOf(foto);
        if (self.fotos().length === (index + 1)) return;

        let tmp = self.fotos()[index + 1];
        self.fotos()[index + 1] = foto;
        self.fotos()[index] = tmp;
        self.fotos.valueHasMutated();
    }

    addFoto(product, event) {
        const self = this;
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            product.fotos.push(e.target.result);
        }
        reader.readAsDataURL(file);
    }

    delFoto(foto) {
        const self = this;
        self.fotos.remove(foto);
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

    delProd(prod) {
        const self = this;
        self.list.remove(prod);
    }

    mvUp(prod) {
        const self = this;
        let index = self.list.indexOf(prod);
        if (index === 0) return;

        let tmp = self.list()[index - 1];
        self.list()[index - 1] = prod;
        self.list()[index] = tmp;
        self.list.valueHasMutated();
    }

    mvDown(prod) {
        const self = this;
        let index = self.list.indexOf(prod);
        if (self.list().length === (index + 1)) return;

        let tmp = self.list()[index + 1];
        self.list()[index + 1] = prod;
        self.list()[index] = tmp;
        self.list.valueHasMutated();
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
