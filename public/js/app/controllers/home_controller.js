angular.module('App.controllers.Home', [
	'App.services.Product'
])

.controller('HomeController', ["$rootScope", "$scope", "$location", "ProductService",
	function($rootScope, $scope, $location, ProductService){
		initiateSlider();
		$scope.featuredProducts = [];
		ProductService.getFeaturedProducts().then(function(response){
			$scope.featuredProducts = response.data;
			carouselInit();
		});
}]);

var initiateSlider = function(){
	var element = jQuery('#rev_slider');
	element.show().revolution({	
		delay:9000,
		navigation: {
			keyboardNavigation:"off",
			keyboard_direction: "horizontal",
			mouseScrollNavigation:"off",
			onHoverStop:"off",
			arrows: {
				style:"gyges",
				enable:true,
				hide_onmobile:false,
				hide_onleave:true,
				hide_delay:200,
				hide_delay_mobile:1200,
				tmp:'',
				left: {
					h_align:"left",
					v_align:"center",
					h_offset:20,
					v_offset:0
				},
				right: {
					h_align:"right",
					v_align:"center",
					h_offset:20,
					v_offset:0
				}
			}
			,
			bullets: {
				enable:true,
				hide_onmobile:false,
				style:"custom",
				hide_onleave:false,
				direction:"horizontal",
				h_align:"center",
				v_align:"bottom",
				h_offset:0,
				v_offset:20,
				space:5,
				tmp:''
			}
		},
		gridwidth:1240,
		gridheight:868,
		lazyType:"none",
		minHeight:500,
		shadow:0,
		spinner:"spinner0",
		stopLoop:"off",
		stopAfterLoops:-1,
		stopAtSlide:-1,
		shuffle:"off",
		autoHeight:"off",
		disableProgressBar:"on",
		hideThumbsOnMobile:"off",
		hideSliderAtLimit:0,
		hideCaptionAtLimit:0,
		hideAllCaptionAtLilmit:0,
		debugMode:false,
		fallbacks: {
			simplifyAll:"off",
			nextSlideOnWindowFocus:"off",
			disableFocusListener:false,
		}
	});
}

var carouselInit =  function(){
	var self = this;
	//related post carousel
	jQuery('.caroufredsel').each(function(){
		var $this = $(this),
			$visible = 3,
			$height = 'auto',
			$circular = false,
			$auto_play = false,
			$scroll_fx = 'scroll',
			$duration = 2000,
			$items_height = 'variable',
			$auto_pauseOnHover = 'resume',
			$items_width = '100%',
			$infinite = false,
			$responsive = false,
			$scroll_item = 1,
			$easing = 'swing',
			$scrollDuration = 600,
			$direction = 'left';
		if($this.hasClass('product-slider')){
			$visible = {
				min: $(this).data('visible-min'),
				max: $(this).find('ul.products').data('columns')
			};
		}else{
			if($(this).data('visible-min') && $(this).data('visible-max')){
				$visible = {
					min: $(this).data('visible-min'),
					max: $(this).data('visible-max')
				};
			}
		}
		if($(this).data('visible')){
			$visible = $(this).data('visible');
		}
		if($(this).data('height')){
			$height = $(this).data('height');
		}
		if($(this).data('direction')){$scrollDuration
			$direction = $(this).data('direction');
		}
		if($(this).data('scrollduration')){
			$scrollDuration = $(this).data('scrollduration');
		}
		if ($(this).data("speed") ) {
			$duration = parseInt($(this).data("speed"), 10);
		}
		if ($(this).data("scroll-fx") ) {
			$scroll_fx = $(this).data("scroll-fx");
		}
		if ($(this).data("circular")) {
			$circular = true;
		}
		if ($(this).data("infinite")) {
			$infinite = true;
		}
		if ($(this).data("responsive")) {
			$responsive = true;
		}
		if ($(this).data("autoplay")) {
			$auto_play = true;
		}
		if($(this).data('scroll-item')){
			$scroll_item = parseInt($(this).data('scroll-item'), 10);
		}
		if($(this).data('easing')){
			$easing = $(this).data('easing');
		}
		var carousel = $(this).children('.caroufredsel-wrap').children('ul.caroufredsel-items').length ? $(this).children('.caroufredsel-wrap').children('ul.caroufredsel-items') :  $(this).children('.caroufredsel-wrap').find('ul');
		var carouselOptions = {
			responsive: $responsive,
			circular: $circular,
			infinite:$infinite,
			width: '100%',
			height: $height,
			direction:$direction,
			auto: {
				play : $auto_play,
				pauseOnHover: $auto_pauseOnHover
			},
			swipe: {
				 onMouse: true,
	             onTouch: true
			},
			scroll: {
				duration: $scrollDuration,
				fx: $scroll_fx,
				timeoutDuration: $duration,
				easing: $easing,
				wipe: true
			},
			items: {
				height: $items_height,
				visible: $visible
			}
		};
		//console.log($(this).data('synchronise'))
		if($this.data('synchronise')){
			carouselOptions.synchronise = [$this.data('synchronise'),false];
			var synchronise = $this.data('synchronise');
			$(synchronise).find('li').each(function(i){
				$(this).addClass( 'synchronise-index-'+i );
				$(this).on('click',function(){
					carousel.trigger('slideTo',[i, 0, true]);
					return false;
				});
			});
			carouselOptions.scroll.onBefore = function(){
				$(synchronise).find('.selected').removeClass('selected');
				var pos = $(this).triggerHandler( 'currentPosition' );
				$(synchronise).find('.synchronise-index-' + pos).addClass('selected');
			};
		}
		if($this.children('.caroufredsel-pagination').length){
			carouselOptions.pagination = {container:$this.children('.caroufredsel-pagination')};
		}
		if($(this).children('.caroufredsel-wrap').children('.caroufredsel-prev').length && $(this).children('.caroufredsel-wrap').children('.caroufredsel-next').length){
			carouselOptions.prev = $(this).children('.caroufredsel-wrap').children('.caroufredsel-prev');
			carouselOptions.next = $(this).children('.caroufredsel-wrap').children('.caroufredsel-next');
		}
		carousel.carouFredSel(carouselOptions);
		var $element = $this;
		if($this.find('img').length == 0) $element = $('body');
		
		imagesLoaded($element,function(){
			carousel.trigger('updateSizes').trigger('resize');
		});
		$this.css('opacity','1' );
	});
}