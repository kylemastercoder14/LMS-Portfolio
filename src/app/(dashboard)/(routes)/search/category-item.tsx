"use client";

import React from "react";
import { IconType } from "react-icons";
import { cn } from "../../../../lib/utils";

const CategoryItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  icon?: IconType;
  value?: string;
}) => {
  return (
    <button
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-2 hover:border-sky-700 transition"
      )}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
};

export default CategoryItem;
