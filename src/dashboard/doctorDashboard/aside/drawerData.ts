import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaNotesMedical, FaPrescriptionBottle, FaUserCheck } from "react-icons/fa6";


export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    link: string;
}

export const doctorDrawerData: DrawerData[] = [

    {
        id: "appointments",
        name: "Appointments",
        icon: FaNotesMedical,
        link: "appointments"
    },
    {
        id: "prescriptions",
        name: "Prescriptions",
        icon: FaPrescriptionBottle,
        link: "prescriptions"
    },
    {
        id: "profile",
        name: "Profile",
        icon: FaUserCheck,
        link: "profile"
    },
    {
        id: "analytics",
        name: "Analytics",
        icon: TbBrandGoogleAnalytics,
        link: "analytics"
    },

]
