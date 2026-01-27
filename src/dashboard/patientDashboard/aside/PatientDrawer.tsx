import { Link, useLocation } from 'react-router';
import { userDrawerData } from './drawerData';

const PatientDrawer = () => {
  const location = useLocation();

  // Helper to determine if link is active
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Menu Label matches Doctor View */}
      <div className="p-6">
        <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-[#2dd4bf]">
          DASHBOARD MENU
        </h2>
      </div>

      <nav className="flex-1 px-4 py-2">
        <div className="mb-6 px-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            PATIENT SERVICES
          </p>
        </div>

        <ul className="space-y-1">
          {userDrawerData.map((item) => {
            const active = isActive(item.link);

            return (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                    active
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`${
                    active ? 'text-[#2dd4bf]' : 'text-gray-500 group-hover:text-[#2dd4bf]'
                  }`}>
                    <item.icon size={20} />
                  </div>

                  <span className="text-[15px] font-semibold tracking-wide">
                    {item.name}
                  </span>

                  {active && (
                    <div className="ml-auto w-1.5 h-6 bg-[#d91e5b] rounded-full shadow-[0_0_10px_rgba(217,30,91,0.4)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Branding */}
      <div className="p-6 mt-auto">
        <div className="py-4 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            CareConnect Health
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientDrawer;