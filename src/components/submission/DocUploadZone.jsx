import { useState, useRef, useCallback } from 'react'
import {
    FaUpload, FaFileAlt, FaFilePdf, FaFileWord,
    FaTimes, FaEdit, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa'
import { wordCount, extractTextFromFile } from '../../utils/textProcessing'
import PdfMammothLoader from './PdfMammothLoader'

/**
 * Document upload zone with file extraction
 */
export default function DocUploadZone({ content, onContentChange, error }) {
    const [mode, setMode] = useState(content ? 'editor' : 'upload')
    const [uploadedFile, setUploadedFile] = useState(null)
    const [extracting, setExtracting] = useState(false)
    const [extractError, setExtractError] = useState('')
    const [dragging, setDragging] = useState(false)
    const fileInputRef = useRef(null)

    const ACCEPTED = '.txt,.md,.pdf,.docx'
    const MAX_MB = 10

    const fileIcon = (name) => {
        const ext = name?.split('.').pop().toLowerCase()
        if (ext === 'pdf') return <FaFilePdf className='text-red-400 text-2xl' />
        if (ext === 'docx') return <FaFileWord className='text-blue-400 text-2xl' />
        return <FaFileAlt className='text-slate-400 text-2xl' />
    }

    const processFile = useCallback(async (file) => {
        setExtractError('')
        const mb = file.size / (1024 * 1024)
        if (mb > MAX_MB) {
            setExtractError(`File too large (${mb.toFixed(1)} MB). Max is ${MAX_MB} MB.`)
            return
        }
        setUploadedFile(file)
        setExtracting(true)
        try {
            const text = await extractTextFromFile(file)
            if (!text.trim()) throw new Error('No text could be extracted from this file.')
            onContentChange(text)
            setMode('editor')
        } catch (err) {
            setExtractError(err.message || 'Could not read file.')
            setUploadedFile(null)
        } finally {
            setExtracting(false)
        }
    }, [onContentChange])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) processFile(file)
    }, [processFile])

    const handleFileInput = (e) => {
        const file = e.target.files[0]
        if (file) processFile(file)
        e.target.value = ''
    }

    const handleClear = () => {
        setUploadedFile(null)
        onContentChange('')
        setMode('upload')
        setExtractError('')
    }

    const wc = wordCount(content)
    const rt = Math.max(1, Math.round(wc / 200))

    return (
        <section className='bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden'>
            <div className='flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-800'>
                <div>
                    <h2 className='text-white font-semibold'>
                        Content <span className='text-red-400'>*</span>
                    </h2>
                    {content.trim() && (
                        <p className='text-slate-500 text-xs mt-0.5'>
                            {wc} words · ~{rt} min read
                            {uploadedFile && (
                                <span className='ml-2 text-blue-400'>· from {uploadedFile.name}</span>
                            )}
                        </p>
                    )}
                </div>

                <div className='flex items-center gap-1 bg-[#0F172A] border border-slate-700 rounded-xl p-1'>
                    <button
                        onClick={() => setMode('upload')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === 'upload'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <FaUpload className='text-xs' /> Upload File
                    </button>
                    <button
                        onClick={() => setMode('editor')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === 'editor'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <FaEdit className='text-xs' /> Type / Paste
                    </button>
                </div>
            </div>

            {mode === 'upload' && (
                <div className='p-6'>
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => !extracting && fileInputRef.current?.click()}
                        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all select-none ${dragging
                            ? 'border-blue-500 bg-blue-500/10'
                            : error
                                ? 'border-red-500/50 bg-red-500/5'
                                : 'border-slate-700 hover:border-blue-500/60 hover:bg-blue-500/5 bg-[#0F172A]'
                            }`}
                    >
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept={ACCEPTED}
                            onChange={handleFileInput}
                            className='hidden'
                        />

                        {extracting ? (
                            <div className='flex flex-col items-center gap-4'>
                                <div className='w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center'>
                                    <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
                                </div>
                                <div className='text-center'>
                                    <p className='text-white font-medium text-sm'>Extracting text…</p>
                                    <p className='text-slate-400 text-xs mt-1'>Reading {uploadedFile?.name}</p>
                                </div>
                            </div>
                        ) : content && uploadedFile ? (
                            <div className='flex flex-col items-center gap-4'>
                                <div className='w-14 h-14 bg-[#1E293B] rounded-2xl flex items-center justify-center'>
                                    {fileIcon(uploadedFile.name)}
                                </div>
                                <div className='text-center'>
                                    <p className='text-white font-medium text-sm'>{uploadedFile.name}</p>
                                    <p className='text-slate-400 text-xs mt-1'>
                                        {(uploadedFile.size / 1024).toFixed(0)} KB · {wc} words extracted
                                    </p>
                                </div>
                                <div className='flex items-center gap-2 mt-1'>
                                    <span className='flex items-center gap-1.5 text-emerald-400 text-xs bg-emerald-400/10 px-3 py-1.5 rounded-full'>
                                        <FaCheckCircle className='text-xs' /> Text extracted successfully
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleClear() }}
                                        className='text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-400/10'
                                    >
                                        <FaTimes className='text-xs' />
                                    </button>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setMode('editor') }}
                                    className='text-blue-400 hover:text-blue-300 text-xs underline underline-offset-2 transition-colors'
                                >
                                    Preview or edit extracted text →
                                </button>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center gap-4'>
                                <div className='w-16 h-16 bg-[#1E293B] rounded-2xl flex items-center justify-center border border-slate-700'>
                                    <FaUpload className='text-slate-400 text-2xl' />
                                </div>
                                <div className='text-center'>
                                    <p className='text-white font-medium'>
                                        {dragging ? 'Drop your file here' : 'Upload your document'}
                                    </p>
                                    <p className='text-slate-400 text-sm mt-1'>
                                        Drag & drop, or <span className='text-blue-400'>browse files</span>
                                    </p>
                                </div>
                                <div className='flex items-center gap-3 mt-1'>
                                    {[
                                        { label: '.TXT', color: 'text-slate-300 bg-slate-700/60' },
                                        { label: '.MD', color: 'text-slate-300 bg-slate-700/60' },
                                        { label: '.PDF', color: 'text-red-400 bg-red-400/10' },
                                        { label: '.DOCX', color: 'text-blue-400 bg-blue-400/10' },
                                    ].map(t => (
                                        <span key={t.label} className={`text-xs font-mono px-2 py-1 rounded-lg font-semibold ${t.color}`}>
                                            {t.label}
                                        </span>
                                    ))}
                                </div>
                                <p className='text-slate-600 text-xs'>Max {MAX_MB} MB</p>
                            </div>
                        )}
                    </div>

                    {extractError && (
                        <div className='mt-3 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3'>
                            <FaExclamationTriangle className='text-red-400 text-sm flex-shrink-0 mt-0.5' />
                            <p className='text-red-300 text-xs'>{extractError}</p>
                        </div>
                    )}

                    {error && !extractError && (
                        <p className='text-red-400 text-xs mt-2'>{error}</p>
                    )}

                    <p className='text-slate-600 text-xs mt-3 text-center'>
                        Text is extracted in your browser. Your document is never uploaded to a server.
                    </p>
                </div>
            )}

            {mode === 'editor' && (
                <div className='p-6'>
                    {uploadedFile && (
                        <div className='flex items-center justify-between mb-3 bg-[#1E293B] rounded-xl px-4 py-2.5'>
                            <div className='flex items-center gap-2'>
                                {fileIcon(uploadedFile.name)}
                                <div>
                                    <p className='text-white text-xs font-medium'>{uploadedFile.name}</p>
                                    <p className='text-slate-500 text-xs'>Extracted text — you can edit below</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClear}
                                className='text-slate-500 hover:text-red-400 transition-colors p-1.5'
                                title='Remove file'
                            >
                                <FaTimes className='text-xs' />
                            </button>
                        </div>
                    )}

                    <textarea
                        value={content}
                        onChange={e => onContentChange(e.target.value)}
                        placeholder='Paste or type your content here…'
                        rows={16}
                        className={`w-full bg-[#0F172A] border rounded-xl px-5 py-4 text-white text-sm placeholder-slate-600 outline-none transition-colors resize-none leading-relaxed ${error ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
                            }`}
                        style={{ fontFamily: uploadedFile ? 'inherit' : 'ui-monospace, monospace' }}
                    />

                    {error && <p className='text-red-400 text-xs mt-2'>{error}</p>}

                    <div className='flex items-center justify-between mt-2'>
                        <p className='text-slate-600 text-xs'>Minimum 30 words.</p>
                        {content.trim() && (
                            <p className='text-slate-500 text-xs'>{wc} words · ~{rt} min read</p>
                        )}
                    </div>
                </div>
            )}

            <PdfMammothLoader />
        </section>
    )
}
