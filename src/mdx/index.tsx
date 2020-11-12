import React, { useContext } from "react";

import { Link } from "../components/Link";
import Foo from "./Foo";

export default {
  // Override the default anchor tag
  a: (props: React.HTMLProps<HTMLAnchorElement>): React.ReactNode => (
    <Link {...props} />
  ),
  Foo,
};
