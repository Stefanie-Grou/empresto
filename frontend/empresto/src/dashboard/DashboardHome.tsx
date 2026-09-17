import HeaderLogoSidebar from "../assets/HeaderLogoSidebar"
import Sidebar from "./Sidebar"
import { Icon } from '@iconify/react';

export default function DashboardHome() {
    return (
        <div>
            <div className=" font-inter bg-main-background-green">
                <div className="center-horizontally">
                    <HeaderLogoSidebar />
                    <Icon className='text-secondary-light-green border rounded-sm m-10'
                        icon="lucide:arrow-left-to-line"
                    />
                </div>
                <Sidebar />

            </div>
            <div className="bg-white-background">
                <p>Lá</p>
            </div>
        </div>
    )
}