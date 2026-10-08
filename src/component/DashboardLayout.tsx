import type { ReactNode } from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';

type DashboardLayoutProps = {
    children: ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="d-flex flex-column vh-100 bg-light">
            <TopBar />

            <div className="d-flex flex-grow-1 overflow-hidden">
                <SideBar />

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