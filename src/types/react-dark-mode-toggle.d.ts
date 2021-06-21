declare module 'react-dark-mode-toggle' {
  import React from 'react';
  declare type Props = {
    size?: number | string;
    checked?: boolean;
    onChange?: (isChecked: boolean) => void;
    speed?: number;
    className?: string;
  };
  declare const _default: React.MemoExoticComponent<(props: Props) => JSX.Element>;
  export default _default;
}
