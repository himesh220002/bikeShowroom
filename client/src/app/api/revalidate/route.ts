import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { tag, secret } = await request.json();

        // Check for secret to prevent unauthorized revalidation
        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
        }

        if (!tag) {
            return NextResponse.json({ message: 'Tag is required' }, { status: 400 });
        }

        (revalidateTag as any)(tag);
        console.log(`[Revalidate] Tag "${tag}" revalidated at ${new Date().toISOString()}`);

        return NextResponse.json({
            revalidated: true,
            tag,
            now: Date.now()
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
