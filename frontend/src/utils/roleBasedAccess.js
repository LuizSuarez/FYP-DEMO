// src/utils/roleBasedAccess.js

// User roles from backend enum
export const USER_ROLES = {
  USER: 'User',
  CLINICIAN: 'Clinician',
  ADMIN: 'Admin'
};

// Check if user has specific role
export const hasRole = (user, role) => {
  if (!user || !user.role) return false;
  return user.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (user, roles) => {
  if (!user || !user.role || !Array.isArray(roles)) return false;
  return roles.includes(user.role);
};

// Check if user can access a resource based on role hierarchy
export const canAccess = (user, requiredRoles) => {
  if (!user || !user.role) return false;
  if (!requiredRoles || requiredRoles.length === 0) return true;
  
  // Role hierarchy: Admin > Clinician > User
  const roleHierarchy = {
    [USER_ROLES.ADMIN]: 3,
    [USER_ROLES.CLINICIAN]: 2,
    [USER_ROLES.USER]: 1
  };
  
  const userLevel = roleHierarchy[user.role] || 0;
  const minRequiredLevel = Math.min(...requiredRoles.map(role => roleHierarchy[role] || Infinity));
  
  return userLevel >= minRequiredLevel;
};

// Get user role display name
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [USER_ROLES.USER]: 'Patient/User',
    [USER_ROLES.CLINICIAN]: 'Healthcare Provider',
    [USER_ROLES.ADMIN]: 'Administrator'
  };
  
  return displayNames[role] || role;
};

// Check if user can perform specific actions
export const permissions = {
  // File operations
  canUploadFiles: (user) => hasAnyRole(user, [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN]),
  canViewOwnFiles: (user) => hasAnyRole(user, [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN]),
  canViewAllFiles: (user) => hasAnyRole(user, [USER_ROLES.ADMIN]),
  canDeleteFiles: (user) => hasAnyRole(user, [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN]),
  
  // Analysis operations
  canRunAnalysis: (user) => hasAnyRole(user, [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN]),
  canViewOwnAnalysis: (user) => hasAnyRole(user, [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN]),
  canViewAllAnalysis: (user) => hasAnyRole(user, [USER_ROLES.CLINICIAN, USER_ROLES.ADMIN]),
  
  // Project operations
  canCreateProjects: (user) => hasAnyRole(user, [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN]),
  canManageProjects: (user) => hasAnyRole(user, [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN]),
  
  // Administrative operations
  canViewUserManagement: (user) => hasRole(user, USER_ROLES.ADMIN),
  canManageUsers: (user) => hasRole(user, USER_ROLES.ADMIN),
  canViewSystemLogs: (user) => hasRole(user, USER_ROLES.ADMIN),
  
  // Clinical operations
  canViewPatientData: (user) => hasAnyRole(user, [USER_ROLES.CLINICIAN, USER_ROLES.ADMIN]),
  canGenerateReports: (user) => hasAnyRole(user, [USER_ROLES.CLINICIAN, USER_ROLES.ADMIN]),
  canAccessDiagnosticTools: (user) => hasAnyRole(user, [USER_ROLES.CLINICIAN, USER_ROLES.ADMIN])
};

// Filter navigation items based on user role
export const filterNavigationByRole = (navigationItems, user) => {
  if (!user || !user.role) return [];
  
  return navigationItems.filter(item => {
    // If no roles specified, allow all authenticated users
    if (!item.requiredRoles || item.requiredRoles.length === 0) return true;
    
    // Check if user has any of the required roles
    return hasAnyRole(user, item.requiredRoles);
  });
};
