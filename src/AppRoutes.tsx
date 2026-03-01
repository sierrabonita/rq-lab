import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import OptimisticUpdate from "./optimisticUpdate";
import RefetchOnWindowFocus from "./refetchOnWindowFocus";

const routings = [
  { path: "/", element: <App /> },
  { path: "/optimisticUpdate", element: <OptimisticUpdate /> },
  { path: "/refetchOnWindowFocus", element: <RefetchOnWindowFocus /> },
];

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routings.map((route, index) => {
          return (
            <Route
              key={`${index}-${route.path}`}
              path={route.path}
              element={route.element}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
