import * as React from 'react';

export function useClickOutside<T extends HTMLElement>(onOutsideClick: () => void) {
  const ref = React.useRef<T>(null);
  const callbackRef = React.useRef(onOutsideClick);

  React.useEffect(() => {
    callbackRef.current = onOutsideClick;
  });

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callbackRef.current();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return ref;
}
