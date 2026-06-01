import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocHref } from "@/hooks/use-doc-href";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useLocale } from "@/hooks/use-locale";
import { useRouter } from "next/router";
import { Link } from "./doc-link";

export function LocaleSwitcher() {
  const ctx = useDocPageContext();
  const locale = useLocale();
  const router = useRouter();

  if (!locale || ctx.bundle.config.locales.length === 0) {
    return null;
  }

  if (locale && !iso639LanguageCodes[locale]) {
    return null;
  }

  return (
    <div className="px-3">
      <Select
        value={locale}
        onValueChange={(value) => {
          router.push(value);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>Select a language</SelectLabel>
            {ctx.bundle.config.locales
              .filter((locale) => !!iso639LanguageCodes[locale])
              .map((locale) => (
                <SelectLocaleItem key={locale} locale={locale} />
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function SelectLocaleItem({ locale }: { locale: string }) {
  const href = useDocHref(`/${locale}`);

  return <SelectItem value={href}>{iso639LanguageCodes[locale]}</SelectItem>;
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
