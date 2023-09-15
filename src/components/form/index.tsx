import { FormEvent, ReactNode, useCallback } from "react";

import cs from "./form.module.css";
import cx from "../../helpers/cx";
import useLatestRef from "../../helpers/useLatestRef";

type Props = { className?: string; onSubmit?: (submitEl: HTMLElement | null) => void; children: ReactNode };
const Form = ({ className, onSubmit, children }: Props): JSX.Element => {
  const lastOnSubmit = useLatestRef(onSubmit);
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    lastOnSubmit.current?.((e.nativeEvent as SubmitEvent).submitter);
  }, [lastOnSubmit]);
  return (
    <form className={cx(cs.form, className)} onSubmit={handleSubmit} data-type="form">
      {children}
    </form>
  );
};

export default Form;
