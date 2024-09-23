import { useEffect, useState } from "react";
import { cn } from "~/utils";

type Props = {
  fadeInMs?: number;
};

export function HeroGradient(props: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (props.fadeInMs) {
      const timeout = setTimeout(() => {
        setReady(true);
      }, props.fadeInMs);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [props.fadeInMs]);

  return (
    <svg
      viewBox="0 0 1499 1676"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "absolute left-0 right-0 top-0 lg:top-[-30px] xl:top-[-80px] 2xl:top-[-180px] z-[-1] transition-opacity duration-1000",
        {
          "opacity-50": !ready,
          "opacity-100": ready,
        },
      )}
    >
      <title>Background Gradient</title>
      <g clipPath="url(#clip0_209_493)">
        <mask
          id="mask0_209_493"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1499"
          height="1676"
        >
          <path
            d="M1465.5 0H33.4972C14.9972 0 0 15.0074 0 33.52V1642.48C0 1660.99 14.9972 1676 33.4972 1676H1465.5C1484 1676 1499 1660.99 1499 1642.48V33.52C1499 15.0074 1484 0 1465.5 0Z"
            fill="url(#paint0_linear_209_493)"
          />
        </mask>
        <g mask="url(#mask0_209_493)">
          <path
            d="M1465.5 0H33.4972C14.9972 0 0 15.0074 0 33.52V1642.48C0 1660.99 14.9972 1676 33.4972 1676H1465.5C1484 1676 1499 1660.99 1499 1642.48V33.52C1499 15.0074 1484 0 1465.5 0Z"
            fill="#F7E9A3"
            fillOpacity="0.02"
          />
          <g filter="url(#filter0_f_209_493)">
            <path
              d="M1329.42 292.253H169.579C151.079 292.253 136.082 307.26 136.082 325.773V1293.66C136.082 1312.18 151.079 1327.18 169.579 1327.18H1329.42C1347.92 1327.18 1362.92 1312.18 1362.92 1293.66V325.773C1362.92 307.26 1347.92 292.253 1329.42 292.253Z"
              fill="url(#paint1_linear_209_493)"
              fillOpacity="0.24"
            />
          </g>
          <g filter="url(#filter1_f_209_493)">
            <path
              d="M389.332 644.294C372.92 622.177 388.696 590.79 416.225 590.79H1083.76C1111.1 590.79 1126.93 621.807 1110.89 643.97L851.647 1002.21C845.347 1010.92 835.258 1016.08 824.516 1016.08H682.081C671.481 1016.08 661.508 1011.06 655.188 1002.54L389.332 644.294Z"
              fill="url(#paint2_linear_209_493)"
              fillOpacity="0.72"
            />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_209_493"
          x="-136.264"
          y="19.9061"
          width="1771.53"
          height="1579.62"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="136.173"
            result="effect1_foregroundBlur_209_493"
          />
        </filter>
        <filter
          id="filter1_f_209_493"
          x="131.271"
          y="339.393"
          width="1237.44"
          height="928.078"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="125.698"
            result="effect1_foregroundBlur_209_493"
          />
        </filter>
        <linearGradient
          id="paint0_linear_209_493"
          x1="749.5"
          y1="0"
          x2="749.5"
          y2="1676"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" />
          <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_209_493"
          x1="136.082"
          y1="292.253"
          x2="1362.92"
          y2="292.253"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ECB418" />
          <stop offset="0.5" stopColor="#F9EFBA" />
          <stop offset="1" stopColor="#ECC918" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_209_493"
          x1="349.627"
          y1="590.79"
          x2="1149.37"
          y2="590.79"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ECC918" />
          <stop offset="0.5" stopColor="#F9EFBA" />
          <stop offset="1" stopColor="#ECB418" />
        </linearGradient>
        <clipPath id="clip0_209_493">
          <rect width="1499" height="1676" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
