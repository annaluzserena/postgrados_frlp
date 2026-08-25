import { Sidebar } from '@/shared/components/Sidebar';
import { WorkflowLegajo } from './inscripcion/components/WorkflowLegajo';
import { legajosFixture } from './mocks/data/legajos';

function App() {
  const legajoDePrueba = legajosFixture[0];

  return (
    <div style={{ display: 'flex' }}>
      {/* El menú lateral que hizo Anna */}
      <Sidebar />
      
      <div style={{ padding: '40px', width: '100%' }}>
        <h2>Prueba de tu componente:</h2>
        {/* Tu componente de estados */}
        <WorkflowLegajo legajo={legajoDePrueba} />
      </div>
    </div>
  );
}

export default App;