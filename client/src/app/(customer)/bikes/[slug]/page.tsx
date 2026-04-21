import { notFound } from "next/navigation";
import { API_URL } from "@/lib/config";
import { BIKES } from "@/lib/constants/bikes";
import { BikePageClient } from "./BikePageClient";
import type { Metadata } from "next";

async function getBike(slug: string) {
    try {
        const res = await fetch(`${API_URL}/bikes/slug/${slug}`, {
            next: {
                revalidate: 300,
                tags: ['bikes', `bike-${slug}`]
            }
        });
        const data = await res.json();
        if (data.success) {
            return data.data;
        }
    } catch (err) {
        console.error("Failed to fetch bike details:", err);
    }

    // Fallback to constants
    return BIKES.find(b => b.slug === slug);
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const bike = await getBike(slug.toLowerCase());

    if (!bike) {
        return {
            title: "Bike Not Found | Choudhary Yamaha",
        };
    }

    return {
        title: `${bike.name} Price in Katihar | On-Road Price & Specifications | Choudhary Yamaha`,
        description: `Check out the latest ${bike.name} on-road price in Katihar at Choudhary Yamaha. Explore specifications, features, colors, and book a test ride for ${bike.name} in Katihar.`,
        keywords: [
            `${bike.name} price Katihar`,
            `${bike.name} on-road price Katihar`,
            `${bike.name} specifications`,
            `${bike.name} features`,
            `${bike.name} colors Katihar`,
            `Yamaha ${bike.name} Katihar`,
            `Choudhary Yamaha ${bike.name}`
        ]
    };
}

export default async function BikePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const bike = await getBike(slug.toLowerCase());

    if (!bike) {
        return notFound();
    }

    return <BikePageClient bike={bike} />;
}
