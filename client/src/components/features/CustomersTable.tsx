import { User, Phone, Bike, Calendar, Wrench, MessageSquare, History, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CustomerCRM {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    lastSale: {
        bikeName: string;
        variant: string;
        salePrice: string;
        saleDate: string;
    } | null;
    serviceHistory: {
        totalCount: number;
        latest: {
            status: string;
            date: string;
        } | null;
    };
}

interface CustomersTableProps {
    customers: CustomerCRM[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
    if (customers.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-4">
                <User className="w-12 h-12 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No customers found in CRM</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border">
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Purchase</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service Status</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer._id} className="border-b border-border/30 group hover:bg-muted/30 transition-colors">
                            <td className="py-6 px-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                        <User className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">{customer.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Phone className="w-3 h-3 text-muted-foreground/60" />
                                            <span className="text-[10px] font-bold text-muted-foreground">{customer.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6 px-4">
                                {customer.lastSale ? (
                                    <div>
                                        <p className="text-sm font-black text-foreground uppercase tracking-tighter">{customer.lastSale.bikeName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Bike className="w-3 h-3 text-racing-blue" />
                                            <span className="text-[10px] font-bold text-muted-foreground">
                                                Purchased {new Date(customer.lastSale.saleDate).toLocaleDateString('en-IN', {
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-muted-foreground italic">No sales record</span>
                                )}
                            </td>
                            <td className="py-6 px-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "w-2 h-2 rounded-full",
                                            customer.serviceHistory.totalCount > 0 ? "bg-green-500" : "bg-amber-500"
                                        )} />
                                        <span className="text-[11px] font-black text-foreground uppercase tracking-widest">
                                            {customer.serviceHistory.totalCount} Services Done
                                        </span>
                                    </div>
                                    {customer.serviceHistory.latest && (
                                        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest ml-4">
                                            Last: {customer.serviceHistory.latest.status} on {new Date(customer.serviceHistory.latest.date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="py-6 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-2 rounded-xl border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 group/btn transition-all title='Schedule Service'">
                                        <Wrench className="w-4 h-4 text-racing-blue group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                    <button className="p-2 rounded-xl border border-border hover:bg-green-500/10 hover:border-green-500/50 group/btn transition-all title='WhatsApp Customer'">
                                        <MessageSquare className="w-4 h-4 text-green-400 group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                    <button className="p-2 rounded-xl border border-border hover:bg-foreground/10 hover:border-foreground/50 group/btn transition-all title='View Detailed History'">
                                        <History className="w-4 h-4 text-muted-foreground group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
