/* ──────────────────────────────────────────────────────────────────
   Store de données applicatives (targets, scans).
   CRUD local basé sur mockData, prêt pour l'API réelle.
   ──────────────────────────────────────────────────────────────── */
import { create } from 'zustand'
import type { Target, Scan, CreateTargetRequest, ScanStatus } from '../types'
import { mockTargets, mockScans } from '../lib/mockData'

interface DataState {
  targets: Target[]
  scans: Scan[]

  /* Targets */
  addTarget: (data: CreateTargetRequest, userId: string) => Target
  deleteTarget: (id: string) => void

  /* Scans */
  createScan: (targetId: string, userId: string) => Scan
  cancelScan: (id: string) => void
  getScanById: (id: string) => Scan | undefined
  getTargetById: (id: string) => Target | undefined
}

const delay = () => new Promise(r => setTimeout(r, 400))

export const useDataStore = create<DataState>()((set, get) => ({
  targets: [...mockTargets],
  scans: [...mockScans],

  addTarget: (data, userId) => {
    const target: Target = {
      id: 't-' + Date.now(),
      ...data,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set(s => ({ targets: [target, ...s.targets] }))
    return target
  },

  deleteTarget: (id) => {
    set(s => ({ targets: s.targets.filter(t => t.id !== id) }))
  },

  createScan: (targetId, userId) => {
    const target = get().targets.find(t => t.id === targetId)
    const scan: Scan = {
      id: 's-' + Date.now(),
      status: 'PENDING' as ScanStatus,
      userId,
      targetId,
      target,
      attacks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set(s => ({ scans: [scan, ...s.scans] }))

    /* Simule passage RUNNING après 1s, FINISHED après 4s */
    setTimeout(() => {
      set(s => ({
        scans: s.scans.map(sc =>
          sc.id === scan.id ? { ...sc, status: 'RUNNING' as ScanStatus, startedAt: new Date().toISOString() } : sc
        ),
      }))
    }, 1000)
    setTimeout(() => {
      set(s => ({
        scans: s.scans.map(sc =>
          sc.id === scan.id ? { ...sc, status: 'FINISHED' as ScanStatus, finishedAt: new Date().toISOString() } : sc
        ),
      }))
    }, 4000)

    return scan
  },

  cancelScan: (id) => {
    set(s => ({
      scans: s.scans.map(sc =>
        sc.id === id && (sc.status === 'PENDING' || sc.status === 'RUNNING')
          ? { ...sc, status: 'CANCELLED' as ScanStatus }
          : sc
      ),
    }))
  },

  getScanById: (id) => get().scans.find(s => s.id === id),
  getTargetById: (id) => get().targets.find(t => t.id === id),
}))
