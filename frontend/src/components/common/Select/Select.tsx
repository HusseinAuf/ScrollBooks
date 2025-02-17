import React from "react";

interface SelectProps {
  children: React.ReactNode;
  value?: any;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: any) => void;
}
const Select: React.FC<SelectProps> = ({
  children,
  value,
  className = "",
  style = {},
  onChange,
}) => {
  const baseClassName =
    "appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-mediumBlue focus:border-6 cursor-pointer";
  className = baseClassName + " " + className;
  return (
    <select
      value={value}
      className={className}
      style={style}
      onChange={onChange}
    >
      {children}
    </select>
  );
};
export default Select;
