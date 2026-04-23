import type { ComponentProps, PropsWithChildren, ReactElement } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  RiAlertFill,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiInformationFill,
} from "@remixicon/react";

type CalloutProps = ComponentProps<"div"> & {
  icon?: ReactElement;
  title: string;
};

function Callout(props: CalloutProps) {
  return (
    <Alert className={cn("px-4 py-3", props.className)}>
      {props.icon}
      <AlertTitle>{props.title}</AlertTitle>
      <AlertDescription>{props.children}</AlertDescription>
    </Alert>
  );
}

export function Info(props: PropsWithChildren) {
  return (
    <Callout
      title="Information"
      icon={<RiInformationFill />}
      className="bg-sky-500/5 border-sky-500/20"
    >
      {props.children}
    </Callout>
  );
}

export function Warning(props: PropsWithChildren) {
  return (
    <Callout
      title="Warning"
      icon={<RiAlertFill />}
      className="bg-yellow-500/5 border-yellow-500/20"
    >
      {props.children}
    </Callout>
  );
}

export function Error(props: PropsWithChildren) {
  return (
    <Callout
      title="Error"
      icon={<RiCloseCircleFill />}
      className="bg-destructive/5 border-destructive/20"
    >
      {props.children}
    </Callout>
  );
}

export function Success(props: PropsWithChildren) {
  return (
    <Callout
      title="Success"
      icon={<RiCheckboxCircleFill />}
      className="bg-green-500/5 border-green-500/20"
    >
      {props.children}
    </Callout>
  );
}
