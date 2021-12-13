import { CSSProperties } from 'react';

export function Banner() {
  const styles: CSSProperties = {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  };

  return (
    <div className="h-6 flex items-center justify-center font-medium text-xs" style={styles}>
      Version 2.0 is released! Go check it out!
    </div>
  );
}
