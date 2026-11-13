# Gestion de facturas con un llm

Aplicacion para consultar facturas con filtros, editarlas o borrarlas, tambien permite subir facturas pdf, jpg o png, extrayendo sus datos con un llm(Gemini), se guarda la informacion en una base de datos PostgreSQL

## Tecnologias

* **Frontend**: React + TS
* **Backend**: NestJs + TS
* **Base de datos**: PostgreSQL
* **LLM**: Gemini 3.5 flash lite

## Como ejecutar el Proyecto

1. **Clonar el repositorio**
2. **Levantar una base de datos:** PostgreSQL con docker
3. **Iniciar el backend:** instalar las dependencias (**npm install**) , ejecuta prisma(**npx prisma generate --config prisma7.config.ts**), ejecuta las migraciones (**npx prisma migrate deploy --config prisma7.config.ts**) y luego ejecutar el servidor (**npm run start:dev**)
4. **Iniciar el frontend:** instalar las dependencias (**npm install**) y ejecutar la aplicacion (**npm run dev**)

##### Variables de entorno

**Backend:**

```
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@localhost:5432/BASE_DE_DATOS
GEMINI_API_KEY=TU_API_KEY
GEMINI_API_URL=URL_DEL_MODELO_DE_GEMINI
PORT=3000
```

**Frontend:**

```
VITE_API_URL=http://localhost:3000
```


## Documentación de la API

Con el backend iniciado, abrir http://localhost:3000/api/docs.

## Como funciona

En el frontend se tienen 3 pantallas : Lista de las facturas, detalle de una factura, cargar una factura.

Al cargar una factura llega al backend este valida el formato y el tamaño luego lo envia a Gemini.

Gemini devuelve los datos de la factura en formato JSON,estos datos  se validan y se guardan.

## Decisiones tecnicas

* El backend tiene una estructura por modulos, controladores y servicios.
* Para la base de datos se uso PostgreSQL con Prisma como ORM.
* La factura y su informacion se guardan en una misma transaccion, si alguna falla se revierte la transaccion.
* Para evitar los duplicados se tiene una restricion unica sobre la combinacion de proveedor y numero de factura.
* Para los valores se usa DECIMAL(18,2)
* Los filtros y la paginación se hacen en la base de datos.
* El resumen se agrupa tambien por moneda para no mezclar monedas distintas.
* La eliminacion de facturas es fisica  y en cascada borrando tambien su documento, para mantener sencillez.

## Modelo de base de datos

Defini la estructura de la base de datos

* Proveedor: guarda el nombre del proveedor y su id
* Factura: guarda toda informacion necesaria de la factura
* Documento: este es un registro del archivo que se envio su tipo, tamaño, y la respuesta original del LLM

Un proveedor puede tener varias facturas y una factura puede tener un registro de documento asociado

![Diagrama entidad-relación](docs/diagrama_db.svg)
