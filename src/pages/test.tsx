import EmblaCarousel from '@/components/carousel';
import React from 'react';

const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const Test = () => {
  return (
    <div>
      <EmblaCarousel slides={SLIDES} />
    </div>
  );
};

export default Test;
