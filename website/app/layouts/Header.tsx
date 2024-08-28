import { Link, NavLink } from "@remix-run/react";
import { ChevronRightIcon } from "lucide-react";
import { Icon } from "~/components/Icon";

export function Header() {
  return (
    <header className="max-w-5xl mx-auto py-8 px-3 flex flex-col sm:flex-row gap-6 items-center">
      <Link to="/" className="group flex items-center gap-3">
        <img src="/logo.png" alt="docs.page logo" className="h-6" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="87"
          height="18"
          fill="none"
          className="relative top-[2px] transition-opacity"
        >
          <title>Logo</title>
          <path
            fill="white"
            d="M5.496 14.234C2.922 14.234.87 12.056.87 9.356s2.052-4.914 4.626-4.914c1.602 0 2.448.648 2.952 1.638V.86h2.43V14H8.52v-1.53c-.504 1.062-1.35 1.764-3.024 1.764ZM3.3 9.338c0 1.422 1.044 2.7 2.592 2.7 1.602 0 2.628-1.224 2.628-2.682S7.494 6.638 5.892 6.638c-1.548 0-2.592 1.242-2.592 2.7Zm13.648 4.896c-2.898 0-4.986-2.196-4.986-4.896 0-2.7 2.088-4.914 4.986-4.914 2.898 0 4.986 2.214 4.986 4.914 0 2.7-2.088 4.896-4.986 4.896Zm-2.556-4.896c0 1.458 1.008 2.682 2.556 2.682s2.556-1.224 2.556-2.682-1.008-2.7-2.556-2.7-2.556 1.242-2.556 2.7Zm12.993 4.896c-2.682 0-4.824-2.196-4.824-4.914 0-2.718 2.088-4.896 4.95-4.914 1.71-.018 3.096.648 3.888 1.746l-1.872 1.53a2.361 2.361 0 0 0-1.98-1.062c-1.548 0-2.556 1.242-2.556 2.7 0 1.458 1.062 2.7 2.61 2.7.936 0 1.548-.468 2.034-1.116l1.764 1.53c-.882 1.134-2.178 1.8-4.014 1.8Zm8.18 0c-1.584 0-2.862-.54-3.888-1.638l1.638-1.494c.684.774 1.404 1.152 2.196 1.152.828 0 1.296-.414 1.296-.972 0-.486-.234-.756-1.71-1.098-2.502-.594-2.88-1.728-2.88-2.916 0-1.638 1.296-2.862 3.492-2.862 1.512 0 2.52.378 3.474 1.62l-1.764 1.35c-.45-.72-1.026-1.008-1.656-1.008-.666 0-1.17.252-1.17.828 0 .324.144.612 1.26.9 2.718.702 3.348 1.71 3.348 3.114 0 1.728-1.566 3.024-3.636 3.024Zm8.38 3.366V4.64h2.394v1.512c.504-1.026 1.35-1.71 2.988-1.71 2.574 0 4.626 2.214 4.626 4.914 0 2.7-2.052 4.878-4.626 4.878-1.602 0-2.448-.648-2.952-1.62V17.6h-2.43Zm2.358-8.244c0 1.458 1.026 2.682 2.628 2.682 1.548 0 2.592-1.278 2.592-2.7 0-1.458-1.044-2.7-2.592-2.7-1.602 0-2.628 1.26-2.628 2.718Zm12.912 4.878c-2.575 0-4.627-2.178-4.627-4.878s2.053-4.914 4.627-4.914c1.62 0 2.465.666 2.97 1.674V4.64h2.412V14h-2.358v-1.53c-.505 1.062-1.35 1.764-3.024 1.764Zm-2.197-4.896c0 1.422 1.044 2.7 2.593 2.7 1.602 0 2.628-1.224 2.628-2.682s-1.026-2.718-2.628-2.718c-1.548 0-2.592 1.242-2.592 2.7Zm13.576 8.496c-1.89 0-3.366-.45-4.482-1.764l1.512-1.782c.882 1.008 1.818 1.296 2.988 1.296 1.296 0 2.43-1.062 2.43-2.556v-.414c-.504.864-1.314 1.44-2.826 1.44-2.574 0-4.536-2.124-4.536-4.824 0-2.7 1.962-4.824 4.536-4.824 1.548 0 2.376.594 2.862 1.512V4.64h2.394v8.532c0 2.88-2.016 4.662-4.878 4.662ZM68.11 9.23c0 1.422.918 2.61 2.502 2.61 1.602 0 2.538-1.152 2.538-2.61s-.936-2.61-2.538-2.61c-1.584 0-2.502 1.152-2.502 2.61Zm13.276 5.004c-2.898 0-4.842-2.196-4.842-4.896 0-2.7 2.034-4.932 4.842-4.932s4.752 2.232 4.752 4.932c0 .27-.018.558-.072.864h-7.002c.27 1.098 1.098 1.872 2.322 1.872 1.044 0 1.854-.54 2.286-1.26l1.89 1.422c-.756 1.17-2.322 1.998-4.176 1.998Zm-2.322-5.85h4.626c-.27-1.044-1.152-1.89-2.34-1.89-1.152 0-2.016.774-2.286 1.89ZM41.233 14.234c-.936 0-1.62-.72-1.62-1.584 0-.846.684-1.566 1.62-1.566s1.602.72 1.602 1.566c0 .864-.666 1.584-1.602 1.584Z"
          />
          <path
            fill="#ECC918"
            d="M41.233 14.234c-.936 0-1.62-.72-1.62-1.584 0-.846.684-1.566 1.62-1.566s1.602.72 1.602 1.566c0 .864-.666 1.584-1.602 1.584Z"
          />
        </svg>
      </Link>
      <div className="grow flex justify-end gap-3">
        <ul className="flex items-center gap-3 md:gap-6 text-sm font-medium tracking-wide">
          <li>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/invertase/docs.page"
              className="hover:opacity-75 transition-opacity"
            >
              <span className="hidden md:flex items-center gap-1">
                <span>GitHub</span>
                <ChevronRightIcon size={16} className="inline" />
              </span>
              <Icon name="book" className="md:hidden text-2xl" />
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://use.docs.page"
              className="flex items-center gap-1 hover:opacity-75 transition-opacity"
            >
              <span className="hidden md:flex items-center gap-1">
                <span>Documentation</span>
                <ChevronRightIcon size={16} className="inline" />
              </span>
              <Icon name="github" className="md:hidden text-2xl" />
            </a>
          </li>
          <li>
            <NavLink
              to="/preview"
              className="flex items-center gap-1 hover:opacity-75 transition-opacity border border-brand-50/90 px-4 py-1.5 rounded-full"
            >
              <span className="flex items-center gap-1">
                <span>Local Preview</span>
                <ChevronRightIcon size={16} className="inline" />
              </span>
            </NavLink>
          </li>
        </ul>
        {/* <div className="border rounded-md py-3 px-2">
          <p>DEVELOPER EXPERIENCE BY</p>
          <div>INVERTASE</div>
        </div> */}
      </div>
    </header>
  );
}
