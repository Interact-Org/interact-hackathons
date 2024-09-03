import React, { ComponentType } from 'react';
import { useWindowWidth } from '@react-hook/window-size';

const WidthCheck = <Props extends Object>(Component: ComponentType<Props>) => {
  const ProtectedComponent = (props: Props) => {
    const width = useWindowWidth();
    if (width > 760) return <Component {...props} />;
    else {
      window.location.replace('/mobile');
      return <></>;
    }
  };
  return ProtectedComponent;
};

export default WidthCheck;
