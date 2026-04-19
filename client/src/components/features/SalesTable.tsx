"use client";

import { ShoppingCart, Bike, User, IndianRupee, Calendar, Hash, UserCircle, CreditCard, Tag, Edit3, Save, X, CheckCircle2, AlertCircle } from "lucide-react";
import { ExportButton } from "@/components/ui/ExportButton";
import { cn } from "@/lib/utils/cn";
import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/config";

interface SalesTableProps {
    sales: any[];
}

export function SalesTable({ sales }: SalesTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;
    const [isUpdatingReg, setIsUpdatingReg] = useState<string | null>(null);
    const [newReg, setNewReg] = useState("");
    const [allSales, setAllSales] = useState(sales);

    const handleUpdateRegistration = async (saleId: string, chassisNumber: string) => {
        if (!newReg) return;
        try {
            // 1. Update Sale record registration (if needed/supported by API)
            // 2. Update UserBike record linked by chassis
            const res = await axios.put(`${API_URL}/user-bikes/by-chassis/${chassisNumber}`, { registrationNumber: newReg }, { withCredentials: true });
            const data = res.data as any;

            if (data.success) {
                setAllSales(prev => prev.map(s => s._id === saleId ? { ...s, registrationNumber: newReg } : s));
                setIsUpdatingReg(null);
                setNewReg("");
            }
        } catch (err) {
            console.error("Failed to update registration:", err);
            alert("Failed to update registration number. Please ensure the user has added this bike to their profile.");
        }
    };

    const sortedSales = useMemo(() => {
        return [...sales].sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;

            // Map table keys to actual data object keys
            const keyMap: any = {
                'name': 'customerName',
                'phone': 'customerPhone',
                'bikeModel': 'bikeName',
                'variant': 'variant',
                'payment': 'paymentMethod',
                'date': 'saleDate',
                'price': 'salePrice',
                'reg': 'registrationNumber'
            };

            const targetKey = keyMap[key] || key;
            let aVal: any = (a as any)[targetKey] || "";
            let bVal: any = (b as any)[targetKey] || "";

            if (targetKey === 'saleDate') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            } else if (targetKey === 'salePrice') {
                aVal = Number(aVal);
                bVal = Number(bVal);
            } else {
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
            }

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [allSales, sortConfig]);

    const totalPages = Math.ceil(allSales.length / pageSize);
    const currentSales = sortedSales.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    if (allSales.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <ShoppingCart className="w-12 h-12 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No sales recorded yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-racing-blue/10 rounded-lg">
                        <ShoppingCart className="w-4 h-4 text-racing-blue" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Sales Ledger</h3>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Complete Transaction History ({sales.length} Records)</p>
                    </div>
                </div>

                <ExportButton
                    data={allSales}
                    filename="Yamaha_Sales_Report"
                    sheetName="Sales"
                />
            </div>

            <div className="overflow-x-auto min-h-[300px] border border-border rounded-xl bg-card">
                <table className="w-full text-left border-collapse min-w-[2000px] table-fixed">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[200px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-1">
                                    Customer Name
                                    {sortConfig?.key === 'name' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('phone')}>
                                <div className="flex items-center gap-1">
                                    Phone Number
                                    {sortConfig?.key === 'phone' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('bikeModel')}>
                                <div className="flex items-center gap-1">
                                    Machine Model
                                    {sortConfig?.key === 'bikeModel' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('variant')}>
                                <div className="flex items-center gap-1">
                                    Variant
                                    {sortConfig?.key === 'variant' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px]">Chassis #</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[160px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('reg')}>
                                <div className="flex items-center gap-1">
                                    Registration #
                                    {sortConfig?.key === 'reg' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px]">Engine #</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('price')}>
                                <div className="flex items-center justify-center gap-1">
                                    Sale Price
                                    {sortConfig?.key === 'price' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('payment')}>
                                <div className="flex items-center justify-center gap-1">
                                    Payment
                                    {sortConfig?.key === 'payment' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[160px]">Finance Provider</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px]">Invoice #</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px]">Salesperson</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('date')}>
                                <div className="flex items-center justify-center gap-1">
                                    Sale Date
                                    {sortConfig?.key === 'date' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[100px] text-center">Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSales.map((sale) => (
                            <tr key={sale._id} className="border-b border-border/30 group hover:bg-muted/10 transition-colors">
                                {/* Customer Name */}
                                <td className="py-3 px-4 border-r border-border/10">
                                    <p className="text-[13px] font-black text-foreground uppercase tracking-tight truncate">{sale.customerName}</p>
                                </td>

                                {/* Phone */}
                                <td className="py-3 px-4 border-r border-border/10 uppercase tracking-wider text-[12px] font-bold text-muted-foreground">
                                    {sale.customerPhone}
                                </td>

                                {/* Machine */}
                                <td className="py-3 px-4 border-r border-border/10">
                                    <div className="flex items-center gap-2">
                                        <Bike className="w-3.5 h-3.5 text-racing-blue/40" />
                                        <p className="text-[13px] font-black text-foreground uppercase tracking-tighter italic truncate">{sale.bikeName}</p>
                                    </div>
                                </td>

                                {/* Variant */}
                                <td className="py-3 px-4 border-r border-border/10">
                                    <span className="text-[10px] font-black text-racing-blue bg-racing-blue/5 border border-racing-blue/10 px-2 py-0.5 rounded uppercase tracking-widest block text-center truncate">
                                        {sale.variant}
                                    </span>
                                </td>

                                {/* Chassis */}
                                <td className="py-3 px-4 border-r border-border/10 font-mono text-[11px] font-bold text-muted-foreground tracking-tighter uppercase whitespace-nowrap">
                                    {sale.chassisNumber || "—"}
                                </td>

                                {/* Registration */}
                                <td className="py-3 px-4 border-r border-border/10">
                                    <div className="flex items-center gap-2 h-6">
                                        {isUpdatingReg === sale._id ? (
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="text"
                                                    value={newReg}
                                                    onChange={(e) => setNewReg(e.target.value.toUpperCase())}
                                                    className="w-28 bg-background border border-racing-blue/30 rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest focus:outline-none"
                                                    autoFocus
                                                />
                                                <button onClick={() => handleUpdateRegistration(sale._id, sale.chassisNumber)} className="text-green-500 hover:text-green-600"><Save className="w-3 h-3" /></button>
                                                <button onClick={() => setIsUpdatingReg(null)} className="text-red-500 hover:text-red-600"><X className="w-3 h-3" /></button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 cursor-pointer group/reg" onClick={() => {
                                                setIsUpdatingReg(sale._id);
                                                setNewReg(sale.registrationNumber || "");
                                            }}>
                                                {sale.registrationNumber ? (
                                                    <span className="text-[11px] font-black text-foreground uppercase tracking-wider">{sale.registrationNumber}</span>
                                                ) : (
                                                    <span className="text-[9px] font-bold text-racing-blue/60 uppercase italic tracking-tighter">PENDING</span>
                                                )}
                                                <Edit3 className="w-3 h-3 text-racing-blue opacity-0 group-hover/reg:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Engine */}
                                <td className="py-3 px-4 border-r border-border/10 font-mono text-[11px] font-bold text-muted-foreground tracking-tighter uppercase whitespace-nowrap">
                                    {sale.engineNumber || "—"}
                                </td>

                                {/* Price */}
                                <td className="py-3 px-4 border-r border-border/10 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-0.5 text-[13px] font-black text-racing-blue italic">
                                        <IndianRupee className="w-3 h-3" />
                                        {Number(sale.salePrice).toLocaleString('en-IN')}
                                    </div>
                                </td>

                                {/* Payment */}
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <span className={cn(
                                        "text-[9px] font-black uppercase px-2 py-0.5 rounded border tracking-widest",
                                        sale.paymentMethod === 'Cash' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                            sale.paymentMethod === 'UPI' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                                sale.paymentMethod === 'EMI' ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                                                    "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    )}>
                                        {sale.paymentMethod || "Cash"}
                                    </span>
                                </td>

                                {/* Finance Provider */}
                                <td className="py-3 px-4 border-r border-border/10">
                                    {sale.financeProvider ? (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{sale.financeProvider}</span>
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-50">Authorized Loan</span>
                                        </div>
                                    ) : (
                                        <span className="text-[9px] font-bold text-muted-foreground/30 uppercase italic">—</span>
                                    )}
                                </td>

                                {/* Invoice */}
                                <td className="py-3 px-4 border-r border-border/10 uppercase tracking-widest text-[10px] font-black text-muted-foreground">
                                    {sale.invoiceNumber || "NON-TAX"}
                                </td>

                                {/* Salesperson */}
                                <td className="py-3 px-4 border-r border-border/10">
                                    <p className="text-[11px] font-bold text-muted-foreground uppercase italic truncate">
                                        {sale.salesperson || "Showroom Manager"}
                                    </p>
                                </td>

                                {/* Date */}
                                <td className="py-3 px-4 border-r border-border/10 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground/30" />
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                            {new Date(sale.saleDate).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => window.location.href = `/admin/crm?search=${sale.customerPhone}`}
                                        className="p-1.5 border border-border rounded-lg hover:bg-racing-blue/10 hover:border-racing-blue/50 text-muted-foreground hover:text-racing-blue transition-all"
                                        title="View CRM Profile"
                                    >
                                        <UserCircle className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 bg-muted/10 border border-border rounded-xl">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        Records Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-3 py-1.5 bg-card border border-border rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-muted disabled:opacity-30 transition-all"
                        >
                            Prev
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-3 py-1.5 bg-card border border-border rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-muted disabled:opacity-30 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <div className="p-3 bg-muted/5 border border-border border-dashed rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" />
                    Audit-Ready Ledger Flow • Professional Spreadsheet Layout
                </p>
            </div>
        </div>
    );
}
