var slider;

document.addEventListener("DOMContentLoaded", function (event) {
        slider = new HNDSMSlider({
            className: "slide",
            easing: "easeInExpo",
            startSlide: 0,
            duration: 1,
            pause: 5
        });
        slider.start();
    }
);


window.addEventListener('resize', function(event){
    slider.changeHeight();
});

function HNDSMSlider(settings) {
    this.settings = settings;
    this.currentSlide = settings.startSlide;
    this.nextSlide = this.currentSlide + 1;
    this.slides = document.getElementsByClassName(settings.className);
    this.slideHeight = this.slides[settings.startSlide].offsetHeight;

    this.start = function () {
        TweenLite.set(this.slides, isFirefox() ? {top: this.slideHeight} : {y: this.slideHeight});
        TweenLite.set(this.slides[this.settings.startSlide], isFirefox() ? {top: 0} : {y: 0});
        // todo: rewrite to existing titles
        var title = slider.slides[this.settings.startSlide].getElementsByTagName("a");
        TweenLite.to(title, 1, {opacity: 1, margin: 0, delay: 1});

        this.timerFunction = TweenLite.delayedCall(this.settings.pause, changeSlide, [this]);
    };

    this.changeHeight = function () {
        this.currentSlide = this.settings.startSlide;
        this.nextSlide = this.currentSlide + 1;
        this.slideHeight = this.slides[settings.startSlide].offsetHeight;
        this.start();
    };

    var isFirefox = function () {
        return navigator.userAgent.search("Firefox") > -1;
    };


    var changeSlide = function (slider) {
        var title = slider.slides[slider.nextSlide].getElementsByTagName("a");
        TweenLite.to(title, 1, {opacity: 1, margin: 0, delay: 1});

        TweenLite.to(slider.slides[slider.currentSlide], slider.settings.duration, {
            css: isFirefox() ? {top: -(slider.slideHeight)} : {y: -(slider.slideHeight)},
            onComplete: onSlideComplete,
            onCompleteParams: [slider, slider.slides[slider.currentSlide]],
            ease: slider.settings.easing
        });

        TweenLite.to(slider.slides[slider.nextSlide], slider.settings.duration, {
            css: isFirefox() ? {top: 0} : {y: 0},
            ease: slider.settings.easing
        });

    };

    var onSlideComplete = function (slider, slide) {
        TweenLite.set(slide, isFirefox() ? {top: slider.slideHeight} : {y: slider.slideHeight});
        TweenLite.set(slide.getElementsByTagName("a"), {clearProps:"all"});
        console.log(slide.getElementsByTagName("a"));
        slider.timerFunction.restart(true);
        slider.currentSlide = slider.nextSlide;
        slider.nextSlide++;

        if (slider.nextSlide == slider.slides.length) {
            slider.nextSlide = 0;
        }
    };
}


