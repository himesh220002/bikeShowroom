"use client";

import { useState } from "react";
import { ShoppingCart, User, Phone, CheckCircle2, Loader2, IndianRupee, Bike } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/config";

interface SaleFormProps {
    bikes: any[];
    onSaleComplete: () => void;
}

export function SaleForm({ bikes, onSaleComplete }: SaleFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        bikeId: "",
        variant: "",
        exShowroomPrice: "",
        insurance: "",
        roadTax: "",
        extendedWarranty: "777",
        rsa: "307",
        hcCharge: "999",
        salePrice: "2083", // Default sum of 777 + 307 + 999
        chassisNumber: "",
        engineNumber: "",
        paymentMethod: "Cash",
        financeProvider: "",
        invoiceNumber: "NON-TAX",
        salesperson: "Showroom Manager",
    });

    const calculateTotal = (data: typeof formData) => {
        const ex = parseFloat(data.exShowroomPrice) || 0;
        const ins = parseFloat(data.insurance) || 0;
        const tax = parseFloat(data.roadTax) || 0;
        const ew = parseFloat(data.extendedWarranty) || 0;
        const rsa = parseFloat(data.rsa) || 0;
        const hc = parseFloat(data.hcCharge) || 0;
        return (ex + ins + tax + ew + rsa + hc).toString();
    };

    const updatePriceField = (field: string, value: string) => {
        const nextData = { ...formData, [field]: value };
        const total = calculateTotal(nextData);
        setFormData({ ...nextData, salePrice: total });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/sales`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setFormData({
                    customerName: "",
                    customerPhone: "",
                    bikeId: "",
                    variant: "",
                    exShowroomPrice: "",
                    insurance: "",
                    roadTax: "",
                    extendedWarranty: "777",
                    rsa: "307",
                    hcCharge: "999",
                    salePrice: "",
                    chassisNumber: "",
                    engineNumber: "",
                    paymentMethod: "Cash",
                    financeProvider: "",
                    invoiceNumber: "NON-TAX",
                    salesperson: "Showroom Manager",
                });

                onSaleComplete();
                alert("🎉 Sale recorded successfully! Inventory updated.");
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            console.error("Sale recording failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 md:p-8 bg-card border border-border rounded-[2.5rem] shadow-2xl space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-racing-blue/10 rounded-2xl">
                    <ShoppingCart className="w-6 h-6 text-racing-blue" />
                </div>
                <div>
                    <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">Record New <span className="text-racing-blue">Sale</span></h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Instant inventory sync enabled</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Customer Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-racing-blue" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer Intelligence</h4>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <label htmlFor="customerName" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Full Name</label>
                            <input
                                id="customerName"
                                type="text"
                                required
                                className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                placeholder="Enter customer name"
                            />
                        </div>
                        <div className="group">
                            <label htmlFor="customerPhone" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Phone Number</label>
                            <input
                                id="customerPhone"
                                type="tel"
                                required
                                maxLength={10}
                                className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                value={formData.customerPhone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    if (val.length <= 10) {
                                        setFormData({ ...formData, customerPhone: val });
                                    }
                                }}
                                placeholder="10-digit Phone Number"
                            />
                        </div>
                    </div>
                </div>

                {/* Bike Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Bike className="w-4 h-4 text-racing-blue" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Selection</h4>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <label htmlFor="bikeSelect" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Select Bike Model</label>
                            <select
                                id="bikeSelect"
                                required
                                className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all appearance-none"
                                value={formData.bikeId + "|" + formData.variant}
                                onChange={(e) => {
                                    const [bikeId, variantName] = e.target.value.split("|");
                                    const bike = bikes.find(b => b._id === bikeId);
                                    const colorInfo = bike?.colors.find((c: any) => c.name === variantName);
                                    const exPrice = colorInfo?.price?.split('-')[0].replace(/[^0-9]/g, '') || bike?.price?.split('-')[0].replace(/[^0-9]/g, '') || "";

                                    const nextData = {
                                        ...formData,
                                        bikeId: bikeId,
                                        variant: variantName,
                                        exShowroomPrice: exPrice,
                                        insurance: "",
                                        roadTax: "",
                                        // Reset to defaults on bike change to ensure accuracy
                                        extendedWarranty: "777",
                                        rsa: "307",
                                        hcCharge: "999",
                                    };
                                    const total = calculateTotal(nextData);
                                    setFormData({ ...nextData, salePrice: total });
                                }}
                            >
                                <option value="">Select a bike variant</option>
                                {bikes.flatMap(bike =>
                                    (bike.colors || []).filter((c: any) => c.stock > 0).map((color: any) => (
                                        <option key={`${bike._id}-${color.name}`} value={`${bike._id}|${color.name}`}>
                                            {bike.name} ({color.name}) - {color.stock} left
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="group">
                                <label htmlFor="exShowroomPrice" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Ex-Showroom Price</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-racing-blue" />
                                    <input
                                        id="exShowroomPrice"
                                        type="number"
                                        required
                                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                        value={formData.exShowroomPrice}
                                        onChange={(e) => updatePriceField("exShowroomPrice", e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label htmlFor="insurance" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Insurance (1+5 Yrs)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-racing-blue" />
                                    <input
                                        id="insurance"
                                        type="number"
                                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                        value={formData.insurance}
                                        onChange={(e) => updatePriceField("insurance", e.target.value)}
                                        placeholder={(() => {
                                            const bike = bikes.find(b => b._id === formData.bikeId);
                                            return bike?.category === 'scooty' ? "7,490 - 13,250" : "8,136 - 19,250";
                                        })()}
                                    />
                                </div>
                                <p className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1 ml-1 italic">Variable by vehicle type</p>
                            </div>

                            <div className="group">
                                <label htmlFor="roadTax" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">RTO & HSRPA / Road Tax</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-racing-blue" />
                                    <input
                                        id="roadTax"
                                        type="number"
                                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                        value={formData.roadTax}
                                        onChange={(e) => updatePriceField("roadTax", e.target.value)}
                                        placeholder={(() => {
                                            const bike = bikes.find(b => b._id === formData.bikeId);
                                            return bike?.category === 'scooty' ? "10,850 - 17,210" : "14,314 - 52,290";
                                        })()}
                                    />
                                </div>
                                <p className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1 ml-1 italic">Range based on model category</p>
                            </div>


                        </div>

                        {/* Mandatory Extras Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                            <div className="group">
                                <label htmlFor="extendedWarranty" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Extended Warranty</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                    <input
                                        id="extendedWarranty"
                                        type="number"
                                        className="w-full bg-muted/30 border border-border rounded-xl pl-8 pr-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                        value={formData.extendedWarranty}
                                        onChange={(e) => updatePriceField("extendedWarranty", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label htmlFor="rsa" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Road Side Assistance</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                    <input
                                        id="rsa"
                                        type="number"
                                        className="w-full bg-muted/30 border border-border rounded-xl pl-8 pr-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                        value={formData.rsa}
                                        onChange={(e) => updatePriceField("rsa", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label htmlFor="hcCharge" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">HC / Handling Charges</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                    <input
                                        id="hcCharge"
                                        type="number"
                                        className="w-full bg-muted/30 border border-border rounded-xl pl-8 pr-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                        value={formData.hcCharge}
                                        onChange={(e) => updatePriceField("hcCharge", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="group bg-racing-blue/5 p-6 rounded-3xl border border-racing-blue/20">
                            <label htmlFor="salePrice" className="block text-[10px] font-black uppercase tracking-widest text-racing-blue mb-2 ml-1">Total On-Road Price (Auto-calculated)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-racing-blue" />
                                <input
                                    id="salePrice"
                                    type="number"
                                    required
                                    readOnly
                                    className="w-full bg-transparent border-none rounded-xl pl-12 pr-5 py-4 text-2xl font-display font-black text-foreground focus:outline-none"
                                    value={formData.salePrice}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Vehicle Identity Section */}
                        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border/50">
                            <div className="group">
                                <label htmlFor="chassisNumber" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Chassis Number</label>
                                <input
                                    id="chassisNumber"
                                    type="text"
                                    required
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all uppercase"
                                    value={formData.chassisNumber}
                                    onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value.toUpperCase() })}
                                    placeholder="Enter Chassis No."
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="engineNumber" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Engine Number</label>
                                <input
                                    id="engineNumber"
                                    type="text"
                                    required
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all uppercase"
                                    value={formData.engineNumber}
                                    onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value.toUpperCase() })}
                                    placeholder="Enter Engine No."
                                />
                            </div>
                        </div>

                        {/* Payment & Documentation Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-4">
                            <div className="group">
                                <label htmlFor="paymentMethod" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Payment Method</label>
                                <select
                                    id="paymentMethod"
                                    required
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value, financeProvider: e.target.value === 'Finance' ? formData.financeProvider : "" })}
                                >
                                    <option value="Cash">Cash / Full Payment</option>
                                    <option value="Finance">Finance / Loan</option>
                                    <option value="EMI">EMI / Installments</option>
                                    <option value="UPI">UPI / Digital</option>
                                </select>
                            </div>

                            <AnimatePresence>
                                {formData.paymentMethod === 'Finance' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group"
                                    >
                                        <label htmlFor="financeProvider" className="block text-[9px] font-black uppercase tracking-widest text-racing-blue mb-2 ml-1">Finance Provider</label>
                                        <select
                                            id="financeProvider"
                                            required
                                            className="w-full bg-racing-blue/5 border border-racing-blue/20 rounded-xl px-4 py-3 text-[12px] font-black uppercase text-racing-blue focus:outline-none focus:border-racing-blue transition-all"
                                            value={formData.financeProvider}
                                            onChange={(e) => setFormData({ ...formData, financeProvider: e.target.value })}
                                        >
                                            <option value="">Select Provider</option>
                                            <option value="L&T Finance">L&T Finance</option>
                                            <option value="Bajaj Finserv">Bajaj Finserv</option>
                                            <option value="IDFC First Bank">IDFC First Bank</option>
                                            <option value="Tata Capital">Tata Capital</option>
                                            <option value="Custom / Others">Custom / Others</option>
                                        </select>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="group">
                                <label htmlFor="invoiceNumber" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Document No. / INV</label>
                                <input
                                    id="invoiceNumber"
                                    type="text"
                                    required
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                    value={formData.invoiceNumber}
                                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="salesperson" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Showroom Agent</label>
                                <input
                                    id="salesperson"
                                    type="text"
                                    required
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                    value={formData.salesperson}
                                    onChange={(e) => setFormData({ ...formData, salesperson: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading || !formData.bikeId}
                    className="flex items-center gap-3 px-10 py-4 bg-racing-blue hover:bg-racing-blue/90 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-racing-blue/30 active:scale-95"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-5 h-5" />
                    )}
                    {loading ? "Processing..." : "Confirm & Record Sale"}
                </button>
            </div>
        </form >
    );
}
