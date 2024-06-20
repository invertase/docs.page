import { CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react';
import { ComponentProps, ReactElement } from 'react';
import { cn } from '~/utils';

type CalloutProps = ComponentProps<'div'> & {
  icon: ReactElement;
};

function Callout(props: CalloutProps) {
  return (
    <div
      className={cn(
        'mb-3 flex gap-4 overflow-hidden rounded-xl px-5 py-4 leading-none text-sm',
        props.className,
      )}
    >
      {props.icon}
      <span className="[&>p]:m-0">{props.children}</span>
    </div>
  );
}

export function Info(props: CalloutProps) {
  return (
    <Callout
      icon={<InfoIcon size={20} />}
      className="border border-sky-500/20 bg-sky-200/10 text-sky-700 dark:border-sky-500/50 dark:bg-sky-500/10 dark:text-white"
    >
      {props.children}
    </Callout>
  );
}

export function Warning(props: CalloutProps) {
  return (
    <Callout
      icon={<TriangleAlertIcon size={20} />}
      className="border border-yellow-500/20 bg-yellow-200/10 text-yellow-700 dark:border-yellow-500/50 dark:bg-yellow-500/10 dark:text-white"
    >
      {props.children}
    </Callout>
  );
}

export function Error(props: CalloutProps) {
  return (
    <Callout
      icon={<CircleXIcon size={22} />}
      className="border border-red-500/20 bg-red-200/10 text-red-700 dark:border-red-500/50 dark:bg-red-500/10 dark:text-white"
    >
      {props.children}
    </Callout>
  );
}

export function Success(props: CalloutProps) {
  return (
    <Callout
      icon={<CircleCheckIcon size={20} />}
      className="border border-green-500/20 bg-green-200/10 text-green-7s00 dark:border-green-500/50 dark:bg-green-500/10 dark:text-white"
    >
      {props.children}
    </Callout>
  );
}
