import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router'
import { Menu } from 'lucide-react'

const SidebarLayout = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(() => {
        return localStorage.getItem('sidebar-collapsed') === 'true'
    })

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', collapsed)
    }, [collapsed])

    return (
        <div className={`sidebar-layout ${collapsed ? 'sidebar-layout--collapsed' : ''}`}>
            <Sidebar
                isOpen={isOpen}
                onToggle={() => setIsOpen(false)}
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed(!collapsed)}
            />

            {/* Mobile hamburger */}
            <button
                className="sidebar-hamburger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle sidebar"
            >
                <Menu size={20} />
            </button>

            <div className="sidebar-content">
                <Outlet />
            </div>
        </div>
    )
}

export default SidebarLayout
