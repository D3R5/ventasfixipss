# 🛒 VentasFix Backoffice 
## 👨‍💻 Autor
Diego Rivera Spröhnle
## 📌 Descripción

Este proyecto corresponde al desarrollo de un **Backoffice administrativo** para la empresa *VentasFix*, construido con **Next.js (App Router)**, **Prisma ORM** y **MySQL**.

El sistema permite administrar:

* 👤 Usuarios (trabajadores del sistema)
* 📦 Productos
* 🏢 Clientes empresa
* 📊 Dashboard con métricas

Además, cuenta con autenticación mediante **JWT** y protección de rutas.

---

## 🚀 Tecnologías utilizadas

* Next.js 14 (App Router)
* React + Tailwind CSS
* Prisma ORM
* MySQL
* JWT (jsonwebtoken)
* bcryptjs (hash de contraseñas)

---

## 🔐 Autenticación

El sistema utiliza **JWT**:

* Login genera un token
* El token se guarda en `localStorage`
* Se envía en cada request protegido:

```
Authorization: Bearer TU_TOKEN
```

---

## 🧠 Funcionalidades principales

### 👤 Usuarios

* Crear usuario
* Login
* Listar usuarios
* Editar usuario
* Eliminar usuario

📌 Restricción:

* Email obligatorio con dominio `@ventasfix.cl`
* Password cifrada en BD

---

### 📦 Productos

* CRUD completo
* Cálculo automático de precio con IVA (19%)

---

### 🏢 Clientes

* CRUD completo
* Validación de email de contacto

---

### 📊 Dashboard

* Total de usuarios
* Total de productos
* Total de clientes

---

## 🗂️ Estructura del proyecto

```
app/
 ├── api/
 │   ├── auth/
 │   ├── users/
 │   ├── products/
 │   ├── clients/
 ├── dashboard/
 ├── users/
 ├── products/
 ├── clients/
 ├── login/
 ├── register/

lib/
 ├── prisma.ts
 ├── auth.ts
```

---

## ⚙️ Configuración del proyecto

### 1. Variables de entorno (.env)

```
DATABASE_URL="mysql://user:password@localhost:3306/ventasfix"
JWT_SECRET="supersecret"
```

---

### 2. Instalación

```
npm install
```

---

### 3. Prisma

```
npx prisma migrate dev
npx prisma generate
```

---

### 4. Ejecutar

```
npm run dev
```

---

## 🌐 URLs del Frontend

| Función   | URL                             |
| --------- | ------------------------------- |
| Inicio    | http://localhost:3000           |
| Login     | http://localhost:3000/login     |
| Registro  | http://localhost:3000/register  |
| Dashboard | http://localhost:3000/dashboard |
| Usuarios  | http://localhost:3000/users     |
| Productos | http://localhost:3000/products  |
| Clientes  | http://localhost:3000/clients   |

---

## 🔌 API - Endpoints

### 🔐 AUTH

#### 🟢 Registro

```
POST http://localhost:3000/api/auth?action=register
```

Body:

```json
{
  "rut": "12345678-9",
  "nombre": "Diego",
  "apellido": "Rivera",
  "email": "diego@ventasfix.cl",
  "password": "123456"
}

```
<img width="1022" height="382" alt="registro" src="https://github.com/user-attachments/assets/7cc72ddf-2fc4-40bf-939b-f7b824210e00" />

---

#### 🔵 Login

```
POST http://localhost:3000/api/auth?action=login
```

Body:

```json
{
  "email": "diego@ventasfix.cl",
  "password": "123456"
}
```
<img width="1022" height="384" alt="login" src="https://github.com/user-attachments/assets/17a1a205-59c5-446f-a638-f367dcb5b7f2" />



📌 Respuesta: devuelve `token`

---

## 👤 USERS

### GET todos

```
GET http://localhost:3000/api/users
```
![Uploading obtener todos los usuarios.png…]()

### GET por ID

```
GET http://localhost:3000/api/users/1
```
<img width="1025" height="244" alt="obtener usuarios por id" src="https://github.com/user-attachments/assets/965f9f7b-4261-46fb-8e94-751868d185d2" />

### POST crear

```
POST http://localhost:3000/api/users
```

Body:

```json
{
  "rut": "11111111-1",
  "nombre": "Admin",
  "apellido": "Test",
  "email": "admin@ventasfix.cl",
  "password": "123456"
}
```
<img width="1026" height="256" alt="crear usuario" src="https://github.com/user-attachments/assets/7911f361-07da-479a-9091-5abe25613948" />

