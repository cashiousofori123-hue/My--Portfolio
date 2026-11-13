import { Suspense, lazy } from "react";
import App from "./App.jsx";
import ContentProvider from "./ContentProvider.jsx";

// your-site/admin opens the admin page; it is loaded only then, so visitors never download it.
const Admin = lazy(() => import("./admin/Admin.jsx"));

export default function Root() {
  if (/^\/admin\/?$/.test(window.location.pathname)) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }
  return (
    <ContentProvider>
      <App />
    </ContentProvider>
  );
}
