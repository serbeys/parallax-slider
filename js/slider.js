var slider;

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
            slider = new HNDSMSlider({
                className: 'slide',
                easing: 'easeInExpo',
                startSlide: 0,
                duration: 1,
                pause: 5
            });
            slider.start();

            new ParallaxEffect(slider).init();
        }
    );


    window.addEventListener('resize', function () {
        slider.changeHeight();
        new ParallaxEffect(slider).init();
    });

    // Slider
    function HNDSMSlider(settings) {
        var self;
        self = this;
        self.settings = settings;
        self.currentSlide = settings.startSlide;
        self.nextSlide = self.currentSlide + 1;
        self.prevSlide = self.nextSlide + 1;
        self.slides = document.getElementsByClassName(settings.className);
        self.slideHeight = this.slides[settings.startSlide].offsetHeight;

        self.start = function () {
            TweenLite.set(self.slides[self.prevSlide], isFirefox() ? {top: -self.slideHeight} : {y: -self.slideHeight});
            TweenLite.set(self.slides[self.currentSlide], isFirefox() ? {top: 0} : {y: 0});
            TweenLite.set(self.slides[self.nextSlide], isFirefox() ? {top: self.slideHeight} : {y: self.slideHeight});

            // todo: rewrite to existing titles
            var title = slider.slides[self.currentSlide].getElementsByTagName('a');
            TweenLite.to(title, 1, {opacity: 1, margin: 0, delay: 1});

            document.getElementById("slide-down").addEventListener("click", function () {
                TweenLite.delayedCall(0, changeSlide, [self, "down"]);
            });

            document.getElementById("slide-up").addEventListener("click", function () {
                TweenLite.delayedCall(0, changeSlide, [self, "up"]);
            });
        };

        self.changeHeight = function () {
            self.currentSlide = self.settings.startSlide;
            self.slideHeight = self.slides[settings.startSlide].offsetHeight;
            self.start();
        };

        self.getCurrentSlide = function () {
            return self.slides[this.currentSlide];
        };

        var isFirefox = function () {
            return navigator.userAgent.search('Firefox') > -1;
        };


        var changeSlide = function (slider, direction) {
            var movingSlide = slider.prevSlide;
            var directionIndex = 1;

            if (direction === "up") {
                movingSlide = slider.nextSlide;
                directionIndex = -1;
            }


            var title = slider.slides[movingSlide].getElementsByTagName('a');
            TweenLite.to(title, 1, {opacity: 1, margin: 0, delay: 1});

            TweenLite.to(slider.slides[slider.currentSlide], slider.settings.duration, {
                css: isFirefox() ? {top: directionIndex * (slider.slideHeight)} : {y: directionIndex * (slider.slideHeight)},
                onComplete: onSlideComplete,
                onCompleteParams: [slider, movingSlide],
                ease: slider.settings.easing
            });

            TweenLite.to(slider.slides[movingSlide], slider.settings.duration, {
                css: isFirefox() ? {top: 0} : {y: 0},
                ease: slider.settings.easing
            });


        };

        var onSlideComplete = function (slider, movingSlide) {
            var slide = slider.slides[slider.currentSlide];
            TweenLite.set(slide.getElementsByTagName('a'), {clearProps: 'all'});
            console.log(slide.getElementsByTagName('a'));
            slider.currentSlide = movingSlide;
            slider.nextSlide = movingSlide + 1;
            slider.prevSlide = movingSlide - 1;


            if (slider.nextSlide === slider.slides.length) {
                slider.nextSlide = 0;
            }
            if (slider.prevSlide < 0) {
                slider.prevSlide = slider.slides.length - 1;
            }
            console.log(slider.prevSlide,slider.currentSlide, slider.nextSlide);
            TweenLite.set(slider.slides[slider.prevSlide], isFirefox() ? {top: -slider.slideHeight} : {y: -slider.slideHeight});
            TweenLite.set(slider.slides[slider.nextSlide], isFirefox() ? {top: slider.slideHeight} : {y: slider.slideHeight});

        };
    }

    // ParallaxEffect
    function ParallaxEffect(slider) {
        var self = this;

        var maxRotationX = 10,
            maxRotationY = 10;

        var parallaxSlideClass = 'parallax-content',
            parallaxLightClass = 'parallax-light';

        self.slides = slider.slides;
        var halfWidht = slider.slides[0].offsetWidth / 2;
        var halfHeight = slider.slides[0].offsetHeight / 2;

        self.init = function () {

            for (var i = 0; i < self.slides.length; i++) {
                self.slides[i].addEventListener('mousemove', function (event) {
                    var slide = this;
                    moveBackground(event, slide);
                }, false);
            }
            window.addEventListener('deviceorientation', function (event) {
                window.requestAnimationFrame(function () {
                    moveBackgroundGyroskope(event);
                });
            });

        };

        var moveBackground = function (event, slide) {
            var xPos = event.pageX - slide.offsetLeft - halfWidht;
            var yPos = event.pageY - slide.offsetTop - halfHeight;
            var content = slide.getElementsByClassName(parallaxSlideClass),
                light = slide.getElementsByClassName(parallaxLightClass);

            TweenLite.to(content, 1, {
                css: {
                    rotationY: xPos / 100,
                    rotationX: yPos / 100
                },
                ease: Power1.easeOut,
                transformOrigin: 'center',
                force3D: true
            });
            TweenLite.to(light, 1, {
                css: {
                    y: -yPos / 10,
                    x: -xPos / 10
                },
                force3D: true
            });


        };

        var moveBackgroundGyroskope = function (event) {
            var slide = slider.getCurrentSlide();
            var content = slide.getElementsByClassName(parallaxSlideClass),
                light = slide.getElementsByClassName(parallaxLightClass);
            var rotateY,
                rotateX;

            if (window.innerHeight < window.innerWidth) {
                rotateX = event.gamma / 2;
                rotateY = -event.beta;
            } else {
                rotateY = -event.gamma;
                rotateX = event.beta / 2;
            }


            if (rotateX > maxRotationX) rotateX = maxRotationX;
            if (rotateX < -maxRotationX) rotateX = -maxRotationX;
            if (rotateY > maxRotationY) rotateY = maxRotationY;
            if (rotateY < -maxRotationY) rotateY = -maxRotationY;

            TweenLite.to(content, 1, {
                css: {
                    rotationX: rotateX + 'deg',
                    rotationY: rotateY + 'deg'
                },
                ease: Power1.easeOut,
                force3d: true
            });
            TweenLite.to(light, 1, {
                css: {
                    y: rotateX * 2 + 'px',
                    x: rotateY * 8 + 'px'
                },
                force3D: true
            });

        };

        return self;
    }


})();




