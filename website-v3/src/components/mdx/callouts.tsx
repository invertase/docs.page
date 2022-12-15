import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import cx from 'classnames';
import {
  CheckCircleIcon,
  ExclaimationTriangleIcon,
  InformationalCircleIcon,
} from '@components/icons';

type Props = {
  icon: ReactElement;
  children: ReactNode | undefined;
  className: string;
};

const Callout: React.FC<Props> = props => {
  return (
    <div
      className={cx(
        'bg:bg-slate-600 mb-3 flex items-center gap-2 overflow-hidden px-5 py-4',
        props.className,
      )}
    >
      <span className="h-6 w-6">{props.icon}</span>
      <span>{props.children}</span>
    </div>
  );
};

export const Info: React.FC<PropsWithChildren> = props => {
  return (
    <Callout
      icon={
        <span>
          <InformationalCircleIcon />
        </span>
      }
      className=""
    >
      {props.children}
    </Callout>
  );
};

export const Warning: React.FC<PropsWithChildren> = props => {
  return (
    <Callout
      icon={
        <span>
          <ExclaimationTriangleIcon />
        </span>
      }
      className=""
    >
      {props.children}
    </Callout>
  );
};

export const Error: React.FC<PropsWithChildren> = props => {
  return (
    <Callout
      icon={
        <span>
          <ExclaimationTriangleIcon />
        </span>
      }
      className=""
    >
      {props.children}
    </Callout>
  );
};

export const Success: React.FC<PropsWithChildren> = props => {
  return (
    <Callout
      icon={
        <span>
          <CheckCircleIcon />
        </span>
      }
      className=""
    >
      {props.children}
    </Callout>
  );
};
