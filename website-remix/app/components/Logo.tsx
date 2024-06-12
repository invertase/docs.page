import { usePageContext } from "../context";

export function Logo() {
  const { owner, repository, bundle } = usePageContext();
  const logo = bundle.config.logo;

  const hasLightLogo = Boolean(logo?.light);
  const hasDarkLogo = Boolean(logo?.dark);

  return (
    <a href={logo?.href || '/'}>
      <span className="sr-only">
        {owner}/{repository}
      </span>
      {!hasLightLogo && !hasDarkLogo && (
        <span className="text-2xl font-bold">
          {owner}/{repository}
        </span>
      )}
      {hasLightLogo && (
        <img
          className={`w-auto h-7 relative block ${hasDarkLogo ? 'dark:hidden' : ''}`}
          src={logo!.light!}
          alt={`${owner}/${repository} Light logo`}
        />
      )}
      {hasDarkLogo && (
        <img
          className={`w-auto h-7 relative ${hasLightLogo ? 'hidden dark:block' : 'block'}`}
          src={logo!.dark!}
          alt={`${owner}/${repository} Dark logo`}
        />
      )}
    </a>
  );
}