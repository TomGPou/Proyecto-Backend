// Error dictionary
const errorsDictonary = {
  UNHANDLED_ERROR: { code: 0, status: 500, message: "Error no identificado" },
  ROUTING_ERROR: { code: 1, status: 404, message: "Ruta no encontrada" },
  FEW_PARAMETERS: { code: 2, status: 400, message: "Faltan parámetros obligatorios" },
  INVALID_MONGOID_FORMAT: { code: 3, status: 400, message: "Formato de id no válido" },
  INVALID_PARAMETER: { code: 4, status: 400, message: "Parámetro no válido" },
  INVALID_TYPE: { code: 5, status: 400, message: "Tipo de parámetro no válido" },
  ID_NOT_FOUND: { code: 6, status: 404, message: "Id no encontrado" },
  PAGE_NOT_FOUND: { code: 7, status: 404, message: "Página no encontrada" },
  DATABASE_ERROR: { code: 8, status: 500, message: "No se puede conectar a la base de datos" },
  INTERNAL_ERROR: { code: 9, status: 500, message: "Error interno de ejecución del servidor" },
  RECORD_CREATION_ERROR: { code: 10, status: 500, message: "No se puede crear el registro" },
  USER_NOT_FOUND: { code: 11, status: 404, message: "Usuario no encontrado" },
  USER_ALREADY_EXISTS: { code: 12, status: 400, message: "Usuario ya existe" },
};

export default errorsDictonary;
