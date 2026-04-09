"use client";

import { ShoppingCart, Bike, User, IndianRupee, Calendar } from "lucide-react";
import { ExportButton } from "@/components/ui/ExportButton";

interface SalesTableProps {
    sales: any[];
}

export function SalesTable({ sales }: SalesTableProps) {
    if (sales.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <ShoppingCart className="w-12 h-12 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No sales recorded yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center m-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-racing-blue/10 rounded-lg">
                        <ShoppingCart className="w-4 h-4 text-racing-blue" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Sales Ledger</h3>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">{sales.length} Completed Transactions</p>
                    </div>
                </div>

                <ExportButton
                    data={sales}
                    filename="Yamaha_Sales_Report"
                    sheetName="Sales"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Details</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Sale Value / Payment</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Document / Agent</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Timestamp</th>
                        </tr>

                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale._id} className="border-b border-border/30 group hover:bg-muted/30 transition-colors">
                                <td className="py-4 px-4">

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                            <User className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-foreground leading-tight">{sale.customerName}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{sale.customerPhone}</p>
                                        </div>

                                    </div>
                                </td>
                                <td className="py-4 px-4">

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-racing-blue/10 rounded-lg">
                                            <Bike className="w-4 h-4 text-racing-blue" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-foreground uppercase tracking-tighter leading-tight">{sale.bikeName}</p>
                                            <div className="flex flex-col flex-wrap items-start gap-x-2 gap-y-0.5 mt-0.5">
                                                <p className="text-[9px] font-black text-racing-blue uppercase tracking-widest">{sale.variant}</p>
                                                {(sale.chassisNumber || sale.engineNumber) && (
                                                    <div className="flex items-center gap-2">
                                                        {sale.chassisNumber && <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-tighter">C: {sale.chassisNumber}</span>}
                                                        {sale.engineNumber && <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-tighter">E: {sale.engineNumber}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                    </div>
                                </td>
                                <td className="py-4 px-4">

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-racing-blue font-display font-black italic">
                                            <IndianRupee className="w-3.5 h-3.5" />
                                            {Number(sale.salePrice).toLocaleString('en-IN')}
                                        </div>
                                        <span className="text-[8px] font-black uppercase bg-muted/50 px-1.5 py-0.5 rounded border border-border w-fit">
                                            {sale.paymentMethod || "Cash"}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">

                                    <div className="flex flex-col gap-1">
                                        <p className="text-[10px] font-black text-foreground uppercase tracking-widest">
                                            INV: {sale.invoiceNumber || "NON-TAX"}
                                        </p>
                                        <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">
                                            BY: {sale.salesperson || "Showroom Manager"}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-2 px-4 text-right">

                                    <div className="flex items-center justify-end gap-3 text-muted-foreground">
                                        <div className="flex flex-col items-end mr-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {new Date(sale.saleDate).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => window.location.href = `/admin/crm?search=${sale.customerPhone}`}
                                            className="p-2 border border-border rounded-xl hover:bg-racing-blue/10 hover:border-racing-blue/50 text-muted-foreground hover:text-racing-blue transition-all group/btn"
                                            title="View CRM Profile"
                                        >
                                            <User className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
