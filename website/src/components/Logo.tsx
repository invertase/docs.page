import Image from "next/image";
import { useAssetSrc, usePageContext } from "~/context";
import { isExternalLink } from "~/utils";

function LogoImage(props: {
  src: string;
  alt: string;
  className: string;
  /** User-configured external logo URL (any host); next/image cannot list every remotePatterns entry. */
  useNativeImg: boolean;
}) {
  if (props.src === "") {
    return null;
  }

  if (
    props.useNativeImg ||
    props.src.startsWith("blob:") ||
    props.src.startsWith("data:")
  ) {
    return (
      // biome-ignore lint/performance/noImgElement: arbitrary external or blob/data preview URLs
      <img src={props.src} alt={props.alt} className={props.className} />
    );
  }

  return (
    <Image
      src={props.src}
      alt={props.alt}
      width={240}
      height={24}
      className={props.className}
      unoptimized
    />
  );
}

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
        <LogoImage
          className={`relative block h-6 w-auto ${
            hasDarkLogo ? "dark:hidden" : ""
          }`}
          src={lightLogoSrc}
          alt="Light logo"
          useNativeImg={isExternalLink(logo?.light ?? "")}
        />
      )}
      {hasDarkLogo && (
        <LogoImage
          className={`relative h-6 w-auto ${
            hasLightLogo ? "hidden dark:block" : "block"
          }`}
          src={darkLogoSrc}
          alt="Dark logo"
          useNativeImg={isExternalLink(logo?.dark ?? "")}
        />
      )}
    </>
  );
}
