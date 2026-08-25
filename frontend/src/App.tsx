import { WorkflowLegajo } from './inscripcion/components/WorkflowLegajo';
import { legajosFixture } from './mocks/data/legajos';

function App() {
  // Tomamos el primer legajo de prueba que hicimos en el mock 
  const legajoDePrueba = legajosFixture[0];

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Prueba de tu componente:</h2>
      
      {/* Acá estamos llamando a tu componente y pasándole el dato dinámico */}
      <WorkflowLegajo legajo={legajoDePrueba} />
      
    </div>
  );
}

export default App;