### PUT actualizar

```
PUT http://localhost:3000/api/users/1
```
<img width="1025" height="244" alt="actualizar usuario" src="https://github.com/user-attachments/assets/a3ef6204-cef8-4b36-9e7d-0c36bf9b868d" />

### DELETE

```
DELETE http://localhost:3000/api/users/1
```
<img width="1021" height="234" alt="borrar usuario" src="https://github.com/user-attachments/assets/7d88542c-eb54-4191-b49e-865c70bd67f4" />

---

## 📦 PRODUCTS

### GET todos

```
GET http://localhost:3000/api/products
```
<img width="1483" height="648" alt="obtener todos los productos" src="https://github.com/user-attachments/assets/78c52bb4-560d-4dba-ad8d-5e57b8bbf313" />

### GET por ID

```
GET http://localhost:3000/api/products/1
```
<img width="1025" height="383" alt="obtener productos por id" src="https://github.com/user-attachments/assets/5f1f555b-b9a5-4695-93b2-dbe29709c2f2" />

### POST crear

```json
POST http://localhost:3000/api/products
```

Body:

```json
{
  "sku": "ABC123",
  "nombre": "Producto 1",
  "descripcion_corta": "Corto",
  "descripcion_larga": "Largo",
  "imagen": "img.jpg",
  "precio_neto": 10000,
  "stock_actual": 10,
  "stock_minimo": 2,
  "stock_bajo": 3,
  "stock_alto": 20
}
```
<img width="1026" height="368" alt="crear producto" src="https://github.com/user-attachments/assets/a52f2931-63ca-4487-9758-c832e01c7d08" />

### PUT actualizar

```
PUT http://localhost:3000/api/products/1
```
<img width="1026" height="366" alt="producto actualizado" src="https://github.com/user-attachments/assets/4a3037c7-aab3-4378-a30f-53bbc4ba56d9" />

### DELETE

```
DELETE http://localhost:3000/api/products/1
```
<img width="1024" height="167" alt="producto eliminado" src="https://github.com/user-attachments/assets/0275cc05-aa50-4b06-ac51-adf8188ac546" />

---

## 🏢 CLIENTS

### GET todos

```
GET http://localhost:3000/api/clients
```
<img width="1489" height="526" alt="obtener todos los clientes" src="https://github.com/user-attachments/assets/973662ce-f46e-4d86-be96-51df5a76581f" />

### GET por ID

```
GET http://localhost:3000/api/clients/1
```
<img width="1023" height="312" alt="obtener clientes por id" src="https://github.com/user-attachments/assets/6e0e9f2c-4a90-4b21-9983-8896d06b7f1b" />

### POST crear

```json
POST http://localhost:3000/api/clients
```

Body:

```json
{
  "rut_empresa": "76123456-7",
  "rubro": "Tecnología",
  "razon_social": "Empresa SPA",
  "telefono": "123456789",
  "direccion": "Santiago",
  "nombre_contacto": "Juan Perez",
  "email_contacto": "juan@empresa.cl"
}
```
<img width="1024" height="300" alt="crear cliente" src="https://github.com/user-attachments/assets/f23f1799-eb91-4545-8849-067338e00b25" />

### PUT actualizar

```
PUT http://localhost:3000/api/clients/1
```
<img width="1023" height="306" alt="actualizar cliente" src="https://github.com/user-attachments/assets/38238479-ddf4-4f1c-bd00-3f5a99fb1a22" />

### DELETE

```
DELETE http://localhost:3000/api/clients/1
```
<img width="1023" height="273" alt="eliminar cliente" src="https://github.com/user-attachments/assets/cbdd89c3-535e-478e-a0d0-c38a01c16062" />

---

## ⚠️ Headers para Postman

TODAS las rutas protegidas requieren:

```
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

---

## 🧪 Flujo de prueba recomendado

1. Registrar usuario
2. Login → copiar token
3. Usar token en Postman
4. Crear productos/clientes
5. Ver dashboard

---

## 📌 Consideraciones

* Todos los campos son obligatorios
* Password encriptada
* Validación de emails
* Control de duplicados (RUT, SKU)
* API protegida con JWT

---

## ✅ Estado del proyecto

✔ CRUD completo
✔ Autenticación JWT
✔ Dashboard funcional
✔ Backoffice operativo

---

## 👨‍💻 Autor
Diego Rivera Spröhnle
Proyecto desarrollado como evaluación de microservicio con Next.js.
