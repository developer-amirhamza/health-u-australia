"use client"
// TEMPORARY test harness — delete after testing.
import React, { useEffect, useState } from 'react'
import { ContractPages, buildContractPdf } from 'app/common/contractPages'

export default function PageTest() {
  const [html, setHtml] = useState('')
  useEffect(() => {
    const f = new URLSearchParams(location.search).get('f') || 'fulltime'
    fetch(`/__pagetest/${f}.html`).then(r => r.text()).then(setHtml)
  }, [])
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div id="preview">
        {html && <ContractPages html={html} onPages={p => {
          (window as any).__pages = p;
          (window as any).__pdf = async () => (await buildContractPdf(p)).output('datauristring')
        }} />}
      </div>
    </div>
  )
}
