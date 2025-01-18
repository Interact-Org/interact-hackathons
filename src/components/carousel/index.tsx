import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EmblaCarouselType, EmblaEventType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { NextButton, PrevButton, usePrevNextButtons } from './arrow-buttons';
import { DotButton, useDotButton } from './dot-buttons';

const TWEEN_SCALE_FACTOR_BASE = 0.25;
const TWEEN_OPACITY_FACTOR_BASE = 0.4;

const numberWithinRange = (number: number, min: number, max: number): number => Math.min(Math.max(number, min), max);

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = props => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenScaleFactor = useRef(0);
  const tweenOpacityFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const [inFrameIndex, setInFrameIndex] = useState(0);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map(slideNode => {
      return slideNode.querySelector('.embla__slide__number') as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenScaleFactor.current = TWEEN_SCALE_FACTOR_BASE * emblaApi.scrollSnapList().length;
    tweenOpacityFactor.current = TWEEN_OPACITY_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScaleAndOpacity = useCallback((emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach(slideIndex => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach(loopItem => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenScaleValue = 1 - Math.abs(diffToTarget * tweenScaleFactor.current);
        const scale = numberWithinRange(tweenScaleValue, 0, 1).toString();
        const tweenNode = tweenNodes.current[slideIndex];
        tweenNode.style.transform = `scale(${scale})`;

        const tweenOpacityValue = 1 - Math.abs(diffToTarget * tweenOpacityFactor.current);
        const opacity = numberWithinRange(tweenOpacityValue, 0, 1).toString();
        emblaApi.slideNodes()[slideIndex].style.opacity = opacity;

        if (Number(opacity) + 0.001 > 1) {
          setInFrameIndex(slideIndex);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScaleAndOpacity(emblaApi);

    emblaApi
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScaleAndOpacity)
      .on('scroll', tweenScaleAndOpacity)
      .on('slideFocus', tweenScaleAndOpacity);
  }, [emblaApi, tweenScaleAndOpacity]);

  return (
    <div className="embla max-w-[60rem]">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map(index => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number border-primary_black border-2">
                {index + 1}
                <img
                  className="w-full h-full rounded-3xl absolute top-0 right-0"
                  src={`https://picsum.photos/600/350?v=${index}`}
                  alt="Your alt text"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(index === selectedIndex ? ' embla__dot--selected' : '')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
