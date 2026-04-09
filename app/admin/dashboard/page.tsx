"use client";

import { useState } from "react";
import { Factory, Package, Pencil, Plus, Shapes } from "lucide-react";
import StatCard from "@/app/components/ui/StatCard";
import ActionButton from "@/app/components/ui/Button";
import CategoryDetails from "@/app/components/ui/Category";
import ActivityItem from "@/app/components/ui/RecentActivity";
import Modal, { ModalType } from "@/app/components/Modal";

export default function Dashboard() {
  const [modalType, setModalType] = useState<ModalType | null>(null);

  return (
    <div className="flex flex-col gap-8 w-full">
      <section className="bg-[#004d3d] text-white rounded-[2rem] shadow-xl p-6 md:p-10 min-h-[220px]">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Welcome Back, Ishan Awasthi
          </h2>
          <p className="text-white/85 text-lg md:text-xl font-medium">
            Dashboard Overview - Tracking your enterprise performance for today
          </p>
        </div>
      </section>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatCard icon={Package} label="Total Products" value={100} badgeText="+4% WEEK" badgeVariant="green" />
          <StatCard icon={Factory} label="Total Factory"  value={50}  badgeText="VERIFIED"  badgeVariant="blue" />
          <StatCard icon={Shapes}  label="Total Category" value={12}  badgeText="GLOBE"      badgeVariant="yellow" />
        </div>

        <section className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-gray-900 text-xl font-bold">Activity Center</h3>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <ActionButton label="Add Product" onClick={() => setModalType("product")} />
          <ActionButton label="Add Factory" onClick={() => setModalType("factory")} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm min-h-[320px] border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-xl">Products by Category</h3>
            <p className="text-sm text-gray-500">Visualize your most popular categories here.</p>
            <CategoryDetails />
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm min-h-[320px] border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 text-xl">Recent Activity</h3>
            <div className="flex flex-col gap-4">
              <ActivityItem icon={Plus}   iconBgColor="bg-green-300"  title='New Product "Coke" added'               time="2 hours ago" />
              <ActivityItem icon={Pencil} iconBgColor="bg-blue-300"   title='New Factory "Nestle" details updated'   time="2 hours ago" />
              <ActivityItem icon={Shapes} iconBgColor="bg-yellow-200" title='New Category "Skin Care" created'       time="4 hours ago" />
            </div>
          </div>
        </div>
      </div>

      {modalType && (
        <Modal type={modalType} onClose={() => setModalType(null)} />
      )}
    </div>
  );
}