import { lazy, Suspense, useEffect, useState } from "react";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import styles from "./App.module.css";
import TikTakAdminHeader from "./common/components/Header/Header";
import { Loading } from "./common/components/Loading";
import NoPermission from "./common/components/NoPermission/index";
import Sidebar from "./common/components/Sidebar/Sidebar";
import { ROUTER } from "./common/constants/router";
import { useRoutePermissions } from "./common/hooks/useRoutePermissions";
import { useAuth, useAuthActions } from "./common/store/auth";

const Login = lazy(() => import("./pages/Auth/Login/index"));
const Campaigns = lazy(() => import("./pages/Campaigns/index"));
const Categories = lazy(() => import("./pages/Categories/index"));
const Products = lazy(() => import("./pages/Products/index"));
const Users = lazy(() => import("./pages/Users/index"));
const Orders = lazy(() => import("./pages/Orders/index"));

function App() {
  const { getProfile } = useAuthActions();
  const { user, loading } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const token = localStorage.getItem("access_token");
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await (getProfile as any)(token);
        } catch (error) {
          console.error("Profil yükleme hatası:", error);
        } finally {
          setInitialLoading(false);
          setAuthChecked(true);
        }
      } else {
        setInitialLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [token]);

  useEffect(() => {
    if (user) {
      setAuthChecked(true);
    }
  }, [user]);

  const { routes, navigate_router } = useRoutePermissions();
  const { search } = location;

  if (location.pathname === ROUTER.LOGIN) {
    return (
      <Suspense fallback={<Loading full />}>
        <Routes>
          <Route path={ROUTER.LOGIN} element={<Login />} />
        </Routes>
      </Suspense>
    );
  }

  if (initialLoading || loading || !authChecked) {
    return <Loading full />;
  }

  if (!token) {
    return <Navigate to={ROUTER.LOGIN} />;
  }

  if (!user) {
    return <Loading full />;
  }

  const userRole = (user as any)?.data?.data?.role;

  if (!userRole || userRole !== "ADMIN") {
    return <NoPermission />;
  }

  return (
    <div className={styles.app}>
      <TikTakAdminHeader />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.content}>
          <Suspense fallback={<div></div>}>
            <Routes>
              <Route path={ROUTER.ORDERS} element={<Orders />} />
              <Route path={ROUTER.CAMPAIGNS} element={<Campaigns />} />
              <Route path={ROUTER.CATEGORIES} element={<Categories />} />
              <Route path={ROUTER.PRODUCTS} element={<Products />} />
              <Route path={ROUTER.USERS} element={<Users />} />
              {routes.map((route) => {
                if (
                  ![
                    ROUTER.ORDERS,
                    ROUTER.CAMPAIGNS,
                    ROUTER.CATEGORIES,
                    ROUTER.PRODUCTS,
                    ROUTER.USERS,
                  ].includes(route.pathname)
                ) {
                  const Component = route.element;
                  return (
                    <Route
                      key={route.pathname}
                      path={route.pathname}
                      element={<Component />}
                    />
                  );
                }
                return null;
              })}

              <Route path="/" element={<Navigate to={ROUTER.CAMPAIGNS} />} />
              <Route
                path="*"
                element={
                  <Navigate to={{ pathname: navigate_router, search }} />
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
