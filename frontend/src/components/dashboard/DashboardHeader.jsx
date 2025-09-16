import { ProfileDropdown } from "../ProfileDropdown";

export function DashboardHeader({ 
  title, 
  subtitle, 
  userData, 
  actions = [] 
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
      </div>
      <div className="flex items-center space-x-3">
        {actions.map((action, index) => (
          <div key={index}>{action}</div>
        ))}
        <ProfileDropdown userData={userData} />
      </div>
    </div>
  );
}