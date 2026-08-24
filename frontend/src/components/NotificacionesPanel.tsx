// frontend/src/components/NotificacionesPanel.tsx
import './NotificacionesPanel.css';
export const NotificacionesPanel = () => {
  const closeNotifDrawer = () => {
    console.log("Cerrar cajón de notificaciones");
  };

  const markAllRead = () => {
    console.log("Marcar todas como leídas");
  };

  return (
    <div className="notif-drawer " id="notifDrawer">
      
      <div className="notif-drawer-header">
        <div className="notif-drawer-title">Centro de notificaciones</div>
        <button className="notif-drawer-close" onClick={closeNotifDrawer}>
          ✕
        </button>
      </div>
      
      <div className="notif-drawer-body"  id="drawerNotifList">
         <p style={{ padding: '1rem', color: '#666', fontSize: '14px' }}>
            No hay notificaciones nuevas.
         </p>
      </div>
      
      <div className="notif-drawer-footer">
        <button 
          className="btn" 
          style={{ width: '100%' }} 
          onClick={() => {
            markAllRead();
            closeNotifDrawer();
          }}
        >
          Marcar todas como leídas
        </button>
      </div>

    </div>
  );
};