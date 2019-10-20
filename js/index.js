"use strict";

class ProductoModel {
    constructor(it) {
        this.titulo = ko.observable(it.titulo);
        this.desc = ko.observable(it.desc);
        this.precio = ko.observable(it.precio);
        this.fotos = ko.observableArray(it.fotos);
        this.colores = ko.observable(it.colores.join());

        this.sfotos = ko.pureComputed(() => {
            let list = this.fotos();
            return Services.split(list);
        }, this);

        this.hasFocus = ko.observable(false);
    }

    mvLeft(foto) {
        const self = this;
        Services.moveUp(self.fotos, foto);
    }

    mvRight(foto) {
        const self = this;
        Services.moveDown(self.fotos, foto);
    }

    addFoto(product, event) {
        const self = this;
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            Services.resizeImg(file.type, e.target.result, 800, 600, function (data) {
                product.fotos.push(data);
            });
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

        const self = this;

        this.splitted = ko.pureComputed(() => {
            let list = self.list();
            return Services.split(list);
        }, self);

        this.jsonFile = ko.pureComputed(() => {
            return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(self.getData()));
        }, self);

        this.fileName = ko.computed(() => {
            let now = new Date();
            return 'productos_' +
                now.getFullYear() + "_" +
                (now.getMonth() + 1) + "_" +
                now.getDate() + "t" +
                now.getHours() + "_" +
                now.getMinutes() + "_" +
                now.getSeconds() + ".json";

        }, self);

    }

    loadConfig(item, event) {
        const self = this;
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            let data = JSON.parse(e.target.result);
            self.load(data);
        }
        reader.readAsText(file);
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

    newProd() {
        const self = this;
        let prod = new ProductoModel({
            titulo: '',
            desc: '',
            precio: '',
            fotos: [],
            colores: []
        });

        self.list.push(prod);
        prod.hasFocus(true);
    }

    mvUp(prod) {
        const self = this;
        Services.moveUp(self.list, prod);
    }

    mvDown(prod) {
        const self = this;
        Services.moveDown(self.list, prod);
    }

    getData() {
        const self = this;
        let list = [];
        for (let it of self.list()) {
            list.push({
                titulo: it.titulo(),
                desc: it.desc(),
                precio: it.precio(),
                fotos: it.fotos(),
                colores: it.colores().split(',')
            });
        }

        return list;
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
