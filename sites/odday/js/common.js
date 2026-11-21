/* Shared header eyes and TOP button — uses jQuery already installed on the site */
(function($){
 $(function(){
   var $eyes=$('.od-shared-header .odc-od-pupil');
   var tx=0,ty=0,x=0,y=0;
   function draw(){x+=(tx-x)*.18;y+=(ty-y)*.18;$eyes.css('transform','translate('+x.toFixed(2)+'px,'+y.toFixed(2)+'px)');requestAnimationFrame(draw)}
   if($eyes.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){draw();}
   $(document).on('mousemove.oddayShared',function(e){
     var el=$eyes[0];if(!el)return;var r=el.getBoundingClientRect();
     var dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy)||1;
     tx=dx/len*Math.min(4,Math.abs(dx)/27);ty=dy/len*Math.min(5,Math.abs(dy)/27);
   });
   // For same-origin iframes such as section 03.
   $('iframe').on('load.oddayShared',function(){var frame=this;try{$(frame.contentDocument).on('mousemove.oddayShared',function(e){var r=frame.getBoundingClientRect();$(document).trigger($.Event('mousemove',{clientX:r.left+e.clientX,clientY:r.top+e.clientY}))})}catch(err){}});
   var $top=$('.od-shared-top');function updateTop(){var $section=$('#section7');var start=$section.length ? Math.max(0,$section.offset().top-$(window).height()*.35) : 950;$top.toggleClass('is-visible',$(window).scrollTop()>=start)}
   $(window).on('scroll.oddayShared',updateTop);updateTop();
   $top.on('click',function(){$('html,body').stop(true).animate({scrollTop:0},700,'swing')});
 });
})(jQuery);
