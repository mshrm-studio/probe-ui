import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
    try {
        const { path } = await req.json()

        revalidatePath(path)

        const message = 'Path revalidated'

        return NextResponse.json({ message })
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}
