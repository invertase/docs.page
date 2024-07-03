import { useAssetSrc, usePageContext } from "~/context";

export function Logo() {
	const ctx = usePageContext();
	const logo = ctx.bundle.config.logo;
	const lightLogoSrc = useAssetSrc(logo?.light ?? "");
	const darkLogoSrc = useAssetSrc(logo?.dark ?? "");

	const hasLightLogo = Boolean(logo?.light);
	const hasDarkLogo = Boolean(logo?.dark);

	return (
		<>
			{!ctx.preview && (
				<span className="sr-only">
					{ctx.owner}/{ctx.repository}
				</span>
			)}
			{hasLightLogo && (
				<img
					className={`relative block h-6 w-auto ${
						hasDarkLogo ? "dark:hidden" : ""
					}`}
					src={lightLogoSrc}
					alt="Light logo"
				/>
			)}
			{hasDarkLogo && (
				<img
					className={`relative h-6 w-auto ${
						hasLightLogo ? "hidden dark:block" : "block"
					}`}
					src={darkLogoSrc}
					alt="Dark logo"
				/>
			)}
		</>
	);
}
