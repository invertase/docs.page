import React from "react";
import { Button } from "./Button";

type Props = {
  href: string;
  icon: React.ReactElement;
  title: string | React.ReactElement;
  text: React.ReactNode;
};

export function Feature({ href, icon, title, text }: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        {icon}
        <h4 className="my-8 font-anton text-5xl tracking-wide">{title}</h4>
        <p className="font-thin">{text}</p>
      </div>
      <div className="mt-10">
        <Button href={href}>Learn More</Button>
      </div>
    </div>
  );
}
