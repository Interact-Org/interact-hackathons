import useUserStateSynchronizer from '@/hooks/sync';
import Protect from '@/utils/wrappers/protect';
import React, { useEffect } from 'react';

const Index = () => {
  const userStateSynchronizer = useUserStateSynchronizer();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    if (action == 'sync') userStateSynchronizer(); //TODO remove form params after promise is successful
  }, [window.location.search]);

  return <div>Index</div>;
};

export default Protect(Index);
