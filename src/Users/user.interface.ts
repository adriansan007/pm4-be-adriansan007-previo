export interface User {
  id: number; // Identificador único
  name: string; // Nombre completo
  email: string; // Correo electrónico único
  password: string; // Contraseña hash (luego del fix)
  address: string; // Dirección
  phone: string; // Teléfono
  country?: string; // País opcional
  city?: string; // Ciudad opcional
}
