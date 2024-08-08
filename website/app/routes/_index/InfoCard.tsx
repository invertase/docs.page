type Props = {
  title: string;
  description: string;
};

export function InfoCard(props: Props) {
  return (
    <div className="bg-gradient-to-b from-brand-100/5 rounded-xl border border-white/5">
      <div className="h-[200px]" />
      <div className="text-center px-3 py-6 space-y-3">
        <h4 className="text-xs">{props.title}</h4>
        <p className="text-brand-50 text-xs">{props.description}</p>
      </div>
    </div>
  );
}
