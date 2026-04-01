import { User, Phone, Bike, Calendar, Wrench, MessageSquare, History, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExportButton } from "@/components/ui/ExportButton";

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
    const router = useRouter();
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/config");
                const data = await res.json();
                if (data.success) setConfig(data.data);
            } catch (err) {
                console.error("Failed to fetch showroom config:", err);
            }
        };
        fetchConfig();
    }, []);

    const handleWhatsApp = (customer: CustomerCRM) => {
        const { showroomPhone, showroomEmail, showroomAddress } = config || {};
        const displayPhone = showroomPhone || "7004100062";
        const displayEmail = showroomEmail || "choudharyyamaha.ktr@gmail.com";

        const message = `Hello ${customer.name}! 

This is Choudhary Yamaha, Katihar. We are checking in to see how your ${customer.lastSale?.bikeName || "Yamaha machine"} is performing.

Is it time for your next periodic maintenance? Our expert technicians are ready to ensure your machine stays in peak condition. 

📍 Address: ${showroomAddress || "Manihari Mor, Mirchaibari, Katihar"}
📞 Contact: ${displayPhone}
✉️ Email: ${displayEmail}

Reply to this message to schedule your service or ask any questions!`;

        const encodedMessage = encodeURIComponent(message);
        const cleanPhone = customer.phone.replace(/\D/g, '');
        const phoneWithCountry = (cleanPhone.length === 10) ? `91${cleanPhone}` : cleanPhone;
        const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCall = (customer: CustomerCRM) => {
        window.location.href = `tel:${customer.phone}`;
    };

    const handleService = () => {
        router.push("/service");
    };

    if (customers.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <User className="w-12 h-12 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No customers found in CRM</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-racing-blue/10 rounded-lg">
                        <User className="w-5 h-5 text-racing-blue" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Customer Database</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{customers.length} Verified Owners</p>
                    </div>
                </div>
                <ExportButton
                    data={customers}
                    filename="Yamaha_Customers_Report"
                    sheetName="Customers"
                />
            </div>
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
                                        <div
                                            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border cursor-pointer hover:bg-racing-blue/20 transition-colors"
                                            onClick={() => handleCall(customer)}
                                        >
                                            <User className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">{customer.name}</p>
                                            <div
                                                className="flex items-center gap-2 mt-1 cursor-pointer hover:text-racing-blue transition-colors group/phone"
                                                onClick={() => handleCall(customer)}
                                            >
                                                <Phone className="w-3 h-3 text-muted-foreground/60 group-hover/phone:text-racing-blue" />
                                                <span className="text-[10px] font-bold text-muted-foreground group-hover/phone:text-racing-blue">{customer.phone}</span>
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
                                        <button
                                            onClick={handleService}
                                            className="p-2 rounded-xl border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 group/btn transition-all"
                                            title="Schedule Service"
                                        >
                                            <Wrench className="w-4 h-4 text-racing-blue group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => handleWhatsApp(customer)}
                                            className="p-2 rounded-xl border border-border hover:bg-green-500/10 hover:border-green-500/50 group/btn transition-all"
                                            title="WhatsApp Customer"
                                        >
                                            <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button className="p-2 rounded-xl border border-border hover:bg-foreground/10 hover:border-foreground/50 group/btn transition-all" title="View Detailed History">
                                            <History className="w-4 h-4 text-muted-foreground group-hover/btn:scale-110 transition-transform" />
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
