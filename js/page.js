(function( $ ){

    var opts = {
        bufferDist: 50,
        velocityConst: 1.8,
        deadZoneWidth: 150,
        changeCursor: false
    };

    var methods = {
        init : function( options ) {
            return this.each(function(){

                $.extend(opts, options);
                var $list = $(this),
                    $container;

                if (!opts.container) {
                    opts.container = $list.parent();
                }
                else if (!opts.container.jquery) {
                    $container = $(opts.container);
                }
                else {
                    $container = opts.container;
                }

                $container.bind({
                    mousemove: function(e) {
                        if ($list.width() > $container.width() && Math.abs($list.data('startX') - e.pageX) > opts.bufferDist) {
                            var pxFromCenter = e.pageX - (parseInt($container.offset().left) + parseInt($container.width() / 2)),
                                minLeft = - ($list.width() - $container.width()),
                                maxLeft = 0,
                                velocity = pxFromCenter * opts.velocityConst,
                                distance = (velocity < 0) ? parseInt($list.css('left')) : -minLeft + parseInt($list.css('left')),
                                time = (distance / velocity).toFixed(2);
                            $list.data('startX', e.pageX);
                            if (Math.abs(pxFromCenter) <= parseInt(opts.deadZoneWidth / 2)) {
                                $list.stop(true);
                                if (opts.changeCursor) {
                                    $container.css({ cursor: 'auto' });
                                }
                            }
                            else {
                                if (opts.changeCursor) {
                                    $container.css({
                                        cursor: (pxFromCenter > 0) ? 'e-resize' : 'w-resize'
                                    });
                                }
                                //Probably should do this with a step function instead
                                $list.stop(true).animate(
                                    { left: (velocity < 0) ? maxLeft : minLeft },
                                    { duration: time * 1000, easing: 'linear' }
                                );
                            }
                        }
                    },

                    mouseenter: function(e) {
                        $list.data('startX', e.pageX);
                    }
                });
            });
        }
    };

    $.fn.scrubber = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }    
    };

})( jQuery );

jQuery(document).ready(function() {

    jQuery('.youtube-video-link').click(function(e) {
        e.preventDefault();
        var target = jQuery(this).attr('href'),
        id = target.substring(target.lastIndexOf('/') + 1);
        jQuery.modal('<iframe src="http://www.youtube.com/embed/' + id + '" frameborder="0" width="560" height="349" allowfullscreen></iframe>', {
            closeHTML:"",
            onOpen: function (dialog) {
                dialog.overlay.fadeIn(250, function () {
                    dialog.container.show();
                    dialog.data.show();
                });
            },
            overlayClose:true
        });
    });
    jQuery('#mycarousel').scrubber({ container: '#viz1' });
});