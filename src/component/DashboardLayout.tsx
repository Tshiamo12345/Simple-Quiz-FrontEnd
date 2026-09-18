import type { ReactNode } from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';

type DashboardLayoutProps = {
    children: ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="dashboard-shell">
            <TopBar />
            <div className="dashboard-body">
                <SideBar />
                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    );
}

export default DashboardLayout;
