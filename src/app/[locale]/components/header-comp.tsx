import React from "react";
import { IconType } from "react-icons";

export interface HeaderCLProps {
  icon?: IconType;
  title: string;
  description?: string;
  iconSize?: number;
  iconStrokeWidth?: number;
  content?: React.ReactNode;
  titleDropDown?: React.ReactNode;
}

export function HeaderCL({
  icon: Icon,
  title,
  description,
  iconSize = 7,
  iconStrokeWidth,
  content,
  titleDropDown,
}: HeaderCLProps) {
  return (
    <div className="w-[600px] max-w-[95%] mb-5 relative">
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className={`w-${iconSize} h-${iconSize}`} />}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {titleDropDown && titleDropDown}
      </div>
      {description && <p className="text-gray-600">{description}</p>}
      {content && content}
    </div>
  );
}
