"use client";

import { ShoppingCart, Bike, User, IndianRupee, Calendar } from "lucide-react";

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
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border">
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Details</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sale Value</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale._id} className="border-b border-border/30 group hover:bg-muted/30 transition-colors">
                            <td className="py-6 px-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                        <User className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">{sale.customerName}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground">{sale.customerPhone}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-racing-blue/10 rounded-lg">
                                        <Bike className="w-4 h-4 text-racing-blue" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground uppercase tracking-tighter">{sale.bikeName}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{sale.variant}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6 px-4">
                                <div className="flex items-center gap-1.5 text-racing-blue font-display font-black italic">
                                    <IndianRupee className="w-3.5 h-3.5" />
                                    {Number(sale.salePrice).toLocaleString('en-IN')}
                                </div>
                            </td>
                            <td className="py-6 px-4 text-right">
                                <div className="flex items-center justify-end gap-2 text-muted-foreground">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        {new Date(sale.saleDate).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
