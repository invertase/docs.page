type Props = {
  step: number;
  title: string;
  description: string;
  asset: React.ReactNode;
  children: React.ReactNode;
};

export function Card(props: Props) {
  return (
    <div className="relative">
      <div className="hidden lg:flex absolute -left-[60px] top-4 bg-gradient-to-br from-brand-900/90 to-black border border-brand-100/20 text-brand-50 rounded-full size-14 text-2xl items-center justify-center font-bold">
        {props.step}
      </div>
      <div className="bg-black rounded-xl p-6 lg:ml-8 lg:grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <h2 className="font-semibold text-2xl text-brand-50">
            <span className="lg:hidden">{props.step}. </span>
            <span>{props.title}</span>
          </h2>
          <p className="mt-1 mb-6 opacity-75">{props.description}</p>
          <div className="lg:hidden">{props.asset}</div>
          <div className="lg:hidden mt-10">{props.children}</div>
        </div>
        <div className="hidden lg:flex flex-col">
          <div className="grow flex justify-end">{props.asset}</div>
          <div className="mt-4 flex justify-end">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
