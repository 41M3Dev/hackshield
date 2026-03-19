import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Topbar from '../Topbar'

/**
 * Layout principal du dashboard.
 * Sidebar fixe à gauche + zone principale avec Topbar + Outlet.
 */
export default function DashboardLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#080C18]">
      <div className="
        flex flex-1 m-2 rounded-[20px] overflow-hidden
        bg-bg border border-white/[0.06]
        shadow-[0_0_60px_rgba(139,92,246,0.04),0_0_120px_rgba(0,0,0,0.5)]
      ">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
