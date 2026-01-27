import { TbBrandGoogleAnalytics } from 'react-icons/tb';
import { FaNotesMedical, FaRegComment, FaUserCheck, FaUserDoctor, FaPills } from 'react-icons/fa6';
import { RiSecurePaymentLine } from 'react-icons/ri';

export type DrawerData = {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  link: string;
};

export const userDrawerData: DrawerData[] = [
  {
    id: 'appointments',
    name: 'Appointments',
    icon: FaNotesMedical,
    link: 'appointments',
  },
  {
    id: 'doctors',
    name: 'Doctors',
    icon: FaUserDoctor,
    link: 'doctors',
  },
  {
    id: 'prescriptions',
    name: 'Prescriptions',
    icon: FaPills,
    link: 'prescriptions',
  },
  {
    id: 'complaints',
    name: 'Complaints',
    icon: FaRegComment,
    link: 'complaints',
  },
  {
    id: 'payments',
    name: 'Payments',
    icon: RiSecurePaymentLine,
    link: 'payments',
  },
  {
    id: 'profile',
    name: 'Profile',
    icon: FaUserCheck,
    link: 'profile',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: TbBrandGoogleAnalytics,
    link: 'analytics',
  },
];
