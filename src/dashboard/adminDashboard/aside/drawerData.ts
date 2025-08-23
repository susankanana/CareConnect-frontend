import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { FaUserCheck, FaUserDoctor, FaNotesMedical, FaRegComment } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";


export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    link: string;
}

export const adminDrawerData: DrawerData[] = [

    {
        id: "users",
        name: "Users",
        icon: FiUsers,
        link: "users"
    },
    {
        id: "doctors",
        name: "Doctors",
        icon: FaUserDoctor,
        link: "doctors"
    },
    {
        id: "appointments",
        name: "Appointments",
        icon: FaNotesMedical,
        link: "appointments"
    },
    {
        id: "complaints",
        name: "Complaints",
        icon: FaRegComment,
        link: "complaints"
    },
    {
        id: "payments",
        name: "Payments",
        icon: MdOutlinePayments,
        link: "payments"
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
