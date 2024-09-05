import React, { ComponentType, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Toaster from '../toaster';
import BaseWrapper from '@/wrappers/base';

const Protect = <Props extends Object>(Component: ComponentType<Props>) => {
  const ProtectedComponent = (props: Props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(0);
    useEffect(() => {
      const token = Cookies.get('token');
      if (!token || token == '') {
        Toaster.error('You are not logged in.');
        setIsAuthenticated(0);
        window.location.replace('/login');
      } else setIsAuthenticated(1);
    }, []);

    if (isAuthenticated === 1) return <Component {...props} />;
    return (
      <BaseWrapper>
        <div></div>
      </BaseWrapper>
    );
  };
  return ProtectedComponent;
};

export default Protect;
