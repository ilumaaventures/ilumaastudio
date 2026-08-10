export const ROLE_LABELS = {
  admin: "Super Admin",
  vendor: "Vendor",
  employee: "Vendor Admin",
  user: "Customer",
};

export const normalizeRole = (role) => {
  if (!role) return "user";
  if (role === "super_admin") return "admin";
  if (role === "customer") return "user";
  return role;
};

export const getRoleLabel = (role) =>
  ROLE_LABELS[normalizeRole(role)] || "Customer";

export const getDashboardPath = (user) => {
  const role = normalizeRole(user?.role);

  if (role === "admin") return "/dashboard/superadmin";
  if (role === "vendor") return "/dashboard/vendor";
  if (role === "employee" || role === "business") {
    const userPerms = (user?.permissions || []).map((p) =>
      typeof p === "object" ? p.name : p
    );
    const employeePerms = (user?.employeeProfile?.permissions || []).map((p) =>
      typeof p === "object" ? p.name : p
    );
    const permissions = [...userPerms, ...employeePerms];
    const elevated =
      permissions.includes("all") ||
      permissions.includes("manage_products") ||
      permissions.includes("manage_team") ||
      permissions.includes("manage_employees");
    return elevated ? "/dashboard/vendor-admin" : "/dashboard/employee";
  }

  return "/dashboard/customer";
};

export const getAllowedRoles = (user) => {
  const role = normalizeRole(user?.role);

  if (role === "employee") {
    return ["employee"];
  }

  return [role];
};
