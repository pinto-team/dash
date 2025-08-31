// components/dev/DevPanel.tsx
import { useEffect, useState } from 'react'

import { API_CONFIG } from '@/shared/config/api.config'

interface ApiCall {
    id: string
    timestamp: Date
    method: string
    url: string
    status?: number
    duration?: number
    feature?: string
}

export function DevPanel() {
    const [isVisible, setIsVisible] = useState(false)
    const [apiCalls, setApiCalls] = useState<ApiCall[]>([])
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        // Listen for custom API call events
        const handleApiCall = (event: CustomEvent) => {
            const call: ApiCall = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date(),
                method: event.detail.method,
                url: event.detail.url,
                status: event.detail.status,
                duration: event.detail.duration,
                feature: event.detail.feature,
            }

            setApiCalls((prev) => [call, ...prev.slice(0, 49)]) // Keep last 50 calls
        }

        window.addEventListener('api-call', handleApiCall as EventListener)

        return () => {
            window.removeEventListener('api-call', handleApiCall as EventListener)
        }
    }, [])

    if (import.meta.env.PROD) {
        return null
    }

    return (
        <>
            {/* Floating toggle button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
                title="Toggle Dev Panel"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </button>

            {/* Dev Panel */}
            {isVisible && (
                <div className="fixed bottom-20 right-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Dev Panel
                            </h3>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {isExpanded ? '−' : '+'}
                                </button>
                                <button
                                    onClick={() => setApiCalls([])}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    title="Clear API calls"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        {/* API Configuration */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                API Configuration
                            </h4>
                            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                <div>Base URL: {API_CONFIG.BASE_URL}</div>
                                <div>Auth API: {API_CONFIG.AUTH.BASE_URL}</div>
                                <div>Catalog API: {API_CONFIG.CATALOG.BASE_URL}</div>
                                <div>MSW Enabled: {API_CONFIG.MSW.ENABLED ? '✅' : '❌'}</div>
                            </div>
                        </div>

                        {/* API Calls */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Recent API Calls ({apiCalls.length})
                            </h4>
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {apiCalls.length === 0 ? (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        No API calls yet
                                    </p>
                                ) : (
                                    apiCalls.map((call) => (
                                        <div
                                            key={call.id}
                                            className="text-xs p-2 bg-gray-50 dark:bg-gray-700 rounded border-l-2 border-blue-500"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span
                                                    className={`font-mono text-xs px-1 py-0.5 rounded ${
                                                        call.method === 'GET'
                                                            ? 'bg-green-100 text-green-800'
                                                            : call.method === 'POST'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : call.method === 'PUT'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : call.method === 'DELETE'
                                                                  ? 'bg-red-100 text-red-800'
                                                                  : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {call.method}
                                                </span>
                                                <span className="text-gray-500">
                                                    {call.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="font-mono text-gray-700 dark:text-gray-300 truncate">
                                                {call.url}
                                            </div>
                                            {isExpanded && (
                                                <div className="mt-1 text-gray-500 space-x-2">
                                                    {call.status && (
                                                        <span>Status: {call.status}</span>
                                                    )}
                                                    {call.duration && (
                                                        <span>Duration: {call.duration}ms</span>
                                                    )}
                                                    {call.feature && (
                                                        <span>Feature: {call.feature}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
