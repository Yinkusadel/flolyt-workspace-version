import { RouterProvider } from "react-router";
import { routes } from "./route/route";


function App() {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;