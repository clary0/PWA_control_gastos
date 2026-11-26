import { useSesion } from '../sesion/useSesion.js';
import { useEnLinea } from '../hooks/useEnLinea.js';

export default function Perfil() {
  const { usuario, entrarConGoogle, salir } = useSesion();
  const enLinea = useEnLinea();

  return (
    <main className="shell-main">
      <section className="vista-actual">
        <p className="etiqueta">MI CUENTA</p>

        <h2>Mi perfil</h2>

        {!usuario ? (
          <p>Cargando información de tu cuenta...</p>
        ) : usuario.isAnonymous ? (
          <div className="area-contenido text-center">
            <i className="bi bi-person-circle fs-1"></i>

            <h3>Estás usando la app como invitado</h3>

            <p>
              Inicia sesión con Google para identificar tu cuenta.
            </p>

            <button
              type="button"
              className="btn btn-success w-100"
              onClick={entrarConGoogle}
              disabled={!enLinea}
            >
              <i className="bi bi-google me-2"></i>
              Iniciar sesión con Google
            </button>

            {!enLinea && (
              <p className="text-secondary mt-3">
                Necesitas conexión a Internet para iniciar sesión.
              </p>
            )}
          </div>
        ) : (
          <div className="area-contenido text-center">
            {usuario.photoURL ? (
              <img
                src={usuario.photoURL}
                alt="Foto de perfil"
                className="rounded-circle mb-3"
                width="90"
                height="90"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <i className="bi bi-person-circle fs-1"></i>
            )}

            <h3>{usuario.displayName || 'Mi cuenta'}</h3>

            <p>{usuario.email}</p>

            <button
              type="button"
              className="btn btn-outline-danger w-100"
              onClick={salir}
              disabled={!enLinea}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
