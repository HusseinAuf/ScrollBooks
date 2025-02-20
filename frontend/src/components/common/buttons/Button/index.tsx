import React from "react";
import clsx from "clsx";

interface ButtonProps {
  onClick?: (e: any) => void;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
const Button: React.FC<ButtonProps> = ({
  onClick,
  className = "",
  children = "",
  style = {},
  type = "button",
  disabled = false,
  icon: Icon,
}) => {
  const baseClassName = `text-sm w-fit py-3 px-5 hover:shadow-lg text-white font-bold rounded-full transition-all duration-300 ${
    disabled ? "bg-darkBlue" : "bg-mediumBlue"
  }`;
  // className = baseClassName + " " + className;
  className = clsx(baseClassName, className);
  return (
    <button
      onClick={onClick}
      className={className}
      style={style}
      type={type}
      disabled={disabled}
    >
      <div className="flex gap-3 justify-center items-center">
        {Icon && <Icon />}
        {children}
      </div>
    </button>
  );
};
export default Button;
