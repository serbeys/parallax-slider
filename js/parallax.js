jQuery(document).ready(function ($) {
    function supports3d() {
        if (!window.getComputedStyle) {
            return false;
        }

        var el = document.createElement('p'),
            has3d,
            transforms = {
                'webkitTransform': '-webkit-transform',
                'OTransform': '-o-transform',
                'msTransform': '-ms-transform',
                'MozTransform': '-moz-transform',
                'transform': 'transform'
            };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    }
    var slideIndex = 0;
    var $preview = $('#preview'),
        $previewContent = $('.parallax-content'),
        $previewGlint = $('.parallax-light'),
        $previewPhone = $('.parallax-mask'),
        $previewImage = $('.parallax-image')
    previewLoadedClass = 'preview--loaded';



    if (!supports3d()) {
        return false;
    }

    var halfWindowH = $(window).height() * 0.5,
        halfWindowW = $(window).width() * 0.5,
        //define a max rotation value (X and Y axises)
        maxRotationX = 5,
        maxRotationY = 5,
        aspectRatio;

    // //detect if hero <img> has been loaded and evaluate its aspect-ratio
    // $previewPhone.load(function () {
    //     var $this = $(this);
    //
    //     aspectRatio = $this.width() / $this.height();
    // }).each(function () {
    //     //check if image was previously load - if yes, trigger load event
    //     if (this.complete) {
    //         $(this).load();
    //     }
    // });

    //detect mouse movement
    $previewContent.on('mousemove', function (event) {
        var wrapperOffsetTop = $(this).offset().top;

        window.requestAnimationFrame(function () {
            moveBackground(event, wrapperOffsetTop);
        });
    });

    window.addEventListener("deviceorientation", function (e) {
        var wrapperOffsetTop = $previewContent.offset().top;
        window.requestAnimationFrame(function () {
            moveBackgroundGyroskope(e, wrapperOffsetTop);
        });
    });


    //on resize - adjust .cd-background-wrapper and .cd-floating-background dimentions and position
    $(window).on('resize', function () {
        window.requestAnimationFrame(function () {
            halfWindowH = $(window).height() * 0.5;
            halfWindowW = $(window).width() * 0.5;
        });
    });


    function moveBackground(event, topOffset) {
        var rotateX = ((-event.pageX + halfWindowW) / halfWindowW) * maxRotationX,
            yPosition = event.pageY - topOffset,
            rotateY = ((yPosition - halfWindowH) / halfWindowH) * maxRotationY;

        if (rotateX > maxRotationX) rotateX = maxRotationX;
        if (rotateX < -maxRotationX) rotateX = -maxRotationX;
        if (rotateY > maxRotationY) rotateY = maxRotationY;
        if (rotateY < -maxRotationY) rotateY = -maxRotationY;

        $previewContent.css('transform', 'rotateX(' + rotateY + 'deg' + ') rotateY(' + rotateX + 'deg' + ') translateZ(0)');
        $previewGlint.css('transform', 'translate(' + (rotateX * 8) + 'px, ' + (rotateY * 4) + 'px)');
    }

    function moveBackgroundGyroskope(event, topOffset) {
        var rotateX = -event.gamma,
            rotateY = event.beta / 4;

        if (rotateX > maxRotationX) rotateX = maxRotationX;
        if (rotateX < -maxRotationX) rotateX = -maxRotationX;
        if (rotateY > maxRotationY) rotateY = maxRotationY;
        if (rotateY < -maxRotationY) rotateY = -maxRotationY;

        $previewContent.css('transform', 'rotateX(' + rotateY + 'deg' + ') rotateY(' + rotateX + 'deg' + ') translateZ(0)');
        $previewGlint.css('transform', 'translate(' + (rotateX * 8) + 'px, ' + (rotateY * 4) + 'px)');
    }
});
