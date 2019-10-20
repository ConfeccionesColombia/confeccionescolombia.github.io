"use strict";

let Services = {
    split: function (list) {
        let split = [];
        for (let i = 0; i < list.length; i++) {
            if (i === 0 || i % 3 === 0) {
                split.push([]);
            }

            let arr = split[split.length - 1];
            arr.push(list[i]);
        }

        return split;
    },
    bind: function (model, selector) {
        let jqObj = $(selector);
        if (jqObj.length === 0) {
            return;
        }

        let domObj = jqObj[0];
        ko.cleanNode(domObj);
        ko.applyBindings(model, domObj);
    },
    getJson: function (url, callback) {
        var oReq = new XMLHttpRequest();
        oReq.onload = function () {
            let data = JSON.parse(oReq.responseText);
            callback(data);
        };
        oReq.open("get", url, true);
        oReq.send();
        return oReq;
    },
    calcRatio(srcWidth, srcHeight, maxWidth, maxHeight) {
        let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        return { width: srcWidth * ratio, height: srcHeight * ratio };
    },
    resizeImg: function (src, maxwidth, maxheight, callback) {
        let canvas = $("<canvas />").attr("source", src).get()[0];
        var image = new Image();
        image.onload = function () {

            let ratio = Services.calcRatio(image.width, image.height,
                maxwidth, maxheight);

            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = ratio.width;
            canvas.height = ratio.height;
            ctx.drawImage(image, 0, 0, ratio.width, ratio.height);

            callback(canvas.toDataURL("image/jpeg"));

        }
        image.src = src;
    },
    moveUp: function (koarray, item) {
        let index = koarray.indexOf(item);
        if (index === 0) return;

        let tmp = koarray()[index - 1];
        koarray()[index - 1] = item;
        koarray()[index] = tmp;
        koarray.valueHasMutated();
    },

    moveDown: function (koarray, item) {
        let index = koarray.indexOf(item);
        if (koarray().length === (index + 1)) return;

        let tmp = koarray()[index + 1];
        koarray()[index + 1] = item;
        koarray()[index] = tmp;
        koarray.valueHasMutated();
    }
}
