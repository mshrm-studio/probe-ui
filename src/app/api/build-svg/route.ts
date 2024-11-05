import { NextRequest, NextResponse } from 'next/server'
import { buildSVG, PNGCollectionEncoder } from '@nouns/sdk'
import { ImageData } from '@nouns/assets'

export async function POST(req: NextRequest) {
    try {
        const { RLE_PARTS, BACKGROUND_COLOR } = await req.json()

        const encoder = new PNGCollectionEncoder(ImageData.palette)

        const PALETTE_COLORS = encoder.data.palette

        console.log('RLE_PARTS', RLE_PARTS)
        console.log('PALETTE_COLORS', PALETTE_COLORS)
        console.log('BACKGROUND_COLOR', BACKGROUND_COLOR)

        const svg = buildSVG(RLE_PARTS, PALETTE_COLORS, BACKGROUND_COLOR)

        return NextResponse.json({ svg })
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}
