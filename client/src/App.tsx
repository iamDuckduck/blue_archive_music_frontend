import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./layout/rootLayout";
import Library from "./pages/Library";
import SongPage from "./pages/SongPage";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout></RootLayout>}>
          <Route index element={<Home />}></Route>
          <Route path="library" element={<Library />}></Route>
          <Route path="library/albums/:albumId" element={<SongPage />}></Route>
        </Route>
      </>
    )
  );
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
