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
        'mb-3 flex items-center gap-4 overflow-hidden rounded-xl px-5 py-4 text-sm',
        props.className,
      )}
    >
      <span className="h-6 w-6 flex-shrink-0">{props.icon}</span>
      <span className="[&>p]:m-0">{props.children}</span>
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
      className="border border-sky-500/50 bg-sky-200/50 text-sky-900 dark:border-sky-500/50 dark:bg-sky-500/10 dark:text-white"
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
      className="border border-yellow-500/50 bg-yellow-200/50 text-yellow-900 dark:border-yellow-500/50 dark:bg-yellow-500/10 dark:text-white"
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
      className="border border-red-500/50 bg-red-200/50 text-red-900 dark:border-red-500/50 dark:bg-red-500/10 dark:text-white"
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
      className="border border-green-500/50 bg-green-200/50 text-green-900 dark:border-green-500/50 dark:bg-green-500/10 dark:text-white"
    >
      {props.children}
    </Callout>
  );
};
