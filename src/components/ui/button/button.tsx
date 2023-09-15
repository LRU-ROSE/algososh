import React, { useMemo } from "react";
import styles from "./button.module.css";
import loaderIcon from "../../../images/icons/loader.svg";
import { AscendingIcon } from "../icons/ascending-icon";
import { DescendingIcon } from "../icons/descending-icon";
import { Direction } from "../../../types/direction";
import cx from "../../../helpers/cx";

export const enum ErrorDisable {
  None,
  FieldsetError,
  FormError,
}

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  text?: string;
  type?: "button" | "submit" | "reset";
  sorting?: Direction;
  linkedList?: "small" | "big";
  isLoader?: boolean;
  extraClass?: string;
  errorDisable?: ErrorDisable;
  testId?: string;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  extraClass = "",
  type = "button",
  isLoader = false,
  sorting,
  errorDisable = ErrorDisable.FieldsetError,
  linkedList,
  disabled,
  testId,
  ...rest
}) => {
  const currentIcon =
    sorting === Direction.Ascending ? <AscendingIcon /> : <DescendingIcon />;
  const className = useMemo(() => {
    let errorClass;
    switch (errorDisable) {
      case ErrorDisable.None:
        errorClass = null;
        break;
      case ErrorDisable.FieldsetError:
        errorClass = styles.buttonDisableFieldsetError;
        break;
      case ErrorDisable.FormError:
        errorClass = styles.buttonDisableFormError;
        break;
    }
    return cx(
      "text text_type_button text_color_primary",
      styles.button,
      linkedList && styles[linkedList],
      isLoader && styles.loader,
      errorClass,
      extraClass
    );
  }, [linkedList, isLoader, errorDisable, extraClass]);

  return (
    <button
      className={className}
      type={type}
      disabled={isLoader || disabled}
      data-testid={testId}
      {...rest}
    >
      {isLoader ? (
        <img className={styles.loader_icon} src={loaderIcon} alt="Загрузка." />
      ) : (
        <>
          {sorting && currentIcon}
          <p className={cx('text', sorting && "ml-5")}>{text}</p>
        </>
      )}
    </button>
  );
};
