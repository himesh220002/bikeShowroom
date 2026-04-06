import { BIKES } from "@/lib/constants/bikes";
import { BrochureViewer } from "@/components/features/BrochureViewer";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const bike = BIKES.find(b => b.slug.toLowerCase() === slug.toLowerCase());

    if (!bike) return { title: "Brochure Not Found" };

    const title = `${bike.name} Official Brochure | Choudhary Yamaha`;
    const description = `Download and view the official brochure for the ${bike.name} from Choudhary Yamaha. Detailed specs, features, and offers.`;

    // Use high quality image if available, fallback to logo
    const imageUrl = bike.colors?.[0]?.image || "/images/YamahaLogo.png";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: bike.name,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function BrochurePage({ params }: Props) {
    const { slug } = await params;
    const bike = BIKES.find(b => b.slug.toLowerCase() === slug.toLowerCase());

    if (!bike || !bike.brochureUrl) {
        notFound();
    }

    return <BrochureViewer bike={bike} />;
}
