import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import { useLocale, usePageContext } from "~/context";
import { Link } from "./Link";

export function Locale() {
  const ctx = usePageContext();
  const locale = useLocale();

  if (!locale || ctx.bundle.config.locales.length === 0) {
    return null;
  }

  if (locale && !iso639LanguageCodes[locale]) {
    return null;
  }

  return (
    <div>
      <Menu>
        <MenuButton className="flex items-center gap-1.5 bg-gray-200/60 hover:bg-gray-200/80 dark:bg-white/10 hover:dark:bg-white/20 transition-all rounded-full pl-4 pr-3 py-1.5 text-xs font-bold">
          <span>{iso639LanguageCodes[locale]}</span>
          <ChevronDownIcon size={12} />
        </MenuButton>
        <Transition
          enter="transition ease-out duration-75"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <MenuItems
            anchor="bottom end"
            className="z-30 w-48 mt-2 origin-top-right rounded-xl border border-black/10 dark:border-white/10 bg-background shadow focus:outline-none space-y-1 p-1 max-h-[400px] overflow-y-auto"
          >
            {ctx.bundle.config.locales
              .filter((locale) => !!iso639LanguageCodes[locale])
              .map((locale) => (
                <MenuItem key={locale}>
                  <Link
                    href={`/${locale}`}
                    ignoreLocale
                    className="flex w-full rounded-lg hover:bg-black/5 hover:dark:bg-white/5 px-3 py-1.5 text-sm"
                  >
                    {iso639LanguageCodes[locale]}
                  </Link>
                </MenuItem>
              ))}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

const iso639LanguageCodes: Record<string, string> = {
  ab: "Abkhazian",
  aa: "Afar",
  af: "Afrikaans",
  ak: "Akan",
  sq: "Albanian",
  am: "Amharic",
  ar: "Arabic",
  an: "Aragonese",
  hy: "Armenian",
  as: "Assamese",
  av: "Avaric",
  ae: "Avestan",
  ay: "Aymara",
  az: "Azerbaijani",
  bm: "Bambara",
  ba: "Bashkir",
  eu: "Basque",
  be: "Belarusian",
  bn: "Bengali",
  bh: "Bihari",
  bi: "Bislama",
  bs: "Bosnian",
  br: "Breton",
  bg: "Bulgarian",
  my: "Burmese",
  ca: "Catalan",
  ch: "Chamorro",
  ce: "Chechen",
  ny: "Chichewa",
  zh: "Chinese",
  cu: "Church Slavic",
  cv: "Chuvash",
  kw: "Cornish",
  co: "Corsican",
  cr: "Cree",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  dv: "Divehi",
  nl: "Dutch",
  dz: "Dzongkha",
  en: "English",
  eo: "Esperanto",
  et: "Estonian",
  ee: "Ewe",
  fo: "Faroese",
  fj: "Fijian",
  fi: "Finnish",
  fr: "French",
  fy: "Western Frisian",
  ff: "Fulah",
  gd: "Gaelic",
  gl: "Galician",
  lg: "Ganda",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gn: "Guarani",
  gu: "Gujarati",
  ht: "Haitian",
  ha: "Hausa",
  he: "Hebrew",
  hz: "Herero",
  hi: "Hindi",
  ho: "Hiri Motu",
  hu: "Hungarian",
  is: "Icelandic",
  io: "Ido",
  ig: "Igbo",
  id: "Indonesian",
  ia: "Interlingua",
  ie: "Interlingue",
  iu: "Inuktitut",
  ik: "Inupiaq",
  ga: "Irish",
  it: "Italian",
  ja: "Japanese",
  jv: "Javanese",
  kl: "Kalaallisut",
  kn: "Kannada",
  kr: "Kanuri",
  ks: "Kashmiri",
  kk: "Kazakh",
  km: "Central Khmer",
  ki: "Kikuyu",
  rw: "Kinyarwanda",
  ky: "Kirghiz",
  kv: "Komi",
  kg: "Kongo",
  ko: "Korean",
  kj: "Kuanyama",
  ku: "Kurdish",
  lo: "Lao",
  la: "Latin",
  lv: "Latvian",
  li: "Limburgan",
  ln: "Lingala",
  lt: "Lithuanian",
  lu: "Luba-Katanga",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mg: "Malagasy",
  ms: "Malay",
  ml: "Malayalam",
  mt: "Maltese",
  gv: "Manx",
  mi: "Maori",
  mr: "Marathi",
  mh: "Marshallese",
  ro: "Moldavian",
  mn: "Mongolian",
  na: "Nauru",
  nv: "Navajo",
  nd: "North Ndebele",
  ng: "Ndonga",
  ne: "Nepali",
  no: "Norwegian",
  nb: "Norwegian Bokmål",
  nn: "Norwegian Nynorsk",
  ii: "Sichuan Yi",
  nr: "South Ndebele",
  oc: "Occitan",
  oj: "Ojibwa",
  or: "Oriya",
  om: "Oromo",
  os: "Ossetian",
  pi: "Pali",
  pa: "Panjabi",
  ps: "Pashto",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  qu: "Quechua",
  rm: "Romansh",
  rn: "Rundi",
  ru: "Russian",
  se: "Northern Sami",
  sm: "Samoan",
  sg: "Sango",
  sa: "Sanskrit",
  sc: "Sardinian",
  sr: "Serbian",
  sn: "Shona",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  st: "Southern Sotho",
  es: "Spanish",
  su: "Sundanese",
  sw: "Swahili",
  ss: "Swati",
  sv: "Swedish",
  tl: "Tagalog",
  ty: "Tahitian",
  tg: "Tajik",
  ta: "Tamil",
  tt: "Tatar",
  te: "Telugu",
  th: "Thai",
  bo: "Tibetan",
  ti: "Tigrinya",
  to: "Tonga",
  ts: "Tsonga",
  tn: "Tswana",
  tr: "Turkish",
  tk: "Turkmen",
  tw: "Twi",
  ug: "Uighur",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  ve: "Venda",
  vi: "Vietnamese",
  vo: "Volapük",
  wa: "Walloon",
  cy: "Welsh",
  wo: "Wolof",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  za: "Zhuang",
  zu: "Zulu",
};
