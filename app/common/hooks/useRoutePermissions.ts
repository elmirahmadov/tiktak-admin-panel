import { lazy, useEffect, useState } from "react";

import { ROUTER } from "../constants/router";
import { useAuth } from "../store/auth";

type RouterItem = {
  key: string;
  pathname: string;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
};

type Router = RouterItem[];

const login = lazy(() => import("@/pages/Auth/Login/index"));
const categories = lazy(() => import("@/pages/Categories/index"));
const products = lazy(() => import("@/pages/Products/index"));
const campaigns = lazy(() => import("@/pages/Campaigns/index"));
const orders = lazy(() => import("@/pages/Orders/index"));
const users = lazy(() => import("@/pages/Users/index"));

const app_router: Router = [
  {
    key: "login",
    pathname: ROUTER.LOGIN,
    element: login,
  },
  {
    key: "categories",
    pathname: ROUTER.CATEGORIES,
    element: categories,
  },
  {
    key: "products",
    pathname: ROUTER.PRODUCTS,
    element: products,
  },
  {
    key: "campaigns",
    pathname: ROUTER.CAMPAIGNS,
    element: campaigns,
  },
  {
    key: "orders",
    pathname: ROUTER.ORDERS,
    element: orders,
  },
  {
    key: "users",
    pathname: ROUTER.USERS,
    element: users,
  },
];

export const useRoutePermissions = () => {
  const [routes, setRoutes] = useState<Router>([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    accessRouter();
  }, [user, isAuthenticated]);

  function accessRouter() {
    if (!isAuthenticated) {
      const loginRoute = app_router.find((route) => route.key === "login");
      if (loginRoute) {
        setRoutes([loginRoute]);
      }
      return;
    }
    let permission_router: string[] = [];

    if (user?.role === "admin") {
      permission_router = app_router.map((route) => route.key);
    } else if (user?.role === "manager") {
      permission_router = ["dashboard", "categories", "products", "profile"];
    } else {
      permission_router = ["dashboard", "profile"];
    }

    const access: Router = app_router.filter((route) =>
      permission_router.includes(route.key)
    );

    setRoutes(access);
  }

  return {
    routes,
    navigate_router: isAuthenticated
      ? routes?.[0]?.pathname || ROUTER.CAMPAIGNS
      : ROUTER.LOGIN,
  };
};
