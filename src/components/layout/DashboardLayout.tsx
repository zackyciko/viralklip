import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-background-dark relative">
                <Header />
                <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
