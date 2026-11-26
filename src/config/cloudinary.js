
// Datos de configuración de Cloudinary.
export const CLOUD_NAME = 'kotatycx';
export const UPLOAD_PRESET = 'control_gastos';

// Activa la sincronización cuando los datos estén configurados.
export const imagenesActivas =
  CLOUD_NAME !== 'TU_CLOUD_NAME' &&
  UPLOAD_PRESET !== 'TU_UPLOAD_PRESET';
