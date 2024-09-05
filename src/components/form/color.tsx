import React from 'react';
import { CirclePicker, ColorResult, HuePicker, SliderPicker, TwitterPicker } from 'react-color';

interface Props {
  label?: string;
  val: string;
  setVal: (color: ColorResult) => void;
  required?: boolean;
}

const Color = ({ label, val, setVal, required = false }: Props) => {
  return (
    <div className="w-full">
      {label && (
        <div className="text-xs ml-1 font-medium uppercase text-gray-500 mb-4">
          {label}
          {required && '*'}
        </div>
      )}
      <div className="w-full flex items-center gap-4">
        <TwitterPicker color={val} onChangeComplete={setVal} />
        <div className="grow h-12 flex-center rounded-lg font-medium" style={{ backgroundColor: val }}>
          Text Preview
        </div>
      </div>
    </div>
  );
};

export default Color;
