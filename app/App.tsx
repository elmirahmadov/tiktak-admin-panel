import { lazy, Suspense, useEffect } from "react";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Loading } from "./common/components/Loading";
import NoPermission from "./common/components/NoPermission/index";
import { ROUTER } from "./common/constants/router";
import { useRoutePermissions } from "./common/hooks/useRoutePermissions";
import { useAuth, useAuthActions } from "./common/store/auth";

const Login = lazy(() => import("./pages/Auth/Login/index"));

function App() {
  const { getProfile } = useAuthActions();
  const { user, isAuthenticated, loading } = useAuth();

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, []);

  const { routes, navigate_router } = useRoutePermissions();
  const location = useLocation();
  const { search } = location;

  if (loading) {
    return <Loading full />;
  }

  if (!isAuthenticated && !token) {
    return (
      <Suspense fallback={<Loading full />}>
        <Routes>
          <Route path={ROUTER.LOGIN} element={<Login />} />
          <Route path="*" element={<Navigate to={ROUTER.LOGIN} />} />
        </Routes>
      </Suspense>
    );
  }

  if (!isAuthenticated && token) {
    return <Loading full />;
  }

  if (user && user.role === "deactivated") {
    return <NoPermission />;
  }

  return (
    <Suspense fallback={<Loading full />}>
      <Routes>
        {routes.map((route) => {
          const Component = route.element;
          return (
            <Route
              key={route.pathname}
              path={route.pathname}
              element={<Component />}
            />
          );
        })}

        <Route
          path="*"
          element={<Navigate to={{ pathname: navigate_router, search }} />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;
