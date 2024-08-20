var CartindoApp = CartindoApp || {};

CartindoApp.Actions = function(){

	//this.base_url = 'http://localhost/myolsera/public/';
	this.base_url = '/';

	(function(jQuery) {
	  jQuery.ajaxSetup({
	    beforeSend: function(xhr) {
	      var token = jQuery('meta[name="_csrf"]').attr('content');
	      xhr.setRequestHeader('X-CSRF-TOKEN', token);
	    }
	  });
	}(jQuery));

};

CartindoApp.Actions.prototype = (function () {
	var initBase = function(cb)
	{
		$('.slider').slider({}).on('slide', function(ev){
			$('#filter_price_min').val($(ev.currentTarget).slider('getValue')[0]);
			$('#filter_price_max').val($(ev.currentTarget).slider('getValue')[1]);
		});

		var $isotope = $('.isotope');
		$isotope.imagesLoaded(function(){
		  $('.isotope').isotope({
			itemSelector: '.item'
		  })
		});

		$('.iCheck').iCheck({
  		  checkboxClass: 'icheckbox_minimal',
		  labelHover: false,
		  cursor: true
		});

		$('.iRadio').iCheck({
  		  radioClass: 'iradio_minimal',
  		  labelHover: false,
		  cursor: true
		});

		$('.lnkfacebooksso').click(function(ev){
	    	$(ev.currentTarget).button('loading');
	    });

		$(".btnChangeCurrency").click(function (ev) {
			//cb.ChangeCurrency(ev);

			$("#btnCurrency").button('loading');

	        var currency_id = $(ev.currentTarget).attr('data-value');

	        $.ajax({
				type: "POST",
				url: cb.base_url + "changecurrency",
				data: {currency_id : currency_id},
				success: function( result ) {
					$("#btnCurrency").button('reset');
					window.location = "";
				},
				error: function(xhr, msg, error){
					$("#btnCurrency").button('reset');
					if (xhr.responseJSON)
						bootbox.alert(xhr.responseJSON, function() {});
					else
						bootbox.alert(error, function() {});
				}
			});
		});

		$('#search_product').typeahead({
			onSelect: function(item) {
		        document.location.href = item['value'];
		    },
		    ajax: {
		        url: cb.base_url + "catalog/search",
		        timeout: 500,
		        displayField: "name",
		        valueField: "url_route",
		        triggerLength: 1,
		        method: "get",
		        loadingClass: "loading-circle"
		    }
	    });

	    $('#formlistaddcartitem').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	         var cart = $('#olsera-btnshoppingcart');
	         var imgtodrag = $('#olsera-photogallery').find("img").eq(0);
	         if (imgtodrag) {
	             var imgclone = imgtodrag.clone()
	                 .offset({
	                 top: imgtodrag.offset().top,
	                 left: imgtodrag.offset().left
	             })
	                 .css({
	                 'opacity': '0.8',
	                     'position': 'absolute',
	                     'height': '150px',
	                     'width': '150px',
	                     '-webkit-border-radius': '30px',
						 '-moz-border-radius': '30px',
						 'border-radius': '30px',
	                     'z-index': '9999'
	             })
	                 .appendTo($('body'))
	                 .animate({
	                 'top': cart.offset().top + 20,
	                     'left': cart.offset().left + 20,
	                     'width': 75,
	                     'height': 75
	             }, 1000, 'easeInOutExpo');

	            $("html, body").animate({ scrollTop: 0 }, "slow");

	             setTimeout(function () {
	                 cart.effect("shake", {
	                     times: 2
	                 }, 200);

	                $("#olsera-btnshoppingcart").button('loading');
	                $.ajax({
						type: "POST",
						url: cb.base_url + "cart/add",
						data: $(ev.currentTarget).serialize(),
						success: function( result ) {
							$("#olsera-btnshoppingcart").button('reset');

							var carttemplate = $('#carttemplate').html();
							Mustache.parse(carttemplate);

							var carthtml = Mustache.render(carttemplate, {cart: result});
							$('.dropdown-menu-cart').html(carthtml);
							$('.amount.shopping-cart').html(result['fsubtotal']);
						},
						error: function(xhr, msg, error){
							$("#olsera-btnshoppingcart").button('reset');
							if (xhr.responseJSON)
								bootbox.alert(xhr.responseJSON, function() {});
							else
								bootbox.alert(error, function() {});
						}
					});

					$('#addCartModal').modal('hide');

	             }, 1500);

	             imgclone.animate({
	                 'width': 0,
	                 'height': 0
	             }, function () {
	                 $(this).detach()
	             });
	         }

	    });


	    $('#formaddcartitem').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var cart = $('#olsera-btnshoppingcart');
	        var imgtodrag = $('#olsera-photogallery').find("img").eq(0);
	         if (imgtodrag) {
	             var imgclone = imgtodrag.clone()
	                 .offset({
	                 top: imgtodrag.offset().top,
	                 left: imgtodrag.offset().left
	             })
	                 .css({
	                 'opacity': '0.8',
	                     'position': 'absolute',
	                     'height': '150px',
	                     'width': '150px',
	                     '-webkit-border-radius': '30px',
						 '-moz-border-radius': '30px',
						 'border-radius': '30px',
	                     'z-index': '9999'
	             })
	                 .appendTo($('body'))
	                 .animate({
	                 'top': cart.offset().top + 20,
	                     'left': cart.offset().left + 20,
	                     'width': 75,
	                     'height': 75
	             }, 1000, 'easeInOutExpo');

	             $("html, body").animate({ scrollTop: 0 }, "slow");

	             setTimeout(function () {
	                 cart.effect("shake", {
	                     times: 2
	                 }, 200);

	     			$("#olsera-btnshoppingcart").button('loading');
	                $.ajax({
						type: "POST",
						url: cb.base_url + "cart/add",
						data: $(ev.currentTarget).serialize(),
						success: function( result ) {
							$("#olsera-btnshoppingcart").button('reset');

							var carttemplate = $('#carttemplate').html();
							Mustache.parse(carttemplate);

							var carthtml = Mustache.render(carttemplate, {cart: result});
							$('.dropdown-menu-cart').html(carthtml);
							$('.amount.shopping-cart').html(result['fsubtotal']);

							$(".alert").delay(200).fadeIn().delay(4000).fadeOut();;

						},
						error: function(xhr, msg, error){
							$("#olsera-btnshoppingcart").button('reset');
							if (xhr.responseJSON)
								bootbox.alert(xhr.responseJSON, function() {});
							else
								bootbox.alert(error, function() {});
						}
					});

	             }, 1500);

	             imgclone.animate({
	                 'width': 0,
	                 'height': 0
	             }, function () {
	                 $(this).detach()
	             });
	         }

	    });

	    $('.btnprepareaddcart').on('click', function (ev) {
	    	var id = $(ev.currentTarget).attr('data-pk');
	    	$(ev.currentTarget).button('loading');

	    	$('#formlistaddcartitem').html('<i class="fa fa-spinner fa-2x fa-spin"></i>');
	    	$.ajax({
				type: "GET",
				url: cb.base_url + "catalog/productvariants/" + id,
				success: function( result ) {

					$(ev.currentTarget).button('reset');

					var addcarttemplate = $('#addcarttemplate').html();
					Mustache.parse(addcarttemplate);
					var phototemplate = $('#phototemplate').html();
					Mustache.parse(phototemplate);
					var productinfotemplate = $('#productinfotemplate').html();
					Mustache.parse(productinfotemplate);

					//replace variant pic to last pic
					if(result['has_variant'])
					{
						for (i = 0; i < result['variants'].length; i++) {
							var variants_photo_last =  result['variants'][i].photos.length - 1;
							result['variants'][i].photo_xs = result['variants'][i].photos[variants_photo_last].photo_xs;
							if (result['variants'][i]['stock_qty'] > 0)
								result['variants'][i]['stock_qty_status'] = true;
							else
								result['variants'][i]['stock_qty_status'] = false;

							//replace image is default
							if(result['variants'][i]['is_default'])
							{
								result['photos'] =  result['variants'][i].photos;
							}
						}
					}
					//end

					var addcarthtml = Mustache.render(addcarttemplate, {product: result});
					$('#formlistaddcartitem').html(addcarthtml);

					var product = result;

					// for (var i=0; i< product['photos'].length; i++)
					// {
					// 	product['photos'][i]['idx'] = i;

					// 	if (i == 0)
					// 	{
					// 		product['photos'][i]['active'] = true;
					// 	}
					// }

					var photohtml = Mustache.render(phototemplate, {photos: product['photos']});
					$('.olsera-product-gallery').html(photohtml);
					$('.sp-wrap').smoothproducts();


					$('input.raditemvariant').on('ifChecked', function(ev){
					    var variantid = $(ev.currentTarget).val();
					    //var imgvariantsrc = $(ev.currentTarget).data('url');
					    //$('#imgitem').attr('style', "background-image:url('" + imgvariantsrc + "'); height:480px;" );

						$.each(result.variants, function( index, object ) {
						   if (object['id'] == variantid)
						   {
						   	  variant = object;
						   }
						});

						// for (var i=0; i< variant['photos'].length; i++)
						// {
						// 	variant['photos'][i]['idx'] = i;

						// 	if (i == 0)
						// 	{
						// 		variant['photos'][i]['active'] = true;
						// 	}
						// }

						var photohtml = Mustache.render(phototemplate, {photos: variant['photos']});
						$('.olsera-product-gallery').html(photohtml);
						$('.sp-wrap').smoothproducts();

						var productinfohtml = Mustache.render(productinfotemplate, {product:variant});
						$('.olsera-product-info').html(productinfohtml);
					});

					$('select#item_variant_id').on('change', function(ev){
					    var variantid = $(ev.currentTarget).val();
					    //var imgvariantsrc = $(ev.currentTarget).data('url');
					    //$('#imgitem').attr('style', "background-image:url('" + imgvariantsrc + "'); height:480px;" );

						$.each(result.variants, function( index, object ) {
						   if (object['id'] == variantid)
						   {
						   	  variant = object;
						   }
						});

						// for (var i=0; i< variant['photos'].length; i++)
						// {
						// 	variant['photos'][i]['idx'] = i;

						// 	if (i == 0)
						// 	{
						// 		variant['photos'][i]['active'] = true;
						// 	}
						// }

						var photohtml = Mustache.render(phototemplate, {photos: variant['photos']});
						$('.olsera-product-gallery').html(photohtml);
						$('.sp-wrap').smoothproducts();

						var productinfohtml = Mustache.render(productinfotemplate, {product:variant});
						$('.olsera-product-info').html(productinfohtml);
					});

					if (result.variant_type_count > 1)
					{
						if (result.variant_type_count == 2)
						{
							$('#item_variant_id').chained('#item_variant_group');
						}
						else
						{
							$('#item_variant_group_sub').chained('#item_variant_group');
							$('#item_variant_id').chained('#item_variant_group_sub');
						}
					}


					$('.iRadio').iCheck({
			  		  radioClass: 'iradio_minimal',
			  		  labelHover: false,
					  cursor: true
					});

					$('input.raditemvariant:first').iCheck('check');

				},
				error: function(xhr, msg, error){
					$(ev.currentTarget).button('reset');
					if (xhr.responseJSON)
						bootbox.alert(xhr.responseJSON, function() {});
					else
						bootbox.alert(error, function() {});
				}
			});
	    });

	    $('.btnprepareaddcartcombo').on('click', function (ev) {
	    	var id = $(ev.currentTarget).attr('data-pk');
	    	$(ev.currentTarget).button('loading');

	    	$('#formlistaddcartitem').html('<i class="fa fa-spinner fa-2x fa-spin"></i>');
	    	$.ajax({
				type: "GET",
				url: cb.base_url + "catalog/combovariants/" + id,
				success: function( result ) {
					$(ev.currentTarget).button('reset');

					var addcarttemplate = $('#addcarttemplate').html();
					Mustache.parse(addcarttemplate);

					var addcarthtml = Mustache.render(addcarttemplate, {combo: result});
					$('#formlistaddcartitem').html(addcarthtml);

					$('.iRadio').iCheck({
			  		  radioClass: 'iradio_minimal',
			  		  labelHover: false,
					  cursor: true
					});

					$('input.raditemvariant').on('ifChecked', function(ev){
					    var variantid = $(ev.currentTarget).val();
					    var imgvariantsrc = $('#imgproductvariant_' + variantid).attr('src');
					    $('#imgitem').attr('src', imgvariantsrc);
					});

					$('.sp-wrap').smoothproducts();
				},
				error: function(xhr, msg, error){
					$(ev.currentTarget).button('reset');
					if (xhr.responseJSON)
						bootbox.alert(xhr.responseJSON, function() {});
					else
						bootbox.alert(error, function() {});
				}
			});
	    });

	    $('.btnprepareaddcartdeal').on('click', function (ev) {
	    	var id = $(ev.currentTarget).attr('data-pk');
	    	$(ev.currentTarget).button('loading');

	    	$('#formlistaddcartitem').html('<i class="fa fa-spinner fa-2x fa-spin"></i>');
	    	$.ajax({
				type: "GET",
				url: cb.base_url + "dailydeals/dealvariants/" + id,
				success: function( result ) {
					$(ev.currentTarget).button('reset');

					var addcarttemplate = $('#addcarttemplate').html();
					Mustache.parse(addcarttemplate);

					var addcarthtml = Mustache.render(addcarttemplate, {deal: result});
					$('#formlistaddcartitem').html(addcarthtml);

					$('.sp-wrap').smoothproducts();

					$('.iRadio').iCheck({
			  		  radioClass: 'iradio_minimal',
			  		  labelHover: false,
					  cursor: true
					});

					$('input.raditemvariant').on('ifChecked', function(ev){
					    var variantid = $(ev.currentTarget).val();
					    var imgvariantsrc = $('#imgproductvariant_' + variantid).attr('src');
					    $('#imgitem').attr('src', imgvariantsrc);
					});

				},
				error: function(xhr, msg, error){
					$(ev.currentTarget).button('reset');
					if (xhr.responseJSON)
						bootbox.alert(xhr.responseJSON, function() {});
					else
						bootbox.alert(error, function() {});
				}
			});
	    });

	    $('.cart-remove').on('click', function (ev) {
	    	var itemid = $(ev.currentTarget).attr('data-itemid');
	    	var variantid = $(ev.currentTarget).attr('data-varid');
	    	var type = $(ev.currentTarget).attr('data-type');

			$(ev.currentTarget).button('loading');
	        $.ajax({
				type: "POST",
				url: cb.base_url + "cart/remove",
				data: {item_id : itemid, item_variant_id:variantid, item_type:type},
				success: function( result ) {
					$(ev.currentTarget).button('reset');
					window.location.href = '';
				},
				error: function(xhr, msg, error){
					$(ev.currentTarget).button('reset');
					if (xhr.responseJSON)
						bootbox.alert(xhr.responseJSON, function() {});
					else
						bootbox.alert(error, function() {});
				}
			});
	    });

	    $('.addcompare').on('click', function (ev) {
	    	var itemid = $(ev.currentTarget).attr('data-itemid');

	        var comparison = $('#btncomparison');
	        var imgtodrag = $(this).parent().parent().find("img").eq(0);
	        if (imgtodrag) {
	            var imgclone = imgtodrag.clone()
	                .offset({
	                top: imgtodrag.offset().top,
	                left: imgtodrag.offset().left
	            })
	                .css({
	                'opacity': '0.6',
	                    'position': 'absolute',
	                    'height': '150px',
	                    'width': '150px',
	                    '-webkit-border-radius': '30px',
						'-moz-border-radius': '30px',
						'border-radius': '30px',
	                    'z-index': '9999'
	            })
	                .appendTo($('body'))
	                .animate({
	                'top': comparison.offset().top + 20,
	                    'left': comparison.offset().left + 20,
	                    'width': 75,
	                    'height': 75
	            }, 1000, 'easeInOutExpo');

	            setTimeout(function () {
	                comparison.effect("shake", {
	                    times: 2
	                }, 200);

	                $.ajax({
						type: "POST",
						url: cb.base_url + "compare/add",
						data: {item_id : itemid},
						success: function( result ) {
							var comparetemplate = $('#comparetemplate').html();
							Mustache.parse(comparetemplate);

							var comparehtml = Mustache.render(comparetemplate, {compare: result});
							$('.comparisonitems').html(comparehtml);
							$('.count.comparison').html(result['count']);

							$('.comparisoninfo').show();
						},
						error: function(xhr, msg, error){
							if (xhr.responseJSON)
								bootbox.alert(xhr.responseJSON, function() {});
							else
								bootbox.alert(error, function() {});
						}
					});

	            }, 1500);

	            imgclone.animate({
	                'width': 0,
	                    'height': 0
	            }, function () {
	                $(this).detach()
	            });
	        }
	    });

	    $(".clearcompare").click(function (ev) {

			$(ev.currentTarget).button('loading');

	        $.ajax({
				type: "POST",
				url: cb.base_url + "compare/clear",
				success: function( result ) {
					$(ev.currentTarget).button('reset');

					var comparetemplate = $('#comparetemplate').html();
					Mustache.parse(comparetemplate);

					var comparehtml = Mustache.render(comparetemplate, {compare: result});
					$('.comparisonitems').html(comparehtml);
					$('.count.comparison').html(result['count']);

					$('.comparisoninfo').hide();
				},
				error: function(xhr, msg, error){
					$(ev.currentTarget).button('reset');
					if (xhr.responseJSON)
						bootbox.alert(xhr.responseJSON, function() {});
					else
						bootbox.alert(error, function() {});
				}
			});
		});

		$('.formsubscribe').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
	        	$(".btnsubscribe").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "subscribe",
					data: data,
					success: function( result ) {
						$(".btnsubscribe").html('&nbsp;<i class="fa fa-check"></i>')
					},
					error: function(xhr, msg, error){
						$(".btnsubscribe").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });

	}

	var initProduct = function (cb) {
		// Fancybox
		//$(".photo").fancybox();
		Socialite.load();

		var phototemplate = $('#phototemplate').html();
		var pricetemplate = $('#pricetemplate').html();
		var availabilitytemplate = $('#availabilitytemplate').html();
		Mustache.parse(phototemplate);
		Mustache.parse(pricetemplate);
		Mustache.parse(availabilitytemplate);

		$('input.radvariant').on('ifChecked', function(ev){
		    var variantid = $(ev.currentTarget).val();
		    $('#item_variant_id').val(variantid);
		    var variant;
		    $.each(variants, function( index, object ) {
			   if (object['id'] == variantid)
			   {
			   	  variant = object;
			   }
			});

			// for (var i=0; i< variant['photos'].length; i++)
			// {
			// 	variant['photos'][i]['idx'] = i;

			// 	if (i == 0)
			// 	{
			// 		variant['photos'][i]['active'] = true;
			// 	}
			// }

			var photohtml = Mustache.render(phototemplate, {photos: variant['photos']});
			var pricehtml = Mustache.render(pricetemplate, {variant: variant});
			var availabilityhtml = Mustache.render(availabilitytemplate, {in_stock: variant['in_stock'], accept_preorder: variant['accept_preorder']});

			$('.olsera-product-gallery').empty();
			$('.olsera-product-gallery').html(photohtml);
			$('.olsera-product-price').html(pricehtml);
			$('.olsera-product-availability').html(availabilityhtml);

			$('.olsera-product-gallery .sp-wrap').smoothproducts();
			// $('#productCarousel').carousel({
			// 	interval: 5000,
			// 	pause	: 'hover'
			// });

			//$(".photo").fancybox();

		});

		$('#item_variant').trigger('change');

		$('#item_variant').on('change', function (ev) {

			var variantid = $(ev.currentTarget).val();
			$('#item_variant_id').val(variantid);
		    var variant;
		    $.each(variants, function( index, object ) {
			   if (object['id'] == variantid)
			   {
			   	  variant = object;
			   }
			});

			var photohtml = Mustache.render(phototemplate, {photos: variant['photos']});
			var pricehtml = Mustache.render(pricetemplate, {variant: variant});
			var availabilityhtml = Mustache.render(availabilitytemplate, {in_stock: variant['in_stock'], accept_preorder: variant['accept_preorder']});

			$('.olsera-product-gallery').html(photohtml);
			$('.olsera-product-price').html(pricehtml);
			$('.olsera-product-availability').html(availabilityhtml);

			$('.sp-wrap').smoothproducts();
		});

		$(window).load( function() {
			$('#item_variant').trigger('change');
		});

		$('.btnreviewspage').on('click', function (ev) {
	    	$(ev.currentTarget).button('loading');
	    	var id = $(ev.currentTarget).attr('data-pk');
	    	var page = $(ev.currentTarget).attr('data-page');
	    	var type = 'P';

	    	var reviewstemplate = $('#reviewstemplate').html();
			Mustache.parse(reviewstemplate);

	        $.ajax({
				type: "GET",
				url: cb.base_url + "catalog/reviews",
				data: {id:id, type:type, page:page},
				success: function( result ) {
					var reviewshtml = Mustache.render(reviewstemplate, result);
					$('#reviewscontent').html(reviewshtml);
					$('.reviewsrating').rating();

					$('.btnreviewspage').parent().removeClass('active');
					$(ev.currentTarget).parent().addClass('active');
					$('.reviews-page-info').html(result['reviewspageinfo']['info']);

					$(ev.currentTarget).button('reset');
				},
				error: function(xhr, msg, error){
					$(ev.currentTarget).button('reset');
					if (xhr.responseJSON)
						bootbox.alert(xhr.responseJSON, function() {});
					else
						bootbox.alert(error, function() {});
				}
			});
	    });
	}

	var initDeals = function (cb) {

	  var deal_countdowns = document.getElementsByClassName("deal_countdown");

	  for (var i=0; i < deal_countdowns.length; i++) {
		  setInterval(function(j){
		  	var data_deadline = deal_countdowns[j].getAttribute('data-deadline');
	  		var deadline = new Date(data_deadline);
	  		deadline -= new Date(data_deadline).getTimezoneOffset() / 60;

		  	var timer = countdown(deadline);
		    var timerhours = timer.hours;
	  	    if (timer.hours < 10) timerhours = "0" + timer.hours;
	  	    var timerminutes = timer.minutes;
	  	    if (timer.minutes < 10) timerminutes = "0" + timer.minutes;
	  	    var timerseconds = timer.seconds;
	  	    if (timer.seconds < 10) timerseconds = "0" + timer.seconds;
	        deal_countdowns[j].innerHTML = timerhours + ":" + timerminutes + ":" + timerseconds;
		  }, 1000, i);

	  };
	}

	var initDeal = function (cb) {
	  Socialite.load();

	  var deal_countdown = document.getElementById("deal_countdown");

	  setInterval(function(){
	  	var data_deadline = deal_countdown.getAttribute('data-deadline');
  		var deadline = new Date(data_deadline);
  		deadline -= new Date(data_deadline).getTimezoneOffset() / 60;

	  	var timer = countdown(deadline);
	    var timerhours = timer.hours;
  	    if (timer.hours < 10) timerhours = "0" + timer.hours;
  	    var timerminutes = timer.minutes;
  	    if (timer.minutes < 10) timerminutes = "0" + timer.minutes;
  	    var timerseconds = timer.seconds;
  	    if (timer.seconds < 10) timerseconds = "0" + timer.seconds;
        deal_countdown.innerHTML = timerhours + ":" + timerminutes + ":" + timerseconds;
	  }, 1000);

	  //$(".photo").fancybox();

	  $('.btnreviewspage').on('click', function (ev) {
	    	$(ev.currentTarget).button('loading');
	    	var id = $(ev.currentTarget).attr('data-pk');
	    	var page = $(ev.currentTarget).attr('data-page');
	    	var type = 'D';

	    	var reviewstemplate = $('#reviewstemplate').html();
			Mustache.parse(reviewstemplate);


	        $.ajax({
				type: "GET",
				url: cb.base_url + "catalog/reviews",
				data: {id:id, type:type, page:page},
				success: function( result ) {
					var reviewshtml = Mustache.render(reviewstemplate, result);
					$('#reviewscontent').html(reviewshtml);
					$('.reviewsrating').rating();

					$('.btnreviewspage').parent().removeClass('active');
					$(ev.currentTarget).parent().addClass('active');
					$('.reviews-page-info').html(result['reviewspageinfo']['info']);

					$(ev.currentTarget).button('reset');
				},
				error: function(xhr, msg, error){
					$(ev.currentTarget).button('reset');
					if (xhr.responseJSON)
						bootbox.alert(xhr.responseJSON, function() {});
					else
						bootbox.alert(error, function() {});
				}
			});
	    });

	}

	var initCombo = function (cb) {
		// Fancybox
		//$(".photo").fancybox();
		Socialite.load();

		$('.btnreviewspage').on('click', function (ev) {
	    	$(ev.currentTarget).button('loading');
	    	var id = $(ev.currentTarget).attr('data-pk');
	    	var page = $(ev.currentTarget).attr('data-page');
	    	var type = 'C';

	    	var reviewstemplate = $('#reviewstemplate').html();
			Mustache.parse(reviewstemplate);

	        $.ajax({
				type: "GET",
				url: cb.base_url + "catalog/reviews",
				data: {id:id, type:type, page:page},
				success: function( result ) {
					var reviewshtml = Mustache.render(reviewstemplate, result);
					$('#reviewscontent').html(reviewshtml);
					$('.reviewsrating').rating();

					$('.btnreviewspage').parent().removeClass('active');
					$(ev.currentTarget).parent().addClass('active');
					$('.reviews-page-info').html(result['reviewspageinfo']['info']);

					$(ev.currentTarget).button('reset');
				},
				error: function(xhr, msg, error){
					$(ev.currentTarget).button('reset');
					if (xhr.responseJSON)
						bootbox.alert(xhr.responseJSON, function() {});
					else
						bootbox.alert(error, function() {});
				}
			});
	    });
	}

	var initCart = function (cb) {

		$( "#btnupdatecart").click(function() {
		  $( "#formupdatecart").submit();
		});

		$('#formupdatecart').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#btnupdatecart").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "cart/update",
					data: data,
					success: function( result ) {
						document.location.href = '';
					},
					error: function(xhr, msg, error){
						$("#btnupdatecart").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });

	    $('#formcouponcode').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#formcouponcode button:submit").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "cart/applypromocode",
					data: data,
					success: function( result ) {
						document.location.href = '';
					},
					error: function(xhr, msg, error){
						$("#formcouponcode button:submit").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });

	    $('#removepromocode').on('click', function (ev) {
	    	$(ev.currentTarget).button('loading');
	        $.ajax({
				type: "POST",
				url: cb.base_url + "cart/removepromocode",
				success: function( result ) {
					$(ev.currentTarget).button('reset');
					window.location.href = '';
				},
				error: function(xhr, msg, error){
					$(ev.currentTarget).button('reset');
					if (xhr.responseJSON)
						bootbox.alert(xhr.responseJSON, function() {});
					else
						bootbox.alert(error, function() {});
				}
			});
	    });

	}

		var initCheckout = function (cb) {


		if($('input[type="checkbox"]#checkout-guest').is(":checked")){
            //if(ev.preventDefault) ev.preventDefault();
	    	//if (ev.stopPropagation) ev.stopPropagation();
	    	$('.guest').hide();
	    	$('.guest-email').find('input').attr("data-parsley-required", false);
	    	$('.guest').find('input').attr("data-parsley-required", false);
	    	$('.block-login').show();

        }
        else {
	        //if(ev.preventDefault) ev.preventDefault();
	    	//if (ev.stopPropagation) ev.stopPropagation();
	    	$('.guest').show();
	    	$('.guest-email').find('input').attr("data-parsley-required", true);
	    	$('.guest').find('input').attr("data-parsley-required", true);
	    	$('.block-login').hide();
        }

        if($('input[type="checkbox"]#chkdiffshipping').is(":checked")){
            //if(ev.preventDefault) ev.preventDefault();
	    	//if (ev.stopPropagation) ev.stopPropagation();
	    	$('#collapseshipping').addClass('in');
        }
        else {
	        //if(ev.preventDefault) ev.preventDefault();
	    	//if (ev.stopPropagation) ev.stopPropagation();
	    	$('#collapseshipping').removeClass("in").addClass("collapse");
        }

        if($('input[type="checkbox"]#chkdropship').is(":checked")){
            //if(ev.preventDefault) ev.preventDefault();
	    	//if (ev.stopPropagation) ev.stopPropagation();
	    	$('#collapsedropship').addClass('in');
	    	$('.drop-ship').find('input').attr("data-parsley-required", true);
        }
        else {
	        //if(ev.preventDefault) ev.preventDefault();
	    	//if (ev.stopPropagation) ev.stopPropagation();
	    	$('#collapsedropship').removeClass("in").addClass("collapse");
	    	$('.drop-ship').find('input').attr("data-parsley-required", false);
        }


		$('input[type="checkbox"]#chkdiffshipping').click(function(ev){
	        if($(this).is(":checked")){
	            //if(ev.preventDefault) ev.preventDefault();
		    	if (ev.stopPropagation) ev.stopPropagation();
		    	$('#collapseshipping').toggleClass('in collapse');
	        }
	        else if($(this).is(":not(:checked)")){
		        //if(ev.preventDefault) ev.preventDefault();
		    	if (ev.stopPropagation) ev.stopPropagation();

		    	$('#collapseshipping').removeClass("in").addClass("collapse");

		    	$('input[type="checkbox"]#chkdropship').attr('checked', false);
		    	$('#collapsedropship').removeClass("in").addClass("collapse");
		    	$('.drop-ship').find('input').attr("data-parsley-required", false);
		    	$('.drop-ship').find('input').val('');
	        }
        });

        $('input[type="checkbox"]#chkdropship').click(function(ev){
	        if($(this).is(":checked")){
	            //if(ev.preventDefault) ev.preventDefault();
		    	if (ev.stopPropagation) ev.stopPropagation();
		    	$('#collapsedropship').toggleClass('in collapse');
		    	$('.drop-ship').find('input').attr("data-parsley-required", true);
	        }
	        else if($(this).is(":not(:checked)")){
		        //if(ev.preventDefault) ev.preventDefault();
		    	if (ev.stopPropagation) ev.stopPropagation();

		    	$('#collapsedropship').removeClass("in").addClass("collapse");
		    	$('.drop-ship').find('input').attr("data-parsley-required", false);
		    	$('.drop-ship').find('input').val('');
	        }
        });


		$('input[type="checkbox"]#checkout-guest').click(function(ev){
	        if($(this).is(":checked")){
	            //if(ev.preventDefault) ev.preventDefault();
		    	if (ev.stopPropagation) ev.stopPropagation();
		    	$('.guest').hide();
		    	$('.guest-email').find('input').attr("data-parsley-required", false);
		    	$('.guest').find('input').attr("data-parsley-required", false);
		    	$('.block-login').show('fast');

	        }
	        else if($(this).is(":not(:checked)")){
		        //if(ev.preventDefault) ev.preventDefault();
		    	if (ev.stopPropagation) ev.stopPropagation();
		    	$('.guest').show();
		    	$('.guest-email').find('input').attr("data-parsley-required", true);
		    	$('.guest').find('input').attr("data-parsley-required", true);
		    	$('.block-login').hide('fast');
	        }
        });

		$("#state_id").remoteChained({
			parents: "#country_id",
			url: cb.base_url + "country/states",
			clear: true,
			loading : "Loading..."
		});

		$("#city_id").remoteChained({
			parents: "#state_id",
			url: cb.base_url + "country/state/cities",
			clear: true,
			loading : "Loading..."
		});

		$("#subdistrict_id").remoteChained({
			parents: "#city_id",
			url: cb.base_url + "country/city/subdistricts",
			clear: true,
			loading : "Loading..."
		});

		$("#shipping_state_id").remoteChained({
			parents: "#shipping_country_id",
			url: cb.base_url + "country/shippingstates",
			clear: true,
			loading : "Loading..."
		});

		$("#shipping_city_id").remoteChained({
			parents: "#shipping_state_id",
			url: cb.base_url + "country/shippingstate/cities",
			clear: true,
			loading : "Loading..."
		});

		$("#shipping_subdistrict_id").remoteChained({
			parents: "#shipping_city_id",
			url: cb.base_url + "country/shippingcity/subdistricts",
			clear: true,
			loading : "Loading..."
		});

		$( "#btnsignincheckout").click(function() {
		  $( "#formsignincheckout").submit();
		});

		$('#formsignincheckout').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#btnsignincheckout").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/dosignin",
					data: data,
					success: function( result ) {
						document.location.href = "";
					},
					error: function(xhr, msg, error){
						$("#btnsignincheckout").button('reset');
						if (xhr.responseJSON)
							alert(xhr.responseJSON, function() {});
						else
							alert(error, function() {});
					}
				});
			}

	    });

	    $('#formcheckout').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#formcheckout button:submit").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "cart/docheckout",
					data: data,
					success: function( result ) {
						document.location.href = cb.base_url + 'cart/payment';
					},
					error: function(xhr, msg, error){
						$("#formcheckout button:submit").button('reset');
						if (xhr.responseJSON)
							alert(xhr.responseJSON, function() {});
						else
							alert(error, function() {});
					}
				});
			}

	    });
	}


	var initPayment = function(cb) {
		$('input.radshippingtariff').on('ifChecked', function(ev){
		    var shippingtariffid = $(ev.currentTarget).val();
		    $('.shipping_id').val(shippingtariffid);

		    var shippingtariff;
		    $.each(shippingtariffs, function( index, object ) {
			   if (object['id'] == shippingtariffid)
			   {
			   	  shippingtariff = object;
			   }
			});

			$('#cart_shipping_amount').html(shippingtariff['ftotal_tariff']);
			$('#cart_grand_total').html(shippingtariff['fgrand_total']);
			$('.__payment_amount_uq').html(shippingtariff['fgrand_total_unique_code']);
			$('.__payment_amount').html(shippingtariff['fgrand_total']);
			$('.shipping_amount').val(shippingtariff['ctotal_tariff']);
			$('.grand_total').val(shippingtariff['grand_total']);
		});


        //Midtrans SNAP
        $('#form-snap-submit').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();

	        if ( data ) {
                $("#btnSN").button('loading');
                $.ajax({
                    type: "POST",
                    url: cb.base_url + "cart/process-order",
                    data: data,
                    success: function( dataResult ) {
                        var snapToken = dataResult['token'];
                        var orderID = dataResult['orderID'];

                        snap.show();
                        if(snapToken){
                            snap.pay(snapToken,{
                                onSuccess: function(result){
                                    //var res = result['finish_redirect_url'].replace("example.com", "localhost/myolsera%20Cloud%2011-nov-2016/public/account/orders/pay-with-veritrans-completed");
                                    window.location.replace(result['finish_redirect_url']);
                                },
                              onPending: function(result){
                                    window.location.replace(result['finish_redirect_url']);
                                    //$("#btnSN").button('reset');
                                },
                              onError: function(result){
                                    $.ajax({
                                    type: "POST",
                                    url: cb.base_url + "account/order/cancel",
                                    data: {order_id:orderID},
                                    success: function( cancelresult ) {

                                    },
                                    error: function(xhr, msg, error){
                                        $(ev.currentTarget).button('reset');
                                        if (xhr.responseJSON)
                                            bootbox.alert(xhr.responseJSON, function() {});
                                        else
                                            bootbox.alert(error, function() {});
                                    }
                                    });
                                    $("#btnSN").button('reset');
                                },
                              onClose: function(){
                                    $.ajax({
                                    type: "POST",
                                    url: cb.base_url + "account/order/cancel",
                                    data: {order_id:orderID},
                                    success: function( cancelresult ) {
                                        bootbox.alert('customer closed the popup without finishing the payment', function() {});
                                    },
                                    error: function(xhr, msg, error){
                                        $(ev.currentTarget).button('reset');
                                        if (xhr.responseJSON)
                                            bootbox.alert(xhr.responseJSON, function() {});
                                        else
                                            bootbox.alert(error, function() {});
                                    }
                                    });
                                    $("#btnSN").button('reset');
                                }
                            });
                        }else{
                            $("#btnSN").button('reset');
                            snap.hide();
                            bootbox.alert('Failed to fetch snap token', function() {});
                        }
                    },
                    error: function(xhr, msg, error){
                        $("#btnSN").button('reset');
                        if (xhr.responseJSON)
                            bootbox.alert(xhr.responseJSON, function() {});
                        else
                            bootbox.alert(error, function() {});
                    }
                });
            }

		});


		// VT-Direct
		if($("#production-mode").val() == 1)
			Veritrans.url ="https://api.veritrans.co.id/v2";
		else
		 	Veritrans.url = "https://api.sandbox.veritrans.co.id/v2/token";

	  Veritrans.client_key = $("#client-key").val();

		$('#submit-vt-direct').click(function(ev){

			if(ev.preventDefault) ev.preventDefault();
			if (ev.stopPropagation) ev.stopPropagation();
			if (!$('#formpayment_VD').parsley().validate()) return;
			$(this).attr("disabled", "disabled");
			var card = function(){
				return {
					'card_number'     : $("#card-number").val(),
					'card_exp_month'  : $("#card-expiry-month").val(),
					'card_exp_year'   : $("#card-expiry-year").val(),
					'card_cvv'        : $("#card-cvv").val(),
					// Set 'secure', and 'gross_amount', if the merchant wants transaction to be processed with 3D Secure
					'secure'       : true,
					'gross_amount'   : $("#price").val()
				}
			};
			Veritrans.token(card, vtdirectcallback);
    	return false;
		});

	}


	var initOrder = function(cb) {
		$( ".btncancelorder").click(function(ev) {
			var id = $(ev.currentTarget).attr('data-key');
			var msg = $(ev.currentTarget).attr('data-msg');
		  	bootbox.confirm(msg, function(result) {
		  		if (result)
		  		{
		  			$(ev.currentTarget).button('loading');
		  			$.ajax({
						type: "POST",
						url: cb.base_url + "account/order/cancel",
						data: {order_id:id},
						success: function( result ) {
							document.location.href = cb.base_url + "account/orders";
						},
						error: function(xhr, msg, error){
							$(ev.currentTarget).button('reset');
							if (xhr.responseJSON)
								bootbox.alert(xhr.responseJSON, function() {});
							else
								bootbox.alert(error, function() {});
						}
					});
		  		}
			});
		});

		// VT-Direct



		$('#submit-vt-direct').click(function(ev){

	  	if(ev.preventDefault) ev.preventDefault();
			if (ev.stopPropagation) ev.stopPropagation();
			if (!$('#formpayment_VD').parsley().validate()) return;
			$(this).attr("disabled", "disabled");
			var card = function(){
				return {
					'card_number'     : $("#card-number").val(),
					'card_exp_month'  : $("#card-expiry-month").val(),
					'card_exp_year'   : $("#card-expiry-year").val(),
					'card_cvv'        : $("#card-cvv").val(),
					// Set 'secure', and 'gross_amount', if the merchant wants transaction to be processed with 3D Secure
					'secure'       : true,
					'gross_amount'   : $("#price").val()
				}
			};
			if($("#production-mode").val() == 1)
				Veritrans.url ="https://api.veritrans.co.id/v2";
			else
			 	Veritrans.url = "https://api.sandbox.veritrans.co.id/v2/token";

	  		Veritrans.client_key = $("#client-key").val();
			Veritrans.token(card, vtdirectcallback);
    	return false;
		});


        // Midtrans SNAP
        $('.btn-pay-snap').on('click', function (ev) {

            var id = $(ev.currentTarget).attr('data-order-id');

            if ( id ) {
                        $(".btnupdatepaymenttype").button('loading');
                        $.ajax({
                            type: "GET",
                            url: cb.base_url + "account/orders/pay-with-midtrans-snap/" + id ,
                            // data: data,
                            success: function( dataResult ) {
                                var snapToken = dataResult['token'];
                                var orderID = dataResult['orderID'];

                                snap.show();
                                if(snapToken){
                                    snap.pay(snapToken,{
                                        onSuccess: function(result){
                                            window.location.replace(result['finish_redirect_url']);
                                        },
                                      onPending: function(result){
                                            //console.log(result);
                                            window.location.replace(result['finish_redirect_url']);
                                        },
                                      onError: function(result){
                                            $.ajax({
                                            type: "POST",
                                            url: cb.base_url + "account/order/cancel",
                                            data: {order_id:orderID},
                                            success: function( cancelresult ) {

                                            },
                                            error: function(xhr, msg, error){
                                                $(ev.currentTarget).button('reset');
                                                if (xhr.responseJSON)
                                                    bootbox.alert(xhr.responseJSON, function() {});
                                                else
                                                    bootbox.alert(error, function() {});
                                            }
                                            });
                                        },
                                      onClose: function(){
                                            $.ajax({
                                            type: "POST",
                                            url: cb.base_url + "account/order/cancel",
                                            data: {order_id:orderID},
                                            success: function( cancelresult ) {
                                                bootbox.alert('customer closed the popup without finishing the payment', function() {});
                                            },
                                            error: function(xhr, msg, error){
                                                $(ev.currentTarget).button('reset');
                                                if (xhr.responseJSON)
                                                    bootbox.alert(xhr.responseJSON, function() {});
                                                else
                                                    bootbox.alert(error, function() {});
                                            }
                                            });
                                        }
                                    });
                                }else{
                                    snap.hide();
                                    bootbox.alert('Failed to fetch snap token', function() {});
                                }
                            },
                            error: function(xhr, msg, error){
                                $("#btnupdatepaymenttype").button('reset');
                                if (xhr.responseJSON)
                                    bootbox.alert(xhr.responseJSON, function() {});
                                else
                                    bootbox.alert(error, function() {});
                            }
                        });
                    }

        });

		$( ".btnpaywithpaypal").click(function(ev) {
		  	var id = $(ev.currentTarget).attr('data-key');
		  	$(".btnpaywithpaypal").button('loading');
		  	document.location.href = cb.base_url + "account/orders/pay-with-paypal/" + id;
		});

		$( "#btnupdatebankreceipt").click(function() {
		  $( "#formbankreceipt").submit();
		});

		$('#payment_date').datepicker({
			format: "dd-M-yyyy",
			endDate: '0d',
			autoclose:true
		});

		$('.formpaymenttype').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$(".btnupdatepaymenttype").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/order/updatepaymenttype",
					data: data,
					success: function( result ) {
						if(result.payment_type_id == 'VT')
						{
							document.location.href = cb.base_url + "account/orders/pay-with-veritrans/" + result.order_id;
							return;
						}
						document.location.href = '';
					},
					error: function(xhr, msg, error){
						$("#btnupdatepaymenttype").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });

	    $('#formbankreceipt').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#btnupdatebankreceipt").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/order/updatebankreceipt",
					data: data,
					success: function( result ) {
						document.location.href = '';
					},
					error: function(xhr, msg, error){
						$("#btnupdatebankreceipt").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});					}
				});
			}

	    });
	}

	var initSignin = function (cb) {
		$('#formsignin').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#formsignin button:submit").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/dosignin",
					data: data,
					success: function( result ) {
						document.location.href = cb.base_url + "account/profile";
					},
					error: function(xhr, msg, error){
						$("#formsignin button:submit").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });

	    $('#formregister').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
			if ( data ) {
				$("#formregister button:submit").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/dosignup",
					data: data,
					success: function( result ) {
						document.location.href = cb.base_url + "account/profile";
					},
					error: function(xhr, msg, error){
						$("#formregister button:submit").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });

	}

	var initProfile = function (cb) {

		$("#state_id").remoteChained({
			parents: "#country_id",
			url: cb.base_url + "country/states",
			clear: true,
			loading : "Loading..."
		});

		$("#city_id").remoteChained({
			parents: "#state_id",
			url: cb.base_url + "country/state/cities",
			clear: true,
			loading : "Loading..."
		});

		$("#subdistrict_id").remoteChained({
			parents: "#city_id",
			url: cb.base_url + "country/city/subdistricts",
			clear: true,
			loading : "Loading..."
		});

		$( "#btnupdateaddress").click(function() {
		  $( "#formaddress").submit();
		});

		$('#formaddress').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#btnupdateaddress").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/doupdateaddress",
					data: data,
					success: function( result ) {
						document.location.href = '';
					},
					error: function(xhr, msg, error){
						$("#btnupdateaddress").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });

	}

	var initChangePassword = function (cb) {
		$('#formchangepassword').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#formchangepassword button:submit").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/doupdatepassword",
					data: data,
					success: function( result ) {
						var successtemplate = $('#successtemplate').html();
						Mustache.parse(successtemplate);
						var successhtml = Mustache.render(successtemplate);
						$('#changepasswordbody').html(successhtml);

						$("#formchangepassword button:submit").button('reset');
					},
					error: function(xhr, msg, error){
						$("#formchangepassword button:submit").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });
	}

	var initForgotPassword = function (cb) {
		$('#formforgotpassword').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#formforgotpassword button:submit").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/doretrievepassword",
					data: data,
					success: function( result ) {
						var successtemplate = $('#successtemplate').html();
						Mustache.parse(successtemplate);
						var successhtml = Mustache.render(successtemplate, {email: result.email});
						$('#forgotpasswordsection').html(successhtml);

						$("#formforgotpassword button:submit").button('reset');
					},
					error: function(xhr, msg, error){
						$("#formforgotpassword button:submit").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });
	}

	var initResetPassword = function (cb) {
		$('#formresetpassword').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#formresetpassword button:submit").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/doresetpassword",
					data: data,
					success: function( result ) {
						var successtemplate = $('#successtemplate').html();
						Mustache.parse(successtemplate);
						var successhtml = Mustache.render(successtemplate, {email: result.email});
						$('#resetpasswordsection').html(successhtml);

						$("#formresetpassword button:submit").button('reset');
					},
					error: function(xhr, msg, error){
						$("#formresetpassword button:submit").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });
	}

	var initMyReviews = function (cb) {
		$('#newrating').ratinginput();
		$('#editrating').ratinginput();

		$('#review_item_id').imagepicker({
			show_label: true,
			hide_select : false,
		});

		$('.btneditreview').on('click', function (ev) {
	    	var id = $(ev.currentTarget).attr('data-pk');
	    	var rating = $(ev.currentTarget).attr('data-rating');
	    	var comment = $(ev.currentTarget).attr('data-comment');
	    	$('#editreviewid').val(id);
	    	$('#editreviewcomment').val(comment);

	    	rating = parseInt(rating);
	    	$('#formeditreview').find('.rating-input > [data-value="' + rating + '"]').trigger('mouseenter');
			$('#formeditreview').find('.rating-input > [data-value="' + rating + '"]').trigger('click');
	    });

		$( "#btnsubmitreview").click(function() {
		  $( "#formreview").submit();
		});

		$( "#btnupdatereview").click(function() {
		  $( "#formeditreview").submit();
		});

		$('#formreview').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#btnsubmitreview").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/addreview",
					data: data,
					success: function( result ) {
						document.location.href = '';
					},
					error: function(xhr, msg, error){
						$("#btnsubmitreview").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });

	    $('#formeditreview').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#btnupdatereview").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/updatereview",
					data: data,
					success: function( result ) {
						document.location.href = '';
					},
					error: function(xhr, msg, error){
						$("#btnupdatereview").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });
	}

	var initContactUs = function (cb){

		$('#formcontactus').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;
	        var data = $(ev.currentTarget).serialize();

	        if ( data ) {
				$("#formcontactus button:submit").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "contact-us/send",
					data: data,
					success: function( result ) {

						var successtemplate = $('#successtemplate').html();
						Mustache.parse(successtemplate);
						var successhtml = Mustache.render(successtemplate);
						$('#contactussection').html(successhtml);

						$("#formcontactus button:submit").button('reset');
					},
					error: function(xhr, msg, error){
						$("#formcontactus button:submit").button('reset');

						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});
					}
				});
			}

	    });

	}


	var initOrderWithoutAccount= function(cb) {

		$('#payment_date').datepicker({
			format: "dd-M-yyyy",
			endDate: '0d',
			autoclose:true
		});

		$('#formbankreceipt').submit(function(ev) {
	        if(ev.preventDefault) ev.preventDefault();
	    	if (ev.stopPropagation) ev.stopPropagation();
	        if (!$(ev.currentTarget).parsley().validate()) return;

	        var data = $(ev.currentTarget).serialize();
	        if ( data ) {
				$("#btnupdatebankreceipt").button('loading');
				$.ajax({
					type: "POST",
					url: cb.base_url + "account/order/updatebankreceiptwithoutaccount",
					data: data,
					success: function( result ) {
						var successtemplate = $('#successtemplate').html();
						Mustache.parse(successtemplate);
						var successhtml = Mustache.render(successtemplate, {order_no: result.order_no});
						$('#updateordersection').html(successhtml);
						$("#btnupdatebankreceipt").button('reset');
					},
					error: function(xhr, msg, error){
						$("#btnupdatebankreceipt").button('reset');
						if (xhr.responseJSON)
							bootbox.alert(xhr.responseJSON, function() {});
						else
							bootbox.alert(error, function() {});					}
				});
			}

	    });

	}
    return {
    	InitBase: initBase,
    	InitProduct: initProduct,
    	InitCart: initCart,
    	InitCheckout: initCheckout,
    	InitOrder: initOrder,
    	InitPayment: initPayment,
    	InitCombo: initCombo,
    	InitDeals: initDeals,
    	InitDeal: initDeal,
    	InitProfile: initProfile,
    	InitSignin: initSignin,
    	InitForgotPassword: initForgotPassword,
    	InitChangePassword: initChangePassword,
    	InitResetPassword: initResetPassword,
    	InitMyReviews: initMyReviews,
    	InitContactUs: initContactUs,
    	initOrderWithoutAccount: initOrderWithoutAccount
    };
})();

$(document).ready(function() {
	var cb = new CartindoApp.Actions();
	cb.InitBase(cb);

});
