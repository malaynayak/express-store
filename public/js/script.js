;(function($){
	'use strict';
	var DH = {
		init: function(){
			
			// Tooltip
			$('[data-toggle="popover"]').popover();
			$('[data-toggle="tooltip"]').tooltip();
			
			
			var self = this;
			var stickySize = 70;
			
			if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
				$(document.documentElement).addClass('dh-ie');
			}else{
				$(document.documentElement).addClass('dh-no-ie');
			}
			$(document.documentElement).addClass(self.enableAnimation() ? 'dh-enable-animation':'dh-disable-animation');
			
			//Navbar collapse
			$('.primary-navbar-collapse').on('hide.bs.collapse', function () {
				  $(this).closest('.header-container').find('.navbar-toggle').removeClass('x');
			});
			$('.primary-navbar-collapse').on('show.bs.collapse', function () {
				$(this).closest('.header-container').find('.navbar-toggle').addClass('x');
				 
			});
			
			//Fixed Main Nav
			if(this.enableAnimation()){
				var $window = $( window );
				var $body   = $( 'body' ) ;
				
				var navTop = $('.header-container').hasClass('header-fixed') ? ( $('.topbar').length ? $('.topbar').height() : 0 ) :  $( '.navbar' ).offset().top;
				
				var navScrollListener = function($this,isResize){
					var $navbar = $( '.navbar' );
					if($('.header-container').hasClass('header-absolute') && self.getViewport().width > 900){
						$('.header-container').css({'top': 0 + 'px'});
					}else{
						$('.header-container').css({'top': ''});
					}
					
					if(($('.header-container').hasClass('header-fixed') || $navbar.hasClass('navbar-scroll-fixed')) && self.getViewport().width > 900){
						
						var scrollTop = parseInt($this.scrollTop(), 10),
							navHeight = 0,
							topbarOffset = 0;
						
						if($('.header-container').hasClass('header-fixed')){
							$('.header-container').css({'top': 0 + 'px'});
							if($('.topbar').length ){
								
								if(scrollTop > 0){
									if(scrollTop < $('.topbar').height()){
										topbarOffset = - scrollTop;
										$('.header-container').css({'top': topbarOffset + 'px'});
									}else{
										$('.header-container').css({'top': - $('.topbar').height() + 'px'});
									}
								}else{
									$('.header-container').css({'top': 0 + 'px'});
								}
							}
						}
						var navTopScroll = navTop;
						if($('.header-container').hasClass('header-fixed') || $('.header-container').hasClass('header-absolute'))
							navTopScroll += 0;
						
						if(($this.scrollTop() + 0 ) > (navTopScroll + 50)){
							if(!$('.navbar-default').hasClass('navbar-fixed-top')){
								$('.navbar-default').addClass('navbar-fixed-top');
								//
								$('.header-container').addClass('header-navbar-fixed');
								setTimeout(function() {
				                    $('.navbar-default').addClass("fixed-transition")
				                }, 50);
								$navbar.css({'top': 0 + 'px'});
								$('.minicart').stop(true,true).fadeOut();
							}
							
						}else{
							if($('.navbar-default').hasClass('navbar-fixed-top')){
								$('.navbar-default').removeClass('navbar-fixed-top');
								$('.navbar-default').removeClass('fixed-transition');
								$('.header-container').removeClass('header-navbar-fixed');
							}
							$navbar.css({'top': ''});
							$('.minicart').stop(true,true).fadeOut();
						}
					}else{
						if($('.navbar-default').hasClass('navbar-fixed-top')){
							$('.navbar-default').removeClass('navbar-fixed-top');
							$('.navbar-default').removeClass('fixed-transition');
							$('.header-container').removeClass('header-navbar-fixed');
						}
						$navbar.css({'top': ''});
						$('.minicart').stop(true,true).fadeOut();
					}
				}
				
				navScrollListener( $window );
				$window.resize(function(){
					navScrollListener( $(this),true );
				});
				$window.scroll( function () {
					var $this = $(this);
					navScrollListener($this,false);
				});
			}
			
			//Off Canvas menu
			$('.navbar-toggle').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				if($('body').hasClass('open-offcanvas')){
					$('body').removeClass('open-offcanvas').addClass('close-offcanvas');
					$('.navbar-toggle').removeClass('x');
				}else{
					$('body').removeClass('close-offcanvas').addClass('open-offcanvas');
					$('.navbar-toggle').addClass('x');
				}
				
			});
			$('body').on('mousedown', $.proxy( function(e){
				var element = $(e.target);
				if($('.offcanvas').length && $('body').hasClass('open-offcanvas')){
					if(!element.is('.offcanvas') && element.parents('.offcanvas').length === 0 && !element.is('.navbar-toggle') && element.parents('.navbar-toggle').length === 0 )
					{
						$('body').removeClass('open-offcanvas');
						$('.navbar-toggle').removeClass('x');
					}
				}
			}, this) );
			
			$('.offcanvas-nav .dropdown-hover .caret,.offcanvas-nav .dropdown-submenu > a > .caret,.offcanvas-nav .megamenu-title .caret').off('click').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				var dropdown = $(this).closest(".dropdown, .dropdown-submenu");
				if (dropdown.hasClass("open")) {
					dropdown.removeClass("open");
				} else {
					dropdown.addClass("open");
				}
			});
			
			//go-to-top
			$('body').on( 'click', '.go-to-top', function () {
				$("html, body").animate({
					scrollTop: 0
				}, 800);
				return false;
			});
			
			//Refresh Carousel when clicking tabs
			$("ul.tta-tabs-list li").on( 'click', function () {
				var id = $(this).children('a').attr('href');
				var parent = $(this).parents('.tta-tabs-container');
				parent.find('.tab-pane').hide();
				$(id).show();
				$(id).find('.caroufredsel ul').trigger('updateSizes');
			});
			
			//Init Countdown timer
			if($('.product-sale-date').length > 0) {
				$('[data-toggle="countdown"]').each(function(){
					var _this = $(this);
					_this.find('.countdown-content').countdown(_this.data('end'), function(event) {
						$(this).html(event.strftime(_this.data('html')));
					});
				});
			}
			
			//DH Slider
			this.dhSliderInit();

			
			//Nav Dropdown
			this.navDropdown();
			$(window).resize(function(){
				self.navDropdown();
			})
			//Heading Parallax
			this.headingInit();
			
			//PopUp
			this.magnificpopupInit();
			
			//Carousel
			this.carouselInit();
			
			//Responsive embed iframe
			this.responsiveEmbedIframe();
			$(window).resize(function(){
				self.responsiveEmbedIframe();
			});
			//Woocommerce
			this.commerceInit();
			
			//isotope
			this.isotopeInit();
			$(window).resize(function(){
				self.isotopeInit();
			});
			
			//Ajax Search
			this.ajaxSearchInit();
			
			//User Login and register account.
			this.userInit();
			
			//Short code
			this.shortcodeInit();
			
			//Parallax code
			this.parallaxInit();
		},
		parallaxInit: function(){
			function localFunction() {
				var $elements = $( '[data-full-width="true"]' );
				$.each( $elements, function ( key, item ) {
					var $el = $( this );
					$el.addClass( 'hidden' );
	
					var $el_full = $el.next( '.row-full-width' );
					var el_margin_left = parseInt( $el.css( 'margin-left' ), 10 );
					var el_margin_right = parseInt( $el.css( 'margin-right' ), 10 );
					var offset = 0 - $el_full.offset().left - el_margin_left;
					var width = $( window ).width();
					$el.css( {
						'position': 'relative',
						'left': offset,
						'box-sizing': 'border-box',
						'width': $( window ).width()
					} );
					if ( ! $el.data( 'StretchContent' ) ) {
						var padding = (- 1 * offset);
						if ( 0 > padding ) {
							padding = 0;
						}
						var paddingRight = width - padding - $el_full.width() + el_margin_left + el_margin_right;
						if ( 0 > paddingRight ) {
							paddingRight = 0;
						}
						$el.css( { 'padding-left': padding + 'px', 'padding-right': paddingRight + 'px' } );
					}
					$el.attr( "data-full-width-init", "true" );
					$el.removeClass( 'hidden' );
				} );
			}
	
			/**
			 * @todo refactor as plugin.
			 * @returns {*}
			 */
			function parallaxRow() {
				var SkrollrOptions, ParallaxSkroll,
					callSkrollInit = false;
				if ( ParallaxSkroll ) {
					ParallaxSkroll.destroy();
				}
				$( '.parallax-inner' ).remove();
				$( '[data-5p-top-bottom]' ).removeAttr( 'data-5p-top-bottom data-30p-top-bottom' );
				$( '[data-parallax]' ).each( function () {
					var skrollrSpeed,
						skrollrSize,
						skrollrStart,
						skrollrEnd,
						$parallaxElement,
						parallaxImage,
						youtubeId;
					callSkrollInit = true; // Enable skrollinit;
					if ( 'on' === $( this ).data( 'parallaxOFade' ) ) {
						$( this ).children().attr( 'data-5p-top-bottom', 'opacity:0;' ).attr( 'data-30p-top-bottom',
							'opacity:1;' );
					}
	
					skrollrSize = $( this ).data( 'parallax' ) * 100;
					$parallaxElement = $( '<div />' ).addClass( 'parallax-inner' ).appendTo( $( this ) );
					$parallaxElement.height( skrollrSize + '%' );
	
					parallaxImage = $( this ).data( 'parallaxImage' );
	
					$parallaxElement.css( 'background-image', 'url(' + parallaxImage + ')' );
	
					skrollrSpeed = skrollrSize - 100;
					skrollrStart = - skrollrSpeed;
					skrollrEnd = 0;
	
					$parallaxElement.attr( 'data-bottom-top', 'top: ' + skrollrStart + '%;' ).attr( 'data-top-bottom',
						'top: ' + skrollrEnd + '%;' );
				} );
	
				if ( callSkrollInit && window.skrollr ) {
					SkrollrOptions = {
						forceHeight: false,
						smoothScrolling: false,
						mobileCheck: function () {
							return false;
						}
					};
					ParallaxSkroll = skrollr.init( SkrollrOptions );
					return ParallaxSkroll;
				}
				return false;
			}
	
			/**
			 * @todo refactor as plugin.
			 * @returns {*}
			 */
			function fullHeightRow() {
				$( '.row-o-full-height:first' ).each( function () {
					var $window,
						windowHeight,
						offsetTop,
						fullHeight;
					$window = $( window );
					windowHeight = $window.height();
					offsetTop = $( this ).offset().top;
					if ( offsetTop < windowHeight ) {
						fullHeight = 100 - offsetTop / (windowHeight / 100);
						$( this ).css( 'min-height', fullHeight + 'vh' );
					}
				} );
	
				$( '.row-o-full-height.row-o-content-middle' ).each( function () {
					var elHeight = $( this ).height();
					$( '<div><!-- IE flexbox min height vertical align fixer --></div>' )
						.addClass( 'row-full-height-fixer' )
						.height( elHeight )
						.prependTo( $( this ) );
				} );
			}
	
			$( window ).unbind( 'resize.RowBehaviour' ).bind( 'resize.RowBehaviour', localFunction );
			$( window ).bind( 'resize.RowBehaviour', fullHeightRow );
			localFunction();
			fullHeightRow();
			//initVideoBackgrounds(); // must be called before parallax
			parallaxRow();
		},
		shortcodeInit: function(){
			$('.btn.btn-custom-color').each(function(){
				var $this = $(this);
				//hover background color
				if(typeof $this.data('hover-background-color') !== 'undefined' && $this.data('hover-background-color') !== false && $this.data('hover-background-color') != '') {
	                var hover_background_color = $this.data('hover-background-color');
	                var initial_background_color = $this.css('background-color');
	                $this.on("hover", function(e) {
						if (e.type == "mouseenter") {
							$this.css('background-color', hover_background_color);
						}
						else {
							$this.css('background-color', initial_background_color);
						}
					});
	            }
				//hover border color
				if(typeof $this.data('hover-border-color') !== 'undefined' && $this.data('hover-border-color') !== false && $this.data('hover-border-color') != '') {
	                var hover_border_color = $this.data('hover-border-color');
	                var initial_border_color = $this.css('border-top-color');
	                $this.on("hover", function(e) {
						if (e.type == "mouseenter") {
							$this.css('border-color', hover_border_color);
						}
						else {
							$this.css('border-color', initial_border_color);
						}
					});
	            }
				//hover color
				if(typeof $this.data('hover-color') !== 'undefined' && $this.data('hover-color') !== false && $this.data('hover-color') != '') {
	                var hover_color = $this.data('hover-color');
	                var initial_color = $this.css('color');
	                $this.on("hover", function(e) {
						if (e.type == "mouseenter") {
							 $this.css('color', hover_color);
						}
						else {
							$this.css('color', initial_color);
						}
					});
	            }
			});
		},
		userInit: function(){
			//User Nav
			$(document).on("mouseenter", ".navuser-nav", function() {
				window.clearTimeout($(this).data('timeout'));
				$('.navuser-dropdown').fadeIn(50);
			});
			$(document).on("mouseleave", ".navuser-nav", function() {
					var t = setTimeout(function() {
						$('.navuser-dropdown').fadeOut(50);
					}, 400);
					$(this).data('timeout', t);
			});
			
			$(document).on('click','[data-rel=registerModal]',function(e){
				e.stopPropagation();
				e.preventDefault();
				if($('#userloginModal').length){
					$('#userloginModal').modal('hide');
				}
				if($('#userlostpasswordModal').length){
					$('#userlostpasswordModal').modal('hide');
				}
				if($('#userregisterModal').length){
					$('#userregisterModal').modal('show');
				}
			});
			$(document).on('click','[data-rel=loginModal]',function(e){
				e.stopPropagation();
				e.preventDefault();
				if($('#userregisterModal').length){
					$('#userregisterModal').modal('hide');
				}
				if($('#userlostpasswordModal').length){
					$('#userlostpasswordModal').modal('hide');
				}
				if($('#userloginModal').length){
					$('#userloginModal').modal('show');
				}
			});
			$(document).on('click','[data-rel=lostpasswordModal]',function(e){
				e.stopPropagation();
				e.preventDefault();
				if($('#userregisterModal').length){
					$('#userregisterModal').modal('hide');
				}
				if($('#userloginModal').length){
					$('#userloginModal').modal('hide');
				}
				if($('#userlostpasswordModal').length){
					$('#userlostpasswordModal').modal('show');
				}
			});
			$(document).on('click','[data-rel=quickViewModal]',function(e){
				e.stopPropagation();
				e.preventDefault();
				if($('.modal.product-quickview').length){
					$('.modal.product-quickview').modal('show');
				}
			});
		},
		ajaxSearchInit: function(){
			
			$(document).on('click','.navbar-search-button',function(e){
				e.stopPropagation();
				e.preventDefault();
				console.log('as');
				if($('.header-search-overlay').length){
					$('.header-search-overlay').stop(true,true).removeClass('hide').css('opacity',0).animate({'opacity' :1},600,'easeOutExpo',function(){
						$(this).find('.searchinput').focus();
					});
				}else if($('.search-form-wrap').length){
					if ($('.search-form-wrap').hasClass('hide'))
					{
						$('.search-form-wrap').removeClass('hide').addClass('show');
						$('.search-form-wrap .searchinput').focus();
					}
				}
				
			});
			
			$(document).on('click','.header-search-overlay .close',function(){
				$('.header-search-overlay').stop(true,true).animate({'opacity' :0},600,'easeOutExpo',function(){
					$(this).addClass('hide');
				});
			});
		},
		carouselInit: function(){
			var self = this;
			//related post carousel
			$('.caroufredsel').each(function(){
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
		},
		responsiveEmbedIframe: function(){
			$('iframe:visible').each(function(){
				if(typeof $(this).attr('src') != 'undefined'){
					
					if( $(this).attr('src').toLowerCase().indexOf("youtube") >= 0 || $(this).attr('src').toLowerCase().indexOf("vimeo") >= 0  || $(this).attr('src').toLowerCase().indexOf("twitch.tv") >= 0 || $(this).attr('src').toLowerCase().indexOf("kickstarter") >= 0 || $(this).attr('src').toLowerCase().indexOf("dailymotion") >= 0) {
						$(this).attr('data-aspectRatio', this.height / this.width).removeAttr('height').removeAttr('width');
						if($(this).attr('src').indexOf('wmode=transparent') == -1) {
							if($(this).attr('src').indexOf('?') == -1){
								$(this).attr('src',$(this).attr('src') + '?wmode=transparent');
							} else {
								$(this).attr('src',$(this).attr('src') + '&wmode=transparent');
							}
						}
					}
				} 
			});
			$('iframe[data-aspectRatio]').each(function() {
			 	var newWidth = $(this).parent().width();
				var $this = $(this);
				$this.width(newWidth).height(newWidth * $this.attr('data-aspectRatio'));
				
		   });
		},
		isotopeInit: function(){
			var self = this;
			$('[data-layout="masonry"]').each(function(){
				var $this = $(this),
					container = $this.find('.masonry-wrap'),
					itemColumn = $this.data('masonry-column'),
					itemWidth,
					container_width = container.width();
					if(self.getViewport().width > 992){
						itemWidth = container_width / itemColumn;
					}else if(self.getViewport().width <= 992 && self.getViewport().width >= 768){
						itemWidth = container_width / 2;
					}else {
						itemWidth = container_width / 1;
					}
					container.isotope({
						layoutMode: 'masonry',
						itemSelector: '.masonry-item',
						transitionDuration : '0.8s',
						getSortData : { 
							title : function (el) { 
								return $(el).data('title');
							}, 
							date : function (el) { 
								return parseInt($(el).data('date'), 10);
							} 
						},
						masonry : {
							gutter : 0,
							columnWidth: itemWidth
						}
					}).isotope( 'layout' );
					
					imagesLoaded($this,function(){
						container.isotope( 'layout' );
					});
				
				var filter = $this.find('.masonry-filter ul a');
				filter.on("click",function(e){
					e.stopPropagation();
					e.preventDefault();
					
					var $this = jQuery(this);
					// don't proceed if already selected
					if ($this.hasClass('selected')) {
						return false;
					}
					
					var filters = $this.closest('ul');
					filters.find('.selected').removeClass('selected');
					$this.addClass('selected');
					$this.closest('.masonry-filter').find('.filter-heaeding h3').text($this.text());
					var options = {
						layoutMode : 'masonry',
						transitionDuration : '0.8s',
						getSortData : { 
							title : function (el) { 
								return $(el).data('title');
							}, 
							date : function (el) { 
								return parseInt($(el).data('date'), 10);
							} 
						}
					}, 
					key = filters.attr('data-filter-key'), 
					value = $this.attr('data-filter-value');
		
					value = value === 'false' ? false : value;
					options[key] = value;
					container.isotope(options);
					var wrap = $this.closest('[data-layout="masonry"]');
				});
				$this.find('.filter-btn').on("click",function(e){
					e.stopPropagation();
					e.preventDefault();
					if ($(this).hasClass('current')) {
						$(this).removeClass('current');
						$(this).closest('.filter-action').find('ul li').hide('slow');
					} else {
						$(this).addClass('current');
						$(this).closest('.filter-action').find('ul li').show('slow');
					}
				});
			});
			
		},
		commerceInit: function(){
			var self = this;
			this.added_to_cart_timeout;
			$('.product-container .product-images .add_to_wishlist,.product-container .product-images .yith-wcwl-wishlistexistsbrowse a,.product-container .product-images .yith-wcwl-wishlistaddedbrowse a').each(function(){
				var $this = $(this);
				if($this.hasClass('add_to_wishlist'))
					$this.tooltip({title:"Add to wishlist",html: true,container:$('body'),placement:'top'});
				else
					$this.tooltip({title:$this.text(),html: true,container:$('body'),placement:'top'});
			});
			$('.shop-toolbar .view-mode a').on('click',function(e){
				e.preventDefault();
				e.stopPropagation();
				$(this).parent().find('.active').removeClass('active');
				$(this).addClass('active');
				if($(this).hasClass('list-mode')){
					$('.shop-loop').addClass('list');
				}else{
					$('.shop-loop').removeClass('list');
				}
			});
			
			$('.shop-loop-quickview a').tooltip({title:"Quick view", html: true,container:$('body'),placement:'top'});
			$('body').on('added_to_cart',function(){
				//$('.minicart').fadeIn(500);
				if($('.navbar-default').hasClass('navbar-fixed-top')){
					$('.navbar-minicart-nav .minicart').fadeIn(500);
				}else{
					$('.navbar-minicart-topbar .minicart').fadeIn(500);
				}
				window.clearTimeout(self.added_to_cart_timeout);
				self.added_to_cart_timeout = window.setTimeout(function(){
					if($('.navbar-default').hasClass('navbar-fixed-top')){
						$('.minicart').stop(true,true).fadeOut(500);
					}else{
						$('.minicart').stop(true,true).fadeOut(500);
					}
				},5000);
			});
			
			var variations_form = function(){
				var variations_form = $('.variations_form');
				variations_form.on('reset_image',function(event){
					$(this).closest('.product').find('.product-images-slider').find('ul').trigger('slideTo',0);
				}).on('found_variation',function(event, variation){
					var variation_image = variation.image_src,
						  variation_link  = variation.image_link,
						  variation_title = variation.image_title,
						  variation_alt = variation.image_alt;
					var o_a = $(this).closest('.product').find('.product-thumbnails-slider .thumb a[title="' + variation_title + '"]').get(0);
					$(o_a).trigger('click');
				});
			};
			variations_form();
			var swatch_variation_init = function(form){
				//Stores the attribute + values that are currently available
				var variations_current = {},
					variations_selected = {},
					recalc = true;
				
				var set_selected = function(key, value) {
					recalc = true;
					variations_selected[ key ] = value;
				};

				var get_selected = function() {
					variations_selected;
				}
				var reset_current = function(){
					
				}
				var update_current = function(){
					reset_current();
				};
				
				var get_current = function() {
					if (recalc) {
						update_current();
					}

					return variations_current;
				};
				
				$(form).on('click', '.swatch-select', function(e) {
					e.preventDefault();
					var _this = $(this);

					if (_this.hasClass('disabled')) {
						return false;
					} else if (_this.hasClass('selected')) {
						_this.removeClass('selected');
						var wrap = _this.closest('.swatch-select-wrap');
						wrap.data('value', '');
						wrap.trigger('change', []);
					}else{
						var wrap = $(this).closest('.swatch-select-wrap');
						$(wrap).find('.swatch-select').removeClass('selected');
						_this.addClass('selected');
						
						var value = _this.data('value');
						wrap.data('value', value );
						
						wrap.trigger('change', []);
					}
					return false;
				}).on('change','.swatch-select-wrap',function(){
					$variation_form = $( this ).closest( '.variations_form' );
					$variation_form.trigger('commerce_variation_select_change');
		
					var table = $(this).closest('.variations-table');
					$('select', table).each(function(index, element) {
						var optval = $(element).val();
		
						optval = optval.replace("'", "&#039;");
						optval = optval.replace('"', "&quot;");
		
						set_selected($(element).data('attribute-name'), optval);
					});
		
					$('.swatch-select-wrap', table).each(function(index, element) {
						var optval = $(element).data('value');
						set_selected( $(element).data('attribute-name'), optval);
					});
		
					var current = calculator.get_current();
					$('select', $parent).each(function(index, element) {
						var attribute_name = $(element).data('attribute-name');
						var avaiable_options = current_options[attribute_name];
		
						$(element).find('option:gt(0)').each(function(index, option) {
							var optval = $(option).val();
		
							optval = optval.replace("'", "&#039;");
							optval = optval.replace('"', "&quot;");
		
							if (!avaiable_options[ optval ]) {
								$(option).attr('disabled', 'disabled');
							} else {
								$(option).removeAttr('disabled');
							}
						});
					});
		
					$('div.select', $parent).each(function(index, element) {
						var attribute_name = $(element).data('attribute-name');
						var avaiable_options = current_options[attribute_name];
		
						$(element).find('div.select-option').each(function(index, option) {
							if (!avaiable_options[ $(option).data('value') ]) {
								$(option).addClass('disabled', 'disabled');
							} else {
								$(option).removeClass('disabled');
							}
						});
					});
		
					calculator.trigger_callbacks();
				});
			}
			
			//Shop mini cart
			$(document).on("mouseenter", ".navbar-minicart-nav", function() {
				window.clearTimeout($(this).data('timeout'));
				$(this).parent().find('.navbar-minicart .minicart').fadeIn(50);
			});
			$(document).on("mouseleave", ".navbar-minicart-nav", function() {
					var _this = $(this);
					var t = setTimeout(function() {
						_this.parent().find('.navbar-minicart .minicart').fadeOut(50);
					}, 400);
					$(this).data('timeout', t);
			});
			$(document).on("mouseenter", ".navbar-minicart-topbar", function() {
				window.clearTimeout($(this).data('timeout'));
				$(this).parent().find('.navbar-minicart .minicart').fadeIn(50);
			});
			$(document).on("mouseleave", ".navbar-minicart-topbar", function() {
					var _this = $(this);
					var t = setTimeout(function() {
						_this.parent().find('.navbar-minicart .minicart').fadeOut(50);
					}, 400);
					$(this).data('timeout', t);
			});
		},
		magnificpopupInit: function(){
			if($().magnificPopup){
				$("a[data-rel='magnific-popup']").magnificPopup({
					type: 'image',
					mainClass: 'dh-mfp-popup',
					gallery:{
						enabled: true
					}
				});
				$("a[data-rel='magnific-popup-verticalfit']").magnificPopup({
					type: 'image',
					mainClass: 'dh-mfp-popup',
					overflowY: 'scroll',
					fixedContentPos: true,
					image: {
						verticalFit: false
					},
					gallery:{
						enabled: true
					}
				});
				$("a[data-rel='magnific-single-popup']").magnificPopup({
					type: 'image',
					mainClass: 'dh-mfp-popup',
					gallery:{
						enabled: false
					}
				});
			}
		},
		navDropdown: function(){
			var _self = this;
			var superfishInit = function(){
				if(_self.getViewport().width > 900){
					$('.topbar-nav').superfish({
						anchorClass: '.dropdown',      // selector within menu context to define the submenu element to be revealed
					    hoverClass:    'open',          // the class applied to hovered list items
					    pathClass:     'overideThisToUse', // the class you have applied to list items that lead to the current page
					    pathLevels:    1,                  // the number of levels of submenus that remain open or are restored using pathClass
					    delay:         650,                // the delay in milliseconds that the mouse can remain outside a submenu without it closing
					    animation:     {opacity:'show'},   // an object equivalent to first parameter of jQuery’s .animate() method. Used to animate the submenu open
					    animationOut:  {opacity:'hide'},   // an object equivalent to first parameter of jQuery’s .animate() method Used to animate the submenu closed
					    speed:         'fast',           // speed of the opening animation. Equivalent to second parameter of jQuery’s .animate() method
					    speedOut:      'fast',             // speed of the closing animation. Equivalent to second parameter of jQuery’s .animate() method
					    cssArrows:     true,               // set to false if you want to remove the CSS-based arrow triangles
					    disableHI:     false,              // set to true to disable hoverIntent detection
					});
					$('.primary-nav').superfish({
						anchorClass: '.dropdown',      // selector within menu context to define the submenu element to be revealed
					    hoverClass:    'open',          // the class applied to hovered list items
					    pathClass:     'overideThisToUse', // the class you have applied to list items that lead to the current page
					    pathLevels:    1,                  // the number of levels of submenus that remain open or are restored using pathClass
					    delay:         650,                // the delay in milliseconds that the mouse can remain outside a submenu without it closing
					    animation:     {opacity:'show'},   // an object equivalent to first parameter of jQuery’s .animate() method. Used to animate the submenu open
					    animationOut:  {opacity:'hide'},   // an object equivalent to first parameter of jQuery’s .animate() method Used to animate the submenu closed
					    speed:         'fast',           // speed of the opening animation. Equivalent to second parameter of jQuery’s .animate() method
					    speedOut:      'fast',             // speed of the closing animation. Equivalent to second parameter of jQuery’s .animate() method
					    cssArrows:     true,               // set to false if you want to remove the CSS-based arrow triangles
					    disableHI:     false,              // set to true to disable hoverIntent detection
					 });
				}else{
					$('.primary-nav').superfish('destroy');  // yup
				}
			}
			superfishInit();
			$(window).on('resize',function(){
				superfishInit();
			});
			
			$('.primary-nav .dropdown-hover .caret,.primary-nav .dropdown-submenu > a > .caret,.primary-nav .megamenu-title .caret').off('click').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				var dropdown = $(this).closest(".dropdown, .dropdown-submenu");
				if (dropdown.hasClass("open")) {
					dropdown.removeClass("open");
				} else {
					dropdown.addClass("open");
				}
			});
		},
		headingInit: function(){
			if(this.enableAnimation()){
				if($('.heading-parallax').length){
					$('.heading-parallax').parallax('50%', .5, true,'translate');
				}
			}
		},
		dhSliderInit: function(){
			var self = this;
			$('.dhslider').each(function(){
				var $this = $(this),
					isIOS = /iPhone|iPad|iPod/.test( navigator.userAgent ),
					or_height = $this.height(),
					min_height = 250,
					startwidth = $this.width(),
					startheight = $this.data('height');
				
				
				var dynamicHeight = function(){
					var slider_height = startheight,
						slider_width = startwidth;
					
					if(!$this.hasClass('dhslider-fullscreen')){
						if($this.width() > self.getViewport().width){
							$this.css('width','100%');
						}
					}
					
					if($this.hasClass('dhslider-fullscreen') && self.getViewport().width > 900){
						slider_width = self.getViewport().width;
						slider_height = self.getViewport().height;
					}else{
						var scale_slider = $(window).width() / 1600;
						//min height
						if( self.getViewport().width <= 900 ){
							if( startheight*scale_slider <= min_height ){
								slider_height = min_height;
							} else {
								slider_height = Math.round(startheight*scale_slider);
							}
						}
					}
					
					var heading_height = 0;
					
					if($('body').find('.header-container').hasClass('header-transparent') && self.getViewport().width > 900){
						heading_height = $('body').find('.header-container').height();
					}
					$this.css({'height': slider_height + 'px'});
					//$this.find('.dhslider-wrap').css({'height': slider_height + 'px'});
					$this.find('.item').css({'height': slider_height + 'px'});
					
					var slider_width = $this.width(),
						slider_height = $this.height(),
						scale_h = slider_width / 1280,
						scale_v = (slider_height - $('.header-container').height()) / 720,
						scale = scale_h > scale_v ? scale_h : scale_v,
						min_w = 1280/720 * (slider_height+20);
				
					if (scale * 1280 < min_w) {
						scale = min_w / 1280;
					}
					$this.find('.video-embed-wrap').css('width',($this.width()+2)).css('height',($this.height()+2));
					$this.find('.slider-video').width(Math.ceil(scale * 1280 +2));
					$this.find('.slider-video').height(Math.ceil(scale * 720 +2));
					
					var active_cation = $this.find('.active .slider-caption');
					
					$this.find('.slider-caption').each(function(){
						$(this).css('top', (((slider_height + heading_height)/2) - ($(this).height()/2)) + 'px');
					});
				}
				
				dynamicHeight();
				$(window).resize(function(){
					dynamicHeight();
				});
				if($this.data('autorun') == 'yes'){
					$this.carousel({
						interval: parseInt($this.data('duration'), 10),
						pause: false
					});
				}else{
					$this.carousel({
						interval: 0,
						pause: false
					});
				}
				
				$this.on('slide.bs.carousel', function () {
					$this.find('.active .slider-caption').fadeTo(800,0);
				});
				$this.on('slid.bs.carousel', function () {
					$this.find('.active .slider-caption').fadeTo(0,1);
				});
				
				imagesLoaded($this,function(){
					$this.find('.dhslider-loader').fadeOut(500);
				});
				if(self.enableAnimation()){
					$this.find('.slider-caption').parallax('50%', .3, true,'translate',$this);
				}
				
			});
		},
		getURLParameters: function(url) {
		    var result = {};
		    var searchIndex = url.indexOf("?");
		    if (searchIndex == -1 ) return result;
		    var sPageURL = url.substring(searchIndex +1);
		    var sURLVariables = sPageURL.split('&');
		    for (var i = 0; i < sURLVariables.length; i++)
		    {       
		        var sParameterName = sURLVariables[i].split('=');      
		        result[sParameterName[0]] = sParameterName[1];
		    }
		    return result;
		},
		getViewport: function() {
		    var e = window, a = 'inner';
		    if (!('innerWidth' in window )) {
		        a = 'client';
		        e = document.documentElement || document.body;
		    }
		    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
		},
		hex2rgba: function(hex,opacity){
			hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
			var rgb = {
				r: hex >> 16,
				g: (hex & 0x00FF00) >> 8,
				b: (hex & 0x0000FF)
			};
			if( !rgb ) return null;
			if( opacity === undefined ) opacity = 1;
			return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + parseFloat(opacity) + ')';
		},
		enableAnimation: function(){
			return this.getViewport().width > 992 && !this.isTouch();
		},
		isTouch: function(){
			return !!('ontouchstart' in window) || ( !! ('onmsgesturechange' in window) && !! window.navigator.maxTouchPoints);
		}
	};
	$(document).ready(function(){
		DH.init();
	});
})(jQuery);
