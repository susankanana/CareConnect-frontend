import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaNotesMedical, FaRegComment, FaUserCheck, FaUserDoctor } from "react-icons/fa6";


export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    link: string;
}

export const userDrawerData: DrawerData[] = [

    {
        id: "appointments",
        name: "Appointments",
        icon: FaNotesMedical,
        link: "appointments"
    },
    {
        id: "doctors",
        name: "Doctors",
        icon: FaUserDoctor,
        link: "doctors"
    },
    {
        id: "complaints",
        name: "Complaint",
        icon: FaRegComment,
        link: "complaints"
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
