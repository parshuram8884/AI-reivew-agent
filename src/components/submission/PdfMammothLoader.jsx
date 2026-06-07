import { useEffect } from 'react'

/**
 * Loads PDF.js and mammoth libraries from CDN
 */
export default function PdfMammothLoader() {
    useEffect(() => {
        const scripts = [
            {
                id: 'pdfjs-cdn',
                src: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
            },
            {
                id: 'mammoth-cdn',
                src: 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
            },
        ]
        scripts.forEach(({ id, src }) => {
            if (!document.getElementById(id)) {
                const s = document.createElement('script')
                s.id = id
                s.src = src
                s.async = true
                document.head.appendChild(s)
            }
        })
    }, [])
    return null
}
