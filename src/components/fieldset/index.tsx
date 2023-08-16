import { ReactNode } from "react";

import cs from "./fieldset.module.css";
import cx from "../../helpers/cx";

type Props = { className?: string; children: ReactNode };
const Fieldset = ({ className, children }: Props): JSX.Element => {
  return <fieldset className={cx(cs.fieldset, className)}>{children}</fieldset>;
};

export default Fieldset;
