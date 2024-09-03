import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Router from 'next/router';

const NProgressConfig = () => {
  NProgress.configure({ trickleSpeed: 200 });

  Router.events.on('routeChangeStart', () => {
    NProgress.start();
    NProgress.set(0.4);
  });

  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());
};

export default NProgressConfig;
