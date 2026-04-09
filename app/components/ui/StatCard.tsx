'use client';
import React from "react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  badgeText: string;
  badgeVariant: "green" | "blue" | "yellow";
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  badgeText,
  badgeVariant,
}: StatCardProps) => {
  const badgeColors = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 w-full">
      <div className="flex justify-between items-start">
        <div className="bg-gray-100 p-3 rounded-2xl">
          <Icon className="text-gray-700" size={24} />
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-md ${badgeColors[badgeVariant]}`}
        >
          {badgeText}
        </span>
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};
export default StatCard;