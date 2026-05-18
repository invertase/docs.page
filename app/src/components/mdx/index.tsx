import { Accordion, AccordionGroup } from "./accordion";
import { Info, Success, Warning, Error } from "./callout";
import { Card, CardGroup } from "./card";
import { CodeGroup } from "./code-group";
import { Heading } from "./heading";
import { Image } from "./image";
import { Property } from "./property";
import { Step, Steps } from "./steps";
import { Tweet } from "./tweet";
import { Video } from "./video";
import { Vimeo } from "./vimeo";
import { YouTube } from "./youtube";

export const components = {
  accordion: Accordion,
  "accordion-group": AccordionGroup,
  info: Info,
  warning: Warning,
  error: Error,
  success: Success,
  card: Card,
  "card-group": CardGroup,
  "code-group": CodeGroup,
  heading: Heading,
  // image: Image,
  property: Property,
  steps: Steps,
  step: Step,
  tabs: () => <div>TABS!</div>,
  "tab-item": () => <div>TABITEM!</div>,
  tweet: Tweet,
  x: Tweet,
  video: Video,
  vimeo: Vimeo,
  youtube: YouTube,
};
