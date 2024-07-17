type Props = {
	href?: string;
	children: React.ReactNode | React.ReactNode[];
};

export function Feature(props: Props) {
	return (
		<div className="flex flex-col items-center justify-center p-3">
			<div className="flex flex-1 flex-col items-center justify-center">
				<slot name="icon" />
				<h4 className="font-anton my-8 text-5xl tracking-wide">
					<slot name="title" />
				</h4>
				<p className="min-h-[90px] leading-relaxed">
					<slot name="text" />
				</p>
			</div>
			<div className="mt-10">
				{!!props.href && (
					<a
						href={props.href}
						className="rounded border border-gray-600 px-6 py-2 no-underline transition-all duration-100 hover:border-gray-300 dark:hover:border-white"
					>
						Learn More
					</a>
				)}
				{!props.href && <div className="text-gray-400">Coming Soon...</div>}
			</div>
		</div>
	);
}
