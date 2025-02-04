import { bytesToHex, encodeAbiParameters, hexToBytes } from 'viem'
import HexColor from '@/utils/dto/HexColor'
import Palette from '@/utils/dto/Palette'
import { colord } from 'colord'
import { chunk } from 'remeda'
import pako from 'pako'

const TRANSPARENT_HEX = '#00000000'

const TRANSPARENT_INDEX = 0

type BoundedPixels = {
    bounds: {
        top: number
        right: number
        bottom: number
        left: number
    }
    pixels: ColorIndex[]
}

type ColorIndex = number

type EncodedArtwork = `0x${string}`

type EncodedCompressedParts = [
    encodedCompressedArtwork: EncodedArtwork,
    originalLength: bigint,
    itemCount: bigint,
]

const useArtworkEncoding = () => {
    const compressAndEncodeTrait = (
        traitColorIndexes: number[],
        paletteIndex: number
    ): EncodedCompressedParts =>
        compressEncodedArtwork([
            encodeArtwork(32, 32, traitColorIndexes, paletteIndex),
        ])

    const compressEncodedArtwork = (
        encodedArtwork: EncodedArtwork[]
    ): EncodedCompressedParts => {
        const abiEncodedArtwork = encodeAbiParameters(
            [{ type: 'bytes[]' }],
            [encodedArtwork]
        )
        const uncompressedBytes = hexToBytes(abiEncodedArtwork)
        const compressedBytes = pako.deflateRaw(uncompressedBytes)
        const encodedCompressedArtwork = bytesToHex(compressedBytes)
        const originalLength = BigInt(uncompressedBytes.length)
        const itemCount = BigInt(encodedArtwork.length)

        return [encodedCompressedArtwork, originalLength, itemCount]
    }

    const decimalToHex = (decimal: number) =>
        decimal.toString(16).padStart(2, '0')

    const encodeArtwork = (
        height: number,
        width: number,
        pixels: number[],
        paletteIndex: number
    ): EncodedArtwork => {
        const {
            bounds: { top, right, bottom, left },
            pixels: boundedPixels,
        } = packToBoundedPixels(pixels, width, height)

        const metadata = [paletteIndex, top, right, bottom, left].map((v) =>
            toHexByte(v)
        )

        return `0x${metadata.join('')}${rleEncode(boundedPixels)}`
    }

    const getColorIndexes = (canvas: HTMLCanvasElement, palette: Palette) => {
        const paletteDict = getPaletteDict(palette)

        return getPixels(canvas).map((color) => {
            return paletteDict[color.toHex().toLowerCase()] ?? TRANSPARENT_INDEX
        })
    }

    const getPaletteDict = (palette: Palette) =>
        palette.reduce(
            (lookup, color, index) => ({
                ...lookup,
                [color.toLowerCase()]: index,
            }),
            {} as Record<string, number>
        )

    const getPaletteIndex = (colors?: HexColor[], palettes?: Palette[]) => {
        if (!colors || !palettes) return undefined

        for (let i = 0; i < palettes.length; i++) {
            const palette = palettes[i]
            if (colors.every((color) => palette.includes(color))) return i
        }

        return null
    }

    const getPixels = (canvas: HTMLCanvasElement) =>
        chunk(
            [
                ...canvas
                    .getContext('2d')!
                    .getImageData(0, 0, canvas.width, canvas.height).data,
            ],
            4
        ).map(([r, g, b, a]) =>
            colord({
                r,
                g: g as number,
                b: b as number,
                a: Math.floor((a as number) / 255),
            })
        )

    const getTraitColors = (
        traitBitmap: ImageBitmap
    ): HexColor[] | undefined => {
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(traitBitmap, 0, 0, 32, 32)
        const imageData = ctx.getImageData(0, 0, 32, 32)
        const traitColors = [
            ...new Set(
                Array.from(
                    { length: 32 * 32 },
                    (_, i) =>
                        [
                            imageData.data[i * 4],
                            imageData.data[i * 4 + 1],
                            imageData.data[i * 4 + 2],
                            imageData.data[i * 4 + 3],
                        ] as [number, number, number, number]
                )
                    .map(rgbaToHex)
                    .filter((color) => color !== TRANSPARENT_HEX)
            ),
        ]

        return traitColors
    }

    const packToBoundedPixels = (
        pixels: ColorIndex[],
        width: number,
        height: number
    ): BoundedPixels => {
        let top = height - 1
        let right = 0
        let bottom = 0
        let left = width - 1
        const rows: number[][] = new Array(height).fill(null).map(() => [])

        for (const [i, pixel] of pixels.entries()) {
            const row = Math.floor(i / width)
            const col = i % width
            const isTransparent = pixel === TRANSPARENT_INDEX

            rows[row].push(pixel)

            if (!isTransparent) {
                top = Math.min(top, row)
                right = Math.max(right, col)
                bottom = Math.max(bottom, row)
                left = Math.min(left, col)
            }
        }

        const boundedPixels = rows
            .slice(top, bottom + 1)
            .flatMap((row) => row.slice(left, right + 1))

        // right bound is calculated to be one pixel outside the content
        right++

        return {
            bounds: {
                top,
                right,
                bottom,
                left,
            },
            pixels: boundedPixels,
        }
    }

    const rgbaToHex = ([r, g, b, a]: [
        number,
        number,
        number,
        number,
    ]): HexColor =>
        a === 0 ? TRANSPARENT_HEX : `#${[r, g, b].map(decimalToHex).join('')}`

    const rleEncode = (boundedPixels: number[]) => {
        const encoding: string[] = []
        let previousColorIndex = boundedPixels[0]
        let colorStreakCount = 1

        for (let i = 1; i < boundedPixels.length; i++) {
            if (
                boundedPixels[i] !== previousColorIndex ||
                colorStreakCount === 255
            ) {
                encoding.push(
                    toHexByte(colorStreakCount),
                    toHexByte(previousColorIndex)
                )

                colorStreakCount = 1

                previousColorIndex = boundedPixels[i]
            } else {
                colorStreakCount++
            }
        }

        if (previousColorIndex !== undefined) {
            encoding.push(
                toHexByte(colorStreakCount),
                toHexByte(previousColorIndex)
            )
        }

        return encoding.join('')
    }

    const toHexByte = (n: number): string => n.toString(16).padStart(2, '0')

    return {
        compressAndEncodeTrait,
        compressEncodedArtwork,
        encodeArtwork,
        getColorIndexes,
        getPaletteIndex,
        getTraitColors,
        rleEncode,
    }
}

export default useArtworkEncoding
