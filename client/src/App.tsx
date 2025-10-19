import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./layout/rootLayout";
import OstGrid from "./pages/OstGrid";
import Main from "./pages/Main";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout></RootLayout>}>
          <Route index element={<Home />}></Route>
          <Route path="main" element={<Main></Main>}></Route>
          <Route path="OST" element={<OstGrid></OstGrid>}></Route>
        </Route>
      </>
    )
  );
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
