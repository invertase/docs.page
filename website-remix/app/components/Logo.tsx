import { usePageContext } from '~/context';
import { getImageSrc } from '~/utils';

export function Logo() {
  const ctx = usePageContext();
  const logo = ctx.bundle.config.logo;

  const hasLightLogo = Boolean(logo?.light);
  const hasDarkLogo = Boolean(logo?.dark);

  return (
    <span>
      {!ctx.preview && (
        <span className="sr-only">
          {ctx.owner}/{ctx.repository}
        </span>
      )}
      {hasLightLogo && (
        <img
          className={`relative block h-6 w-auto ${hasDarkLogo ? 'dark:hidden' : ''}`}
          src={getImageSrc(ctx, logo!.light!)}
          alt={`Light logo`}
        />
      )}
      {hasDarkLogo && (
        <img
          className={`relative h-6 w-auto ${hasLightLogo ? 'hidden dark:block' : 'block'}`}
          src={getImageSrc(ctx, logo!.dark!)}
          alt={`Dark logo`}
        />
      )}
    </span>
  );
}
