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
      const regex = /.jpg/i;
      let item = src.substr(start).replace(regex, '');
      
      let quantity = $(it)
                    .find("div.snipcart-item-quantity__quantity")
                    .find("span:first").text();

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
        <p>
          Gracias por comprar con nosotros, para completar
          tu compra, envía un WhatsApp con la foto del código QR de tú
          pedido. Al número 452 201 8336 o dándo click en éste
          link <a style="color: hotpink;display:inline;" href="https://wa.me/4522018336?text=Pedido,">enviar pedido<a/>.
          
          <div id="qrcode"></div>
        </p>        
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