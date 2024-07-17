import { useState, useCallback } from "react";

const useRefreshing = (reloadFunction) => {
  const [refreshing, setRefreshing] = useState(false);

  const reloadContent = useCallback(async () => {
    setRefreshing(true);
    try {
      await reloadFunction();
    } finally {
      setRefreshing(false);
    }
  }, [reloadFunction]);

  return { refreshing, reloadContent };
};

export default useRefreshing;
