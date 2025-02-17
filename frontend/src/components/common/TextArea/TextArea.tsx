import React from "react";

interface TextAreaProps {
  value: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
}
const TextArea: React.FC<TextAreaProps> = ({
  value,
  className = "",
  style = {},
  onChange,
  placeholder = "",
  rows = 3,
}) => {
  const baseClassName =
    "text-sm appearance-none w-full bg-white border border-gray-300 text-gray-700 p-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-mediumBlue focus:border-6";
  className = baseClassName + " " + className;
  return (
    <textarea
      value={value}
      onChange={onChange}
      className={className}
      style={style}
      placeholder={placeholder}
      rows={rows}
    />
  );
};
export default TextArea;
