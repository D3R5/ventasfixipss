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

📌 Respuesta: devuelve `token`

---

## 👤 USERS

### GET todos

```
GET http://localhost:3000/api/users
```

### GET por ID

```
GET http://localhost:3000/api/users/1
```

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

### PUT actualizar

```
PUT http://localhost:3000/api/users/1
```

### DELETE

```
DELETE http://localhost:3000/api/users/1
```

---

## 📦 PRODUCTS

### GET todos

```
GET http://localhost:3000/api/products
```

### GET por ID

```
GET http://localhost:3000/api/products/1
```

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

### PUT actualizar

```
PUT http://localhost:3000/api/products/1
```

### DELETE

```
DELETE http://localhost:3000/api/products/1
```

---

## 🏢 CLIENTS

### GET todos

```
GET http://localhost:3000/api/clients
```

### GET por ID

```
GET http://localhost:3000/api/clients/1
```

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

### PUT actualizar

```
PUT http://localhost:3000/api/clients/1
```

### DELETE

```
DELETE http://localhost:3000/api/clients/1
```

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
