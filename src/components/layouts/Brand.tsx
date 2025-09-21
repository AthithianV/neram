import NeramLogo from '@/assets/logo.png';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';

const Brand = () => {
    return (
        <div className="px-2">
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className="font-bold flex items-center gap-2 p-0 hover:bg-transparent"
                >
                    <div className="flex items-center gap-2">
                        <img
                            src={NeramLogo}
                            alt="Neram Logo"
                            className="h-6 w-6 rounded-md"
                        />
                        <span className="text-base font-semibold whitespace-nowrap">
                            Neram
                        </span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </div>
    );
};

export default Brand;
