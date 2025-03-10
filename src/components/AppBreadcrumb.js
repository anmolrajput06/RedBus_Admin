import React from "react";
import { useLocation } from "react-router-dom";
import routes from "../routes";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname;

  const getRouteName = (pathname, routes) => {
    // Match static routes first
    const exactMatch = routes.find((route) => route.path === pathname);
    if (exactMatch) return exactMatch.name;

    // Match dynamic routes (like "/admin/userreport/:id")
    const dynamicMatch = routes.find((route) => {
      const routePattern = route.path.replace(/:\w+/g, ".*"); // Replace :id with wildcard
      return new RegExp(`^${routePattern}$`).test(pathname);
    });

    return dynamicMatch ? dynamicMatch.name : false;
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    const pathSegments = location.split("/");

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      if (!segment) return; // Ignore empty segments

      currentPath += `/${segment}`;
      const routeName = getRouteName(currentPath, routes);

      if (routeName) {
        breadcrumbs.push({
          pathname: currentPath,
          name: routeName,
          active: index === pathSegments.length - 1,
        });
      }
    });

    if (currentLocation.includes("/admin/userreport/")) {
      breadcrumbs.splice(
        breadcrumbs.length - 1,
        0,
        { pathname: "#/admin/tables", name: "User List", active: false }
      );
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="#/admin/dashboard">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
          key={index}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
