angular.module('App.directives.Custom', [])

.directive('magnificPopup',function(){
	return {
		restrict:"AC",
		link:function($scope, element, attributes){
			$(element).magnificPopup({
				type: 'image',
				mainClass: 'dh-mfp-popup',
				overflowY: 'scroll',
				fixedContentPos: true,
				image: {
					verticalFit: false
				}
			});
		}
	}
}).directive('revSlider',function(){
	return {
		restrict:"AC",
		link:function($scope, element, attributes){
			jQuery(element).show().revolution({	
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
	}
}).directive('caroufredsel',function(){
	return {
		restrict:"C",
		link:function($scope, element, attributes){
			var sliderElement = jQuery(element),
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
			if(sliderElement.hasClass('product-slider')){
				$visible = {
					min: sliderElement.data('visible-min'),
					max: sliderElement.find('ul.products').data('columns')
				};
			}else{
				if(sliderElement.data('visible-min') && sliderElement.data('visible-max')){
					$visible = {
						min: sliderElement.data('visible-min'),
						max: sliderElement.data('visible-max')
					};
				}
			}
			if(sliderElement.data('visible')){
				$visible = sliderElement.data('visible');
			}
			if(sliderElement.data('height')){
				$height = sliderElement.data('height');
			}
			if(sliderElement.data('direction')){$scrollDuration
				$direction = sliderElement.data('direction');
			}
			if(sliderElement.data('scrollduration')){
				$scrollDuration = sliderElement.data('scrollduration');
			}
			if (sliderElement.data("speed") ) {
				$duration = parseInt(sliderElement.data("speed"), 10);
			}
			if (sliderElement.data("scroll-fx") ) {
				$scroll_fx = sliderElement.data("scroll-fx");
			}
			if (sliderElement.data("circular")) {
				$circular = true;
			}
			if (sliderElement.data("infinite")) {
				$infinite = true;
			}
			if (sliderElement.data("responsive")) {
				$responsive = true;
			}
			if (sliderElement.data("autoplay")) {
				$auto_play = true;
			}
			if(sliderElement.data('scroll-item')){
				$scroll_item = parseInt(sliderElement.data('scroll-item'), 10);
			}
			if(sliderElement.data('easing')){
				$easing = sliderElement.data('easing');
			}
			var carousel = sliderElement.children('.caroufredsel-wrap').children('ul.caroufredsel-items').length ? sliderElement.children('.caroufredsel-wrap').children('ul.caroufredsel-items') :  sliderElement.children('.caroufredsel-wrap').find('ul');
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
			if(sliderElement.data('synchronise')){
				carouselOptions.synchronise = [sliderElement.data('synchronise'),false];
				var synchronise = sliderElement.data('synchronise');
				$(synchronise).find('li').each(function(i){
					sliderElement.addClass( 'synchronise-index-'+i );
					sliderElement.on('click',function(){
						carousel.trigger('slideTo',[i, 0, true]);
						return false;
					});
				});
				carouselOptions.scroll.onBefore = function(){
					$(synchronise).find('.selected').removeClass('selected');
					var pos = sliderElement.triggerHandler( 'currentPosition' );
					$(synchronise).find('.synchronise-index-' + pos).addClass('selected');
				};
			}
			if(sliderElement.children('.caroufredsel-pagination').length){
				carouselOptions.pagination = {container:sliderElement.children('.caroufredsel-pagination')};
			}
			if(sliderElement.children('.caroufredsel-wrap').children('.caroufredsel-prev').length && sliderElement.children('.caroufredsel-wrap').children('.caroufredsel-next').length){
				carouselOptions.prev = sliderElement.children('.caroufredsel-wrap').children('.caroufredsel-prev');
				carouselOptions.next = sliderElement.children('.caroufredsel-wrap').children('.caroufredsel-next');
			}
			carousel.carouFredSel(carouselOptions);
			var $element = sliderElement;
			if(sliderElement.find('img').length == 0) $element = $('body');
			
			imagesLoaded($element,function(){
				carousel.trigger('updateSizes').trigger('resize');
			});
			sliderElement.css('opacity','1' );
		}
	}
});