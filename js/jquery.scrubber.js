(function( $ ){

    var opts = {
        bufferDist: 50,
        velocityConst: 1.8,
        deadZoneWidth: '35%',
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
                
                if (!opts.container.jquery) {
                    $container = $(opts.container);
                }
                else {
                    $container = opts.container;
                }

                if (typeof opts.deadZoneWidth == 'string' && opts.deadZoneWidth.charAt(opts.deadZoneWidth.length-1) == '%') {
                    opts.deadZoneWidth = $container.width() * parseInt(opts.deadZoneWidth) / 100;
                }

                opts.maxLeft = $list.offset().left - $container.offset().left;

                $list.css({
                    position: 'absolute',
                    left: opts.maxLeft
                });

                $container.css({
                    position: 'relative'
                });

                $container.bind({
                    mousemove: function(e) {
                        if ($list.width() > $container.width() && Math.abs($list.data('startX') - e.pageX) > opts.bufferDist) {
                            var pxFromCenter = e.pageX - (parseInt($container.offset().left) + parseInt($container.width() / 2)),
                                // There has GOT to be a better way to do this
                                pxFromDeadZone = (pxFromCenter >= 0) ? Math.max(0, pxFromCenter - opts.deadZoneWidth / 2) : Math.min(0, pxFromCenter + opts.deadZoneWidth / 2),
                                minLeft = - ($list.width() - $container.width()),
                                maxLeft = opts.maxLeft,
                                velocity = pxFromDeadZone * opts.velocityConst,
                                distance = (velocity < 0) ? parseInt($list.css('left')) : -minLeft + parseInt($list.css('left')),
                                time = (distance / velocity).toFixed(2);
                            $list.data('startX', e.pageX);
                            if (velocity == 0) {
                                $list.stop(true);
                                if (opts.changeCursor) {
                                    $container.css({ cursor: 'auto' });
                                }
                            }
                            else {
                                if (opts.changeCursor) {
                                    $container.css({
                                        cursor: (pxFromDeadZone > 0) ? 'e-resize' : 'w-resize'
                                    });
                                }
                                //Probably should do this with a step function instead
                                $list.stop(true).animate(
                                    { left: (velocity < 0) ? maxLeft : minLeft },
                                    { duration: time * 1000, easing: 'linear', queue: false }
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
