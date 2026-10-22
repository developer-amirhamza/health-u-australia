'use client'

import { createContext, useContext } from 'react'
import { useManagedPage } from 'app/(main)/(pages)/_managed/useManagedPage'

export type HomeContent = {
  hero: { welcome: string; title: string; highlight: string; description: string; image: string; contactLabel: string; contactHref: string; phone: string }
  about: { eyebrow: string; title: string; highlight: string; description: string; image: string; buttonLabel: string; buttonHref: string }
  services: { title: string; image: string; path: string }[]
  choose: { title: string; paragraph: string }[]
  review: { url: string; label: string }
  contact: { phone1: string; phone2: string; email: string; hours: string }
}

const Context = createContext<HomeContent | null>(null)

export function HomeContentProvider({ children }: { children: React.ReactNode }) {
  const { data } = useManagedPage<HomeContent>('home')
  return <Context.Provider value={data}>{children}</Context.Provider>
}

export function useHomeContent() { return useContext(Context) }
