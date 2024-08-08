import type { LinksFunction } from "@vercel/remix";
import {
	BookTextIcon,
	ChevronRightIcon,
	Grid2X2Icon,
	HandshakeIcon,
	HeartIcon,
	ShieldCheckIcon,
} from "lucide-react";
import { useInlineScript } from "~/hooks";
import { FeatureCard } from "./FeatureCard";
import { InfoCard } from "./InfoCard";

export const links: LinksFunction = () => {
	return [
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: "/_docs.page/favicon/apple-touch-icon.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "32x32",
			href: "/_docs.page/favicon/favicon-32x32.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "16x16",
			href: "/_docs.page/favicon/favicon-16x16.png",
		},
		{
			rel: "manifest",
			href: "/_docs.page/favicon/site.webmanifest",
		},
		{
			rel: "mask-icon",
			href: "/_docs.page/favicon/safari-pinned-tab.svg",
			color: "#5bbad5",
		},
	];
};

export default function Homepage() {
	const scripts = useInlineScript(`<script>(() => {
		document.documentElement.setAttribute('data-theme', 'dark');
        const root = document.documentElement;
			root.style.setProperty('--background-dark', '153 54% 3%');		
	})()</script>`);

	return (
		<>
			{scripts}
			<header className="max-w-5xl mx-auto py-5 px-3 flex items-center">
				<div>Logo</div>
				<div className="grow flex justify-end gap-3">
					<ul>
						<li>Docs</li>
					</ul>
					<div>Made by Invertase</div>
				</div>
			</header>
			<section className="max-w-3xl mx-auto pt-20 px-3 space-y-6">
				<h1 className="text-center text-6xl font-bold leading-[70px] text-brand-50">
					Ship documentation,
					<br />
					like you ship code
				</h1>
				<h2 className="text-center text-brand-100">
					Meet the docs as code playform made for open-source developers.
				</h2>
				<p className="text-center text-brand-100 font-light">
					Publish beautiful online documentation instantly, from your code
					editor using markdown and a public GitHub repository.
				</p>
				<div className="flex justify-center gap-6">
					<a
						href="/"
						className="inline-flex items-center gap-3 bg-brand-400/5 outline outline-brand-400/5 outline-offset-4 outline-1 rounded-full px-8 py-3"
					>
						<span>Get Started</span>
						<ChevronRightIcon size={18} />
					</a>
					<a
						href="/"
						className="inline-flex items-center gap-3 rounded-full px-8 py-3"
					>
						<span>Documentation</span>
						<ChevronRightIcon size={18} />
					</a>
				</div>
			</section>
			<section className="max-w-5xl mx-auto pt-32">
				<div className="h-[560px] outline outline-[12px] outline-brand-400/10 rounded-md" />
			</section>
			<section className="max-w-5xl mx-auto py-16 space-y-6 text-center">
				<p className="flex justify-center gap-3 items-center">
					<HeartIcon size={18} />
					<span>Loved by the Dart & Flutter Community!</span>
				</p>
				<p className="font-light">
					Trusted by more than 75,000 open-source developers
				</p>
				<div className="flex items-center justify-center gap-6">
					<div>Logo</div>
					<div>Logo</div>
					<div>Logo</div>
					<div>Logo</div>
				</div>
			</section>
			<section className="max-w-5xl mx-auto py-32 space-y-6">
				<p className="flex items-center justify-center gap-3 text-brand-100">
					<BookTextIcon size={18} />
					<span>The documentation platform for open-source developers</span>
				</p>
				<h3 className="text-brand-100 text-5xl text-center leading-[3.5rem]">
					Documentation, made simple
				</h3>
				<p className="text-brand-100 font-light text-center">
					The easiest way to maintain open-source documentation
				</p>
				<div>
					<div className="grid grid-cols-3 gap-3">
						<InfoCard
							title="Manage Docs as Code"
							description="Manage docs like your codebase, with branching, version
                  control, reviews, and testing."
						/>
						<InfoCard
							title="Publish Instantly"
							description="Create fully managed documentation sites in seconds, without complex setup."
						/>
						<InfoCard
							title="Collaborate with Live Preview"
							description="Write in Markdown and see your changes in real-time. Share previews easily for feedback."
						/>
					</div>
					<div className="grid grid-cols-6 justify-around gap-3 mt-3">
						<div className="col-start-2 col-end-4">
							<InfoCard
								title="Beautiful by Design"
								description="Publish visually stunning, responsive documentation sites straight out of the box."
							/>
						</div>
						<div className="col-start-4 col-end-6">
							<InfoCard
								title="Customise and Theme"
								description="Add rich, interactive components, use custom domains, and tailor to match your brand."
							/>
						</div>
					</div>
				</div>
			</section>
			<section className="max-w-5xl mx-auto py-32 space-y-6">
				<p className="flex items-center gap-3 justify-center">
					<Grid2X2Icon size={18} />
					<span>Features</span>
				</p>
				<h3 className="text-brand-100 text-5xl text-center leading-[3.5rem]">
					Everything needed to
					<br />
					publish great documentation
				</h3>
				<p className="font-light text-brand-50 text-center">
					Built to improve developer experience
				</p>
				<div className="grid grid-cols-3 border-white/5 border-t border-l border-b">
					<FeatureCard
						icon={<div />}
						title="Seamless GitHub Integration"
						description="Source your docs directly from your GitHub repositories for easy updates."
						className="border-b"
					/>
					<FeatureCard
						icon={<div />}
						title="Editing"
						description="Editing workflow built into where you work."
						className="border-b"
					/>
					<FeatureCard
						icon={<div />}
						title="Local Preview & Hot Reload"
						description="See your changes instantly as you type, streamlining your workflow."
						className="border-b"
					/>
					<FeatureCard
						icon={<div />}
						title="Markdown-Powered"
						description="Write your documentation in the simple and intuitive Markdown format."
						className="border-b"
					/>
					<FeatureCard
						icon={<div />}
						title="Pre-Built Components"
						description="Add code blocks, alerts, tabs, videos, and more with ease."
						className="border-b"
					/>
					<FeatureCard
						icon={<div />}
						title="Preview Deployments"
						description="Review and share your changes before they go live."
						className="border-b"
					/>
					<FeatureCard
						icon={<div />}
						title="Custom Domains & Themes"
						description="Make your docs truly your own with a personalised domain, look and feel."
						className="border-b"
					/>
					<FeatureCard
						icon={<div />}
						title="Custom Domains & Themes"
						description="Make your docs truly your own with a personalised domain, look and feel."
						className="border-b"
					/>
					<FeatureCard
						icon={<div />}
						title="Powerful Search"
						description="Help users find information quickly with configurable search functionality."
						className="border-b"
					/>
					<FeatureCard
						icon={<div />}
						title="Documentation Analytics"
						description="Understand what users are viewing using Google Analytics or Plausible."
						className="border-b"
					/>
					<div className="border-r border-white/5" />
					<div className="border-r border-white/5" />
				</div>
			</section>
			<section className="max-w-5xl mx-auto py-16 space-y-6">
				<p className="flex items-center gap-3 justify-center">
					<ShieldCheckIcon size={18} />
					<span>Trusted by developers</span>
				</p>
				<h3 className="text-brand-100 text-5xl text-center leading-[3.5rem]">
					See why developers use docs.page
				</h3>
				<p className="font-light text-brand-50 text-center">
					Built for the open-source community
				</p>
				<div>TODO Testimonial grid</div>
			</section>
			<section className="max-w-5xl mx-auto py-16 space-y-6">
				<p className="flex items-center gap-3 justify-center">
					<HandshakeIcon size={18} />
					<span>Free to use</span>
				</p>
				<h3 className="text-brand-100 text-5xl text-center leading-[3.5rem]">
					What are you waiting for?
				</h3>
				<p className="text-brand-10 text-center">
					Begin publishing great documentation today.
				</p>
			</section>
			<footer className="max-w-3xl mx-auto grid grid-cols-2 py-12">
				<div className="flex justify-end border-r border-white/10 pr-12">
					docs.page
				</div>
				<div className="pl-12">Copyright</div>
			</footer>
		</>
	);
}
