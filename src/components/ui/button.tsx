import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import "./button.css";

type ButtonVariant = "primary" | "secondary";

const BASE_CLASSNAME = "buttonBase";

const VARIANT_CLASSNAMES: Record<ButtonVariant, string> = {
  primary: "buttonPrimary",
  secondary: "buttonSecondary",
};

export const buttonVariants = (variant: ButtonVariant = "primary") =>
  `${BASE_CLASSNAME} ${VARIANT_CLASSNAMES[variant]}`;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", children, ...props }, ref) => {
    const nextClassName = `${buttonVariants(variant)} ${className}`.trim();

    return (
      <button ref={ref} className={nextClassName} {...props}>
        <span className="buttonLabel">{children}</span>

        {variant === "primary" && (
          <span className="buttonIcon" aria-hidden="true">
            <ArrowUpRight size={16} />
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
