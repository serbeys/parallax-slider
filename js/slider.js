
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

function HNDSMSlider(settings) {
    this.settings = settings;
    this.currentSlide = settings.startSlide;
    this.nextSlide = this.currentSlide + 1;
    this.slides = document.getElementsByClassName(settings.className);
    this.slideHeight = this.slides[settings.startSlide].offsetHeight;

    this.start = function () {
        TweenLite.set(this.slides, {y: this.slideHeight});
        TweenLite.set(this.slides[this.settings.startSlide], {y: 0});
        this.timerFunction = TweenLite.delayedCall(this.settings.pause, changeSlide, [this]);
    };

    var changeSlide = function (slider) {
        TweenLite.to(slider.slides[slider.currentSlide], slider.settings.duration, {
            css: {y: -(slider.slideHeight)},
            onComplete: onSlideComplete,
            onCompleteParams:[slider, slider.slides[slider.currentSlide]],
            ease: slider.settings.easing
        });

        TweenLite.to(slider.slides[slider.nextSlide], slider.settings.duration, {
            css: {y: 0},
            ease: slider.settings.easing
        })
    };

    var onSlideComplete = function (slider, slide) {


        slider.nextSlide = slider.currentSlide;
        slider.currentSlide++;
        if (slider.currentSlide == slider.slides.length) {
            slider.currentSlide = 0;
        }
        TweenLite.set(slide, {y: slider.slideHeight});
        slider.timerFunction.restart(true);
    };
}


