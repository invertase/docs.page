import React from 'react';
import cx from 'classnames';

export type PillType = 'success' | 'error' | 'warn' | 'info';

export type PillProps = {
  children: React.ReactNode;
  type: PillType;
  disabled?: boolean;
  onClick?: () => void;
};

const classMap: { [key in PillType]: string } = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warn: 'bg-yellow-500 text-white',
  info: 'bg-gray-100 text-black',
};

export function Pill({ children, type, disabled, onClick }: PillProps): JSX.Element {
  const className = cx(
    'inline-block text-sm px-3 py-1 rounded-lg mr-2',
    {
      'opacity-25': disabled,
    },
    classMap[type],
  );

  if (onClick) {
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  return <div className={className}>{children}</div>;
}
