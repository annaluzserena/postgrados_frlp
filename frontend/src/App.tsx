import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './dashboard-coordinador/pages/Dashboard';
import LoginScreen from "./Login/pages/Login";
import WelcomeScreen from "./Login/pages/WelcomeScreen";
import { ConsultarEstado } from "./inscripcion-aspirante/pages/ConsultarEstado";
import NotFound from "./shared/pages/NotFound";
import InscripcionWizard from './inscripcion-aspirante/pages/InscripcionWizard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<LoginScreen />}/>
          <Route path="panel" element={<Dashboard path="/panel"/>}/>
          <Route path="inscriptos" element={<Dashboard path="/inscriptos" />} />
          <Route path="inscriptos/:id" element={<Dashboard path="/:id" />} />
          <Route path="welcome" element={<WelcomeScreen />}/>
          <Route path="consultar" element={<ConsultarEstado />} />
          <Route path="inscripcion" element={<InscripcionWizard />}/>
          <Route path="*" element={<NotFound />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}