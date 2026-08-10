export const getAllPermissions = (user, reduxPermissions = []) => {
  const userPerms = (user?.permissions || []).map((p) =>
    typeof p === "object" ? p.name : p,
  );

  const employeePerms = (user?.employeeProfile?.permissions || []).map((p) =>
    typeof p === "object" ? p.name : p,
  );

  const vendorPerms = (user?.vendorProfile?.permissions || []).map((p) =>
    typeof p === "object" ? p.name : p,
  );

  const statePerms = (reduxPermissions || []).map((p) =>
    typeof p === "object" ? p.name : p,
  );

  return [
    ...new Set([...userPerms, ...employeePerms, ...vendorPerms, ...statePerms]),
  ];
};

export const hasPermission = (
  user,
  reduxPermissions,
  ...requiredPermissions
) => {
  if (user?.role === "super_admin" || user?.role === "admin") {
    return true;
  }

  const permissions = getAllPermissions(user, reduxPermissions);

  const moduleMap = {
    create_products: ["create_products", "Manage Products"],
    update_products: ["update_products", "Manage Products"],
    delete_products: ["delete_products", "Manage Products"],
    view_products: ["view_products", "Manage Products"],

    create_categories: ["create_categories", "Manage Categories"],
    update_categories: ["update_categories", "Manage Categories"],
    delete_categories: ["delete_categories", "Manage Categories"],
    view_categories: ["view_categories", "Manage Categories"],

    create_customers: ["create_customers", "Manage Customers"],
    update_customers: ["update_customers", "Manage Customers"],
    delete_customers: ["delete_customers", "Manage Customers"],
    view_customers: ["view_customers", "Manage Customers"],

    create_orders: ["create_orders", "Manage Orders"],
    update_orders: ["update_orders", "Manage Orders"],
    delete_orders: ["delete_orders", "Manage Orders"],
    view_orders: ["view_orders", "Manage Orders"],

    create_employees: ["create_employees", "Manage Employees", "manage_team"],
    update_employees: ["update_employees", "Manage Employees", "manage_team"],
    delete_employees: ["delete_employees", "Manage Employees", "manage_team"],
    view_employees: ["view_employees", "Manage Employees", "manage_team"],

    create_coupons: ["create_coupons", "manage_coupons", "Manage Coupons"],
    update_coupons: ["update_coupons", "manage_coupons", "Manage Coupons"],
    delete_coupons: ["delete_coupons", "manage_coupons", "Manage Coupons"],
    view_coupons: ["view_coupons", "manage_coupons", "Manage Coupons"],

    view_inventory: ["view_inventory", "Manage Inventory"],
    view_reports: ["view_reports", "Manage Reports"],
  };

  const expandedPermissions = requiredPermissions.reduce((acc, curr) => {
    const fallbacks = moduleMap[curr] || [];
    return [...acc, curr, ...fallbacks];
  }, []);

  return expandedPermissions.some(
    (permission) =>
      permissions.includes("all") || permissions.includes(permission),
  );
};
