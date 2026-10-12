import type { ReactNode } from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';

type DashboardLayoutProps = {
    children: ReactNode;
    hideSidebar?: boolean;
};

function DashboardLayout({ children, hideSidebar = false }: DashboardLayoutProps) {
    return (
        <div className="d-flex flex-column vh-100 bg-body-tertiary">
            <TopBar />

            <div className="d-flex flex-grow-1 overflow-hidden">
                {!hideSidebar && <SideBar />}

                <main className="flex-grow-1 overflow-auto p-4 p-lg-5">
                    <div className="mx-auto w-100" style={{ maxWidth: 1100 }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;