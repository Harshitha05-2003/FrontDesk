'use client'

import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  )
}
