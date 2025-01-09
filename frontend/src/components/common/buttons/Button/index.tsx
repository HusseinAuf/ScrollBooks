import React from "react";

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
  return (
    <button
      onClick={onClick}
      className={`text-md w-fit py-3 px-5 bg-mediumBlue hover:shadow-lg text-white font-bold rounded-full transition-all duration-300 ${className}`}
      style={{
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
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
