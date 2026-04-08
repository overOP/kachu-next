"use client";
import { Plus } from "lucide-react";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
}

const ActionButton = ({ label, onClick }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 bg-[#55c56e] text-white px-5 py-2.5 rounded-xl hover:bg-[#45a85c] transition-all font-medium text-sm shadow-md shadow-green-200"
  >
    <Plus size={18} strokeWidth={3} />
    {label}
  </button>
);

export default ActionButton;
