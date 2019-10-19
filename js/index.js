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


$(function () {
    let url = 'data/categorias.json';
    let xhr = Services.getData(url, function () {
        let categorias = JSON.parse(this.responseText);
        let main = new MainModel(categorias);
        Services.bind(main, "main:first");
    });
});
