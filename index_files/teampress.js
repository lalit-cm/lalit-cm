;(function($){
	function extp_masonry(){
		if (typeof imagesLoaded === "function"){
			var $container = $('.extp-masonry:not(.column-1) .ctgrid');
			$container.imagesLoaded( function() {
				$container.masonry({
					itemSelector: '.item-grid',
					horizontalOrder: true
				});
			});
		}
	}
    $(window).load(function() {
		extp_masonry();
	});
	$(document).ready(function() {

		// Carousel
		function extp_carousel(id_clas,infinite,start_on,rtl_mode,slidesshow,auto_play,auto_speed,$slidestoscroll){
		  jQuery(id_clas).EX_ex_s_lick({
			infinite: infinite,
			initialSlide:start_on,
			rtl: rtl_mode =='yes' ? true : false,
			prevArrow:'<button type="button" class="ex_s_lick-prev"><i class="fa fa-angle-left"></i></button>',
			nextArrow:'<button type="button" class="ex_s_lick-next"><i class="fa fa-angle-right"></i></button>',	
			slidesToShow: slidesshow,
			slidesToScroll: $slidestoscroll!='' ? $slidestoscroll : slidesshow,
			dots: false,
			autoplay: auto_play==1 ? true : false,
			autoplaySpeed: auto_speed!='' ? auto_speed : 3000,
			arrows: true,
			centerMode:  false,
			focusOnSelect: true,
			adaptiveHeight: true,
			responsive: [
			  {
				breakpoint: 1024,
				settings: {
				  slidesToShow: slidesshow,
				  slidesToScroll: $slidestoscroll!='' ? $slidestoscroll : slidesshow,
				}
			  },
			  {
				breakpoint: 768,
				settings: {
				  slidesToShow: 2,
				  slidesToScroll: 1
				}
			  },
			  {
				breakpoint: 480,
				settings: {
				  slidesToShow: 1,
				  slidesToScroll: 1
				}
			  }
			]
			  
		  });
		}
		jQuery('.ex-tpcarousel').each(function(){
			var $this = jQuery(this);
			var id =  $this.attr('id');
			var slidesshow =  $this.data('slidesshow');
			if(slidesshow==''){ slidesshow = 3;}
			var startit =  $this.data('startit') > 0 ? $this.data('startit') : 1;
			var auto_play = $this.data('autoplay');
			var auto_speed = $this.data('speed');
			var slidestoscroll = $this.data('slidestoscroll');
			var rtl_mode = $this.data('rtl');
			var start_on =  $this.data('start_on') > 0 ? $this.data('start_on') : 0;
			if($this.data('infinite')=='0'){
			  var infinite = 0;
			}else{
			  var infinite =  $this.data('infinite') == 'yes' || $this.data('infinite') == '1' ? true : false;
			}
			extp_carousel('#'+id+' .ctgrid',infinite,start_on,rtl_mode,slidesshow,auto_play,auto_speed,slidestoscroll);
		});
		// End Carousel

		//DataTable
	
		//End datatable
		// ajax loadmore
		function extp_ajax_load_page($style,$this_click,id_crsc,$page_link){
			if($style !='loadmore'){
				$('#'+id_crsc+' .page-numbers').removeClass('disable-click');
			}
			if($('#'+id_crsc).hasClass('fct-collapse')){
				$('#'+id_crsc+'.fct-collapse .item-grid').removeClass('active-collaps');
				setTimeout(function(){
					$('#'+id_crsc+'.fct-collapse .item-grid .exp-expand-des').getNiceScroll().resize();
				}, 300);
			}
			$this_click.addClass('disable-click');
			var n_page = $('#'+id_crsc+' input[name=num_page_uu]').val();
			if($style=='loadmore'){
				$('#'+id_crsc+' .loadmore-exbt').addClass("loading");
			}else{
				$('#'+id_crsc).addClass("loading");
			}
			var layout = $('#'+id_crsc).hasClass('table-layout') ? 'table' : '';
			if($('#'+id_crsc).hasClass('list-layout')){ layout = 'list';}
			var param_query  		= $('#'+id_crsc+' input[name=param_query]').val();
			var param_ids  		= $('#'+id_crsc+' input[name=param_ids]').val();
			var page  		= $('#'+id_crsc+' input[name=current_page]').val();
			var num_page  		= $('#'+id_crsc+' input[name=num_page]').val();
			var ajax_url  		= $('#'+id_crsc+' input[name=ajax_url]').val();
			var param_shortcode  		= $('#'+id_crsc+' input[name=param_shortcode]').val();
			var char_ft = $('#'+id_crsc+' .etp-alphab a').length ? $('#'+id_crsc+' .etp-alphab a.current').data('value') : '';
				var param = {
					action: 'extp_loadmore',
					param_query: param_query,
					param_ids: param_ids,
					id_crsc: id_crsc,
					page: $page_link!='' ? $page_link : page*1+1,
					param_shortcode: param_shortcode,
					layout: layout,
					char: char_ft,
				};
				$.ajax({
					type: "post",
					url: ajax_url,
					dataType: 'json',
					data: (param),
					success: function(data){
						if(data != '0')
						{
							if($style=='loadmore'){
								n_page = n_page*1+1;
								$('#'+id_crsc+' input[name=num_page_uu]').val(n_page)
								if(data.html_content == ''){ 
									$('#'+id_crsc+' .loadmore-exbt').remove();
								}else{
									$('#'+id_crsc+' input[name=current_page]').val(page*1+1);
									if(layout=='table'){
										var $g_container = $('#'+id_crsc+' table tbody');
										$g_container.append(data.html_content);
									}else if(layout=='list'){
										var $g_container = $('#'+id_crsc+' .ctlist');
										$g_container.append(data.html_content);
									}else{
										var $g_container = $('#'+id_crsc+' .ctgrid');
										$g_container.append(data.html_content);
										setTimeout(function(){ 
											$('#'+id_crsc+' .item-grid').addClass("active");
										}, 200);
									}
									$('#'+id_crsc+' .loadmore-exbt').removeClass("loading");
									$this_click.removeClass('disable-click');
								}
								if(n_page == num_page){
									$('#'+id_crsc+' .loadmore-exbt').remove();
								}
							}else{
								if(layout=='table'){
									$showin = $('#'+id_crsc+' table tbody');
								}else if(layout=='list'){
									$showin = $('#'+id_crsc+' .ctlist');
								}else{
									$showin = $('#'+id_crsc+' .ctgrid');
								}
								$($showin).fadeOut({
									duration:0,
									complete:function(){
										$( this ).empty();
									}
								});
								$('#'+id_crsc).removeClass("loading");
								$showin.append(data.html_content).fadeIn();

							}
							
							if($('#'+id_crsc).hasClass('extp-masonry') && !$('#'+id_crsc).hasClass('column-1')){
								if (typeof imagesLoaded === "function"){
									$('#'+id_crsc+'.extp-masonry .ctgrid').imagesLoaded( function() {
										$('#'+id_crsc+'.extp-masonry .ctgrid').masonry('reloadItems');
										$('#'+id_crsc+'.extp-masonry .ctgrid').masonry({
											isInitLayout : false,
											horizontalOrder: true,
											itemSelector: '.item-grid'
										});
									});
								}
							}
						}else{$('#'+id_crsc+' .loadmore-exbt').html('error');}
					}
				});
			return false;	
		}
		function extp_loadmore(){
			$('.loadmore-exbt').on('click',function() {
				if($(this).hasClass('disable-click')){
					return;
				}
				var $this_click = $(this);
				var id_crsc  = $this_click.closest(".ex-tplist").attr('id');
				extp_ajax_load_page($style ='loadmore' ,$this_click,id_crsc,'');
			});
		}
		extp_loadmore();
		// End load more

		
		
		//search 

    });
    
}(jQuery));