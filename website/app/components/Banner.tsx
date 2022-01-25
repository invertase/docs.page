import { CSSProperties } from 'react';

export function Banner() {
  const styles: CSSProperties = {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  };

  return (
    <div className="flex h-6 items-center justify-center text-xs font-medium" style={styles}>
      Version 2.0 is released! Go check it out!
    </div>
  );
}
