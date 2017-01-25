  $(document).ready(function(){

    $("#owl-carousel").owlCarousel({
      loop: true,
      items:1,
      // autoplay: true,
      mouseDrag: true
    });

    // get gallery from json
    $.getJSON('gallery.json', function(data){
      var dataLength = data.gallery.length;
      var maxObjects = 6;
      var totalNumPages = Math.ceil(dataLength / maxObjects);
      // get picture from json
      function getPic(pageNumber) {
        for (var i = 1; i <= totalNumPages; i++) {
          if (pageNumber === i) {
            for (var j = (maxObjects*pageNumber)-maxObjects; j <= (maxObjects*pageNumber)-1; j++) {
              // console.log(data.gallery[j].img.id);
              if (j < dataLength) {
                var imgId = data.gallery[j].img.id;
                var imgUrl = data.gallery[j].img.url;
                $("#gallery").append("<div class='gallery_item item_" + imgId + "'><div class='pic'><div><div class='img'><img src='" + imgUrl + "'/></div></div></div></div>");
              }
            };
          } else if (pageNumber > totalNumPages) {
            alert("Такой страницы не существует!");
          }
        }
      }
      // create paggination buttons
      function paginationButtons(pages){
        for (var i = 1; i <= pages; i++) {
          $("#paggination").append("<a id='page_" + i + "' href='#content'>" + i + "</a>")
        }
      }paginationButtons(totalNumPages);
      // press buttons
      $("[id^=page_]").click(function(){
        var curPage = $(this).siblings("[id^=page_]");
        $("[id^=page_]").not(curPage).addClass("here");
        curPage.removeClass("here");
        var num = parseInt(this.text);
        $("#gallery").text("");
        getPic(num);
        return false;
      });

      // First start
      function start(){
        getPic(1);
        $("#page_1").addClass("here");
      }start();
    });

    // get menu from json
    $.getJSON('menu.json', function(data){
      var dataLength = data.menu.length;
      // get picture from json
      function getPic(typeOfFood) {
            // for (var j = 0; j < dataLength; j++) {
            $.each(data.menu, function(i, item){
                // var id = data.menu[j].id;
                // var imgUrl = data.menu[j].img;
                // var name = data.menu[j].name;
                // var price = data.menu[j].price;
                // var type = data.menu[j].food;
                 its = data.menu[i];
                var id = this.id;
                var imgUrl = this.img;
                var name = this.name;
                var price = this.price;
                var type = this.food;
                function sortfunction(a, b){
                  a.price - b.price;
                };
                if (typeOfFood == type) {
                  $("#menu").append("<div class='gallery_item " + type + " item_" + id + "'><div class='pic'><div><div class='img'><img src='" + imgUrl + "'/></div></div></div><div class='text'>" + name + "</div><div class='price'>" + price + "$</div></div>");
                } else if (typeOfFood == "allFood") {
                $("#menu").append("<div class='gallery_item " + type + " item_" + id + "'><div class='pic'><div><div class='img'><img src='" + imgUrl + "'/></div></div></div><div class='text'>" + name + "</div><div class='price'>" + price + "$</div></div>");
              }
            });
            // }
          };
      // First start
      function start(){
        getPic("allFood");
      }start();

      //filter
      $("#left_menu li").click(function(){
        var foodType = $(this).find("a").attr("class");
        switch (foodType) {
          case "italy":
            $("#menu").text("");
            getPic(foodType);
            break;
          case "ukraine":
            $("#menu").text("");
            getPic(foodType);
            break;
          case "greece":
            $("#menu").text("");
            getPic(foodType);
            break;
          case "allFood":
            $("#menu").text("");
            getPic(foodType);
            break;
          default:
          alert("shit");
        }
        var curFood = $(this).siblings("#left_menu li");
        $("#left_menu li").not(curFood).addClass("act");
        curFood.removeClass("act");
        return false;
      });

      // sort
      $("#sort a").click(function(){
        var curSort = $(this).siblings("#sort a");
        $("#sort a").not(curSort).addClass("act");
        curSort.removeClass("act");
        sorting();
        return false;
      });
      function sorting(){
        var prices =  $("#menu .gallery_item .price").text();
        console.log(prices);
        var prices_arr = prices.split('$');
        for (var i = 0; i < prices_arr.length; i++) {
        }
        console.log(prices_arr);
        function compareNumbers(a, b) {
          return a - b;
        }
        prices_arr.sort(compareNumbers);
        console.log(prices_arr);
      };


    });

    // popUp
    try {
      $(".gallery_item").click(function(){
        var retObj = [];
        for (var i = 1; i <= localStorage.length; i++) {
          retObj[i] = JSON.parse(localStorage.getItem("table_"+i));
          // console.log(retObj[i]);
          // console.log(retObj[i].Stolik);
          for (var j = 0; j < localStorage.length; j++) {
              var tempObj = retObj[i].Stolik[j];
            for (var key in tempObj) {
              if (key == "num") {
                var reservet = tempObj[key];
              } else if (key == "time"){
                var reservetTime = tempObj[key];
              }
              var tableNumber = $(this).find(".text").text();
               $(".popUp").fadeIn();
               $(".window").fadeIn();
               var headStol = $(".window .inner h3").text(tableNumber);
               if (headStol.text() == reservet) {
                 for (var k = 1; k < 5; k++) {
                  var allTime = $("select option[value='"+k+"']");
                  if (allTime.text() == reservetTime) {
                    allTime.attr("disabled","true");
                  } else {
                    // allTime.removeAttr("disabled");
                  }
                 }
               }
              // console.log(reservet +" "+ reservetTime);
            };
          }
        }


      });
      $(".popUp, .windowThx").click(function(e) {
       if($(e.target).closest(".window").length==0) $(".popUp, .windowThx").fadeOut();
      });
      $(".close").click(function(){
         $(".popUp, .windowThx").fadeOut();
      });
    } catch (e) {
      alert("Ошибка" + e.name + ":" + e.message + "\n" + e.stack);
    };


    // forma
    var counter = 0;
    try {
      var subBut = $("input[type='submit']");
        $(".rezerv-form").submit(function() {
        subBut.empty();
        $('.popUp .window').fadeOut();
        $('.popUp .windowThx').fadeIn(500);
        var rezStolik = $(".window .inner h3").text();
        var numStolik = parseInt(rezStolik);
        var rezName = $('input[name="rez-name"]').val();
        var rezTime = $('.select-time option:selected').text();
        obj = {"Stolik":[{"num":rezStolik},{"name":rezName},{"time":rezTime}]};
        var sObj = JSON.stringify(obj);
        counter++;
        localStorage["table_"+counter] = sObj;
        $('.rezerv-form')[0].reset();
        return false;
        });
    } catch (e) {
      alert("Ошибка в localStorage" + e.name + ":" + e.message + "\n" + e.stack);
    };


  // end of $(document).ready
  });
