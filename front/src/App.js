import "./App.css";

import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Home from "./Pages/Home/Home";
import Navigation from "./Components/Shared/Navigation/Navigation";
import Authenticate from "./Pages/Authenticate/Authenticate";
import Activate from "./Pages/Activate/Activate";
import Rooms from "./Pages/Rooms/Rooms";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./Components/hooks/useLoadingWithRefresh";
import Loader from "./Components/Shared/Loader/Loader";
import Room from "./Pages/Room/Room";



function App() {



//call refresh end points by Custom Hook
const {loading}=useLoadingWithRefresh();

  return (
    loading?(<Loader message={"Loading, Please wait..."}/>):(
      <BrowserRouter>
      <Navigation />

      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />

        <Route
          path="/authenticate"
          element={
            <GuestRoute>
              <Authenticate />
            </GuestRoute>
          }
        />

        <Route
          path="/activate"
          element={
            <SemiProtectedRoute>
              <Activate />
            </SemiProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />    
        <Route
          path="/room/:id"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    )
  );
}

const GuestRoute = ({ children }) => {
  const {isAuth}=useSelector((state)=>state.auth);
 
  let location = useLocation();
  return isAuth ? (
    <Navigate to="/rooms" state={{ from: location }} />
  ) : (
    children
  );
};

const SemiProtectedRoute = ({ children }) => {
  let location = useLocation();
  const {isAuth,user}=useSelector((state)=>state.auth);
  return !isAuth ? (
    <Navigate to="/" state={{ from: location }} />
  ) : isAuth && !user.activated ? (
    children
  ) : (
    <Navigate to="/rooms" state={{ from: location }} />
  );
};

const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  const {isAuth,user}=useSelector((state)=>state.auth);
  return !isAuth ? (
    <Navigate to="/" state={{ from: location }} />
  ) : (isAuth && !user.activated) ? (
    <Navigate to="/activate" state={{ from: location }} />
  ) : (
    children
  );
};

export default App;
