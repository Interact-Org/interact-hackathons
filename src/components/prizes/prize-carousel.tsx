import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EmblaCarouselType, EmblaEventType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { NextButton, PrevButton, usePrevNextButtons } from '@/components/carousel/arrow-buttons';
import { setCurrentHackathon } from '@/slices/hackathonSlice';
import { HackathonPrize, HackathonTeam } from '@/types';
import Image from 'next/image';
import { getProjectPicHash, getProjectPicURL } from '@/utils/funcs/safe_extract';


export interface PrizeCardProps {
  prize: HackathonPrize,
  // team?: HackathonTeam
}

export const Prize = ({
  prize
}: PrizeCardProps) => {


  return (
    <div
      className={`w-96 h-52 rounded-lg prize-card-bg relative flex justify-center items-center text-white embla__slide__number ${!prize.team && 'prize-card-bg'}`}
    >
      {prize.team && <Image
          crossOrigin="anonymous"
          className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg -z-10`}
          src={getProjectPicURL(prize.team?.project)}
          alt="Project Cover"
          width={430}
          height={270}
          placeholder="blur"
          blurDataURL={getProjectPicHash(prize.team?.project)}
      />}
      {prize.track && <div className={"absolute px-2 py-0.5 top-1 left-1 text-white bg-[#00EA41] text-xs rounded-full w-fit"}>{prize.track.title}</div> }
      <div className={"flex flex-col"}>
        <p className={"text-lg font-primary text-center font-semibold"}>{prize.title}</p>
        <p className={"text-xs font-primary text-center"}>{prize.team?.title || "Select team to declare winner"}</p>
      </div>
    </div>
  )
}

const TWEEN_SCALE_FACTOR_BASE = 0.25;
const TWEEN_OPACITY_FACTOR_BASE = 0.4;

const numberWithinRange = (number: number, min: number, max: number): number => Math.min(Math.max(number, min), max);

export type PrizeCarouselProps = {
  prizeCards: HackathonPrize[];
  options?: EmblaOptionsType;
  // setSlideInFrameIndex?: React.Dispatch<React.SetStateAction<number>>,
  setCurrentPrizeCardData?: React.Dispatch<React.SetStateAction<HackathonPrize>>
};

const PrizesCarousel: React.FC<PrizeCarouselProps> = props => {
  const { prizeCards, options, setCurrentPrizeCardData } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenScaleFactor = useRef(0);
  const tweenOpacityFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  // const [inFrameIndex, setInFrameIndex] = useState(0);

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
        if (tweenNode) tweenNode.style.transform = `scale(${scale})`;

        const tweenOpacityValue = 1 - Math.abs(diffToTarget * tweenOpacityFactor.current);
        const opacity = numberWithinRange(tweenOpacityValue, 0, 1).toString();
        emblaApi.slideNodes()[slideIndex].style.opacity = opacity;

        if (Number(opacity) + 0.001 > 1) {
          // if (setSlideInFrameIndex) setSlideInFrameIndex(slideIndex);
          if (setCurrentPrizeCardData) setCurrentPrizeCardData(prizeCards[slideIndex]);
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
    <div className="embla w-full relative">
      <div className="embla__viewport px-20" ref={emblaRef}>
        <div className="embla__container items-center">
          {prizeCards.map(prizeCard => (
            <div
              key={prizeCard.id}
              className={"embla__slide flex justify-center"}
            >
            <Prize
              prize={prizeCard}
            />
            </div>
          ))}
        </div>
      </div>
      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} className={"bg-white rounded-full absolute left-5 top-1/2 size-8 flex justify-center items-center"} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} className={"bg-white rounded-full absolute right-5 top-1/2 size-8 flex justify-center items-center"} />
        </div>
      </div>
    </div>
  );
};

export default PrizesCarousel;
