// Preloader js    
$(window).on('load', function () {
  $('.preloader').fadeOut(100);
});

(function ($) {
  'use strict';

  
  // product Slider
  $('.product-image-slider').slick({
    autoplay: false,
    infinite: true,
    arrows: false,
    dots: true,
    customPaging: function (slider, i) {
      var image = $(slider.$slides[i]).data('image');
      return '<img class="img-fluid" src="' + image + '" alt="product-image">';
    }
  });

  // Product slider
  $('.product-slider').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    dots: false,
    arrows: false,
    responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

  

  let showButton = (isCart) =>
  {
    if (isCart) {
      $("button.snipcart-checkout").hide();
      $("button.snipcart-pagar").show();
    }else{
      $("button.snipcart-checkout").show();
      $("button.snipcart-pagar").hide();
    }
  }
  
  let loc = window.location.href;
  showButton(loc.indexOf("#/cart") !== -1);
    
  document.addEventListener('snipcart.ready', () => {       
    Snipcart.events.on('theme.routechanged', (routesChange) => {
      let isCart = routesChange.to.indexOf("/cart") !== -1;
      showButton(isCart);
    });    

    console.log("cart ready");
    
  });

  $("#btnPagar").on("click", () => {
    let pedido = createQr();
    pedido.get()[0].scrollIntoView({ behavior: "smooth" });    
  });

  let generateQr = () => {
    let items = [];
    $("div.snipcart-item-line__container").each((i, it) => {
      let src = $(it).find("img:first").attr("src");
      //console.log(src);
      let start = src.lastIndexOf("/") + 1;
      let text = src.substr(start);
      if (text.indexOf("_") === -1) {
        return true;
      }

      let item = text.split("_")[0];

      if (item.length !== 36) {
        return true;
      }
      
      let quantity = $(it)
                    .find("div.snipcart-item-quantity__quantity")
                    .find("span:first").text();

      if (isNaN(quantity)) {
        return true;
      }

      items.push({
        i: item,
        q: quantity
      });
    });

    console.dir(items);

    $( "#qrcode" ).replaceWith(`<div id="qrcode"></div>`);

    let qrcode = new QRCode("qrcode", {
      text: JSON.stringify(items),
      width: 256,
      height: 256,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
  }

  let createQr = () => {
    $("#dPedido").remove();    

    let pedido = $(`
      <div id="dPedido" class="alert alert-success" role="alert">     
        <h1 style="font-size:1.5em">Código de compra</h1>   
        <p>
          Para completar tu compra, envianos una foto del siguiente código QR, dándo click 
          <a style="color: hotpink;display:inline;" href="https://wa.me/524522018336?text=Pedido,">aquí<a/>
        </p>   
        <p>
          WhatsApp +524522018336.
        </p>
        <div id="qrcode"></div>
      </div>`
    );
    
    pedido.css("padding","10px");
    pedido.css("margin-top","20px");
    pedido.css("margin-bottom","70px");
    pedido.css("border","2 px dashed goldenrod");
    pedido.css("background-color","white");
    pedido.insertAfter("div.snipcart-cart__footer");

    generateQr();

    Snipcart.events.on('item.updated', (item) => {      
      pedido.remove();
    });

    Snipcart.events.on('item.removed', (it) => {   
      pedido.remove();
    });

    return pedido;
  };
  

  

})(jQuery);