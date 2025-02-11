# API del Sistema de Adopción

Esta API está diseñada para gestionar citas para adopciones de mascotas. Incluye funcionalidades para crear, actualizar y listar citas, así como gestionar la información del usuario.

## Variables de Entorno

Cree un archivo `.env` en el directorio raíz y agregue las siguientes variables:

```
MONGO_URI=<tu_cadena_de_conexión_mongodb>
PORT=<tu_puerto_del_servidor>
JWT_SECRET=<tu_secreto_jwt>
```

## Endpoints de la API

### Citas

- **Crear Cita**
  - **URL:** `/api/appointments/createAppointment`
  - **Método:** `POST`
  - **Cuerpo:**
    ```json
    {
      "date": "2023-10-15T14:48:00.000Z",
      "status": "CREATED",
      "pet": "<pet_id>",
      "user": "<user_id>"
    }
    ```

### Usuarios

- **Registrar Usuario**
  - **URL:** `/api/users/register`
  - **Método:** `POST`
  - **Cuerpo:**
    ```json
    {
      "name": "string",
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```

- **Iniciar Sesión**
  - **URL:** `/api/users/login`
  - **Método:** `POST`
  - **Cuerpo:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

- **Obtener Usuario por ID**
  - **URL:** `/api/users/:uid`
  - **Método:** `GET`

- **Eliminar Usuario**
  - **URL:** `/api/users/:uid`
  - **Método:** `DELETE`

- **Actualizar Contraseña del Usuario**
  - **URL:** `/api/users/:uid/password`
  - **Método:** `PUT`
  - **Cuerpo:**
    ```json
    {
      "newPassword": "string"
    }
    ```

### Mascotas

- **Registrar Mascota**
  - **URL:** `/api/pets/register`
  - **Método:** `POST`
  - **Cuerpo:**
    ```json
    {
      "name": "string",
      "age": "number",
      "type": "string",
      "breed": "string"
    }
    ```

- **Obtener Mascota por ID**
  - **URL:** `/api/pets/:pid`
  - **Método:** `GET`

- **Eliminar Mascota**
  - **URL:** `/api/pets/:pid`
  - **Método:** `DELETE`

- **Actualizar Información de la Mascota**
  - **URL:** `/api/pets/:pid`
  - **Método:** `PUT`
  - **Cuerpo:**
    ```json
    {
      "name": "string",
      "age": "number",
      "type": "string",
      "breed": "string"
    }
    ```

## Funcionalidades Adicionales

Las siguientes funcionalidades necesitan ser desarrolladas:

1. **Actualizar Foto del Usuario**
   - Descripción: Implementar funcionalidad para actualizar la foto de perfil del usuario.
      - **URL:** `/api/user/updateProfilePicture/:id`
      - **Método:** `PATCH`
      profilePicture: (archivo.jpg)
      Tipo: File


2. **Listar Citas**
   - Descripción: Implementar funcionalidad para listar todas las citas de un usuario.
    - **URL:** `api/appointment/`
    - **Método:** `GET`

3. **Actualizar Cita**
   - Descripción: Implementar funcionalidad para actualizar una cita existente.
    - **URL:** `/api/appointment/updateAppointment/:id`
    - **Método:** `UPDATE`
     ```json
   {
      "date": "2025-02-09T10:00:00.000Z",
      "status": "COMPLETED",
      "pet": "<pet_id>",
      "user": "<user_id>" 
    }
    ```

4. **Cancelar Cita**
   - Descripción: Implementar funcionalidad para cancelar una cita existente.
      - **URL:** `/api/appointment/cancelAppointment/:id`
      - **Método:** `PATCH`


