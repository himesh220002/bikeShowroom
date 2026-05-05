"use client";

import { RideRequestTable } from "@/components/features/RideRequestTable";

export default function AdminRideRequestsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                <RideRequestTable />
            </div>
        </div>
    );
}
