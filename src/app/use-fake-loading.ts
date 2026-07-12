import { useEffect, useState } from 'react';

export function useFakeLoading(ms = 600): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return loading;
}
