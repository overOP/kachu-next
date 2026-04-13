"use client";

import React from "react";

interface ActivityItemProps {
  icon: React.ElementType;
  iconBgColor: string;
  title: string;
  time: string;
}

const ActivityItem = ({
  icon: Icon,
  iconBgColor,
  title,
  time,
}: ActivityItemProps) => (
  <div className="flex gap-4 items-start">
    <div
      className={`${iconBgColor} p-2.5 rounded-xl flex items-center justify-center shrink-0`}
    >
      <Icon size={18} className="text-gray-800" />
    </div>
    <div className="flex flex-col">
      <p className="text-sm font-semibold text-gray-800 leading-tight">
        {title}
      </p>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  </div>
);

export default ActivityItem;
