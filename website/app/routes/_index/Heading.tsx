type Props = {
  step: number;
  from: string;
  to: string;
  children: React.ReactNode | React.ReactNode[];
};

export function Heading(props: Props) {
  return (
    <div className="flex items-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-xl ${props.from} ${props.to}`}
      >
        <span className="font-anton text-4xl text-white">{props.step}</span>
      </div>
      <h2 className="font-anton ml-6 flex-1 text-4xl leading-relaxed">{props.children}</h2>
    </div>
  );
}
