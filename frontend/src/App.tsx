import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './dashboard-coordinador/pages/Dashboard';
import LoginScreen from "./Login/pages/Login";
import WelcomeScreen from "./Login/pages/WelcomeScreen";
import Alerta from "./AlertasNotificaciones/pages/Alerta";
import NotFound from "./shared/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<LoginScreen />}/>
          <Route path="dashboard" element={<Dashboard />}/>
          <Route path="welcome" element={<WelcomeScreen />}/>
          <Route path="inscripcion"/>
          <Route path="notificacion" element={<Alerta />}/>
          <Route path="*" element={<NotFound />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
} 

  /*import  Alerta from "./AlertasNotificaciones/pages/Alerta"
     export default function App() {
         return (
        <Alerta/>
         );
     }*/
