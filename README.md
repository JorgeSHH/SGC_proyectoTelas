# Sistema de Gestión de Telas del Castillo
## Manual de Usuario e Instalación

**Versión:** 2.0  
**Fecha de actualización:** 12 de febrero de 2026  
**Creado por:** Jorge Holguin, Armando Martinez y Ramses Barreto  
**Empresa:** El Castillo - Tu Centro Textil

---

## Índice
1. [Introducción](#introducción)
2. [Guía de Instalación y Configuración](#guía-de-instalación-y-configuración)
3. [Acceso al Sistema](#acceso-al-sistema)
4. [Sección del Administrador](#sección-del-administrador)
   - [Panel de Administración](#panel-de-administración)
   - [Gestión de Vendedoras](#gestión-de-vendedoras)
   - [Gestión de Telas](#gestión-de-telas)
   - [Gestión de Retazos](#gestión-de-retazos)
   - [Dashboard Estadístico](#dashboard-estadístico)
5. [Sección de la Vendedora](#sección-de-la-vendedora)
   - [Panel de Vendedoras](#panel-de-vendedoras)
   - [Registro de Retazos](#registro-de-retazos)
   - [Consulta y Verificación de Retazos](#consulta-y-verificación-de-retazos)
6. [Recomendaciones de Manejo del Sistema](#recomendaciones-de-manejo-del-sistema)
7. [Cierre de Sesión](#cierre-de-sesión)

---

## Introducción

El **Sistema de Gestión de Telas del Castillo** es una plataforma web diseñada para la administración integral de inventario textil, enfocada en el control de telas y retazos. El sistema cuenta con dos perfiles de usuario:

- **Administrador:** Gestión completa del sistema, usuarios, catálogos y reportes.
- **Vendedora:** Registro de retazos y procesamiento de ventas.

---

## Guía de Instalación y Configuración

### Requisitos Previos
1. **Python 3.8+** y **Node.js**.
2. Instalar dependencias: `pip install -r requirements.txt`.
3. Crear entorno virtual: `python -m venv venv`.
4. Configurar variables de entorno en archivo `.env`:
   ```env
   DB_NAME=castilloDB.sqlite3
   SECRET_KEY=django
   DEBUG=True
   API_TASA_CAMBIO=tu-token-aqui
   API_LINK=[https://api-bcv-nine.vercel.app/dolar](https://api-bcv-nine.vercel.app/dolar)

## Acceso al Sistema

### Primer Acceso - Inicio de Sesión

1. Abra su navegador web y acceda a la URL del sistema
2. En la pantalla de inicio de sesión, ingrese sus credenciales:
   - **Correo Electrónico:** Su email registrado (ej. `admin2@ejemplo.com` o `andreina@example.com`)
   - **Contraseña:** Su contraseña asignada

![Pantalla de Inicio de Sesión](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/e9083db2-e528-44c7-b960-3f435ea8e3c3/8969988f-b314-4003-9875-0980fb5e559f.png)

3. Haga clic en el botón **"Ingresar"** de color rojo

&gt; **Nota:** Si es su primer acceso, le recomendamos cambiar su contraseña desde el perfil de usuario.

---

## Sección del Administrador

Al iniciar sesión con credenciales de administrador, accederá al **Panel de Administración** donde podrá gestionar todas las funciones del sistema.

### Panel de Administración

El panel principal presenta cuatro módulos principales organizados en tarjetas:

| Módulo | Descripción | Icono |
|--------|-------------|-------|
| **Gestión de Vendedoras** | Control y administración del personal de ventas | 👤 |
| **Gestión de Telas** | Control de catálogo de telas disponibles | 🧵 |
| **Gestión de Retazos** | Administración de retazos sobrantes | ✂️ |
| **Dashboard Estadístico** | Gráficos y métricas de interés | 📊 |

![Panel de Administración](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/b2f6460a-e177-41f9-93cd-1ee5c22b91c1/792376de-7111-4a71-8296-128f2037fc8f.png)

#### Información de Usuario
En la esquina superior derecha encontrará:
- Su nombre de usuario (ej. "ADMIN PRINCIPAL")
- Su código de identificación (ej. "ADMIN2_USER")
- Botón de **Cerrar Sesión** 🔴

---

### Gestión de Vendedoras

Este módulo permite administrar el personal de ventas con privilegios de vendedora.

#### Acceso al Módulo
1. Desde el Panel de Administración, haga clic en **"Gestión de Vendedoras"**
2. O utilice el menú superior de navegación

#### Funciones Disponibles

##### 1. Registrar Nueva Vendedora

1. Haga clic en el botón **"+ Registrar"** (blanco con borde rojo)
   
   ![Botón Registrar](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/0941cc76-95b0-4aec-ab4c-a9886a62b388/c075f895-b55a-4f0a-ab79-b6e47cd2caf9.png)

2. Complete el formulario **"Registrar Nueva Vendedora"** con los siguientes campos:
   - **Nombre** (obligatorio)
   - **Apellido** (obligatorio)
   - **Username** (obligatorio)
   - **Password** (obligatorio)
   - **Email** (obligatorio)
   - **Teléfono** (obligatorio)

   ![Formulario de Registro](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/158d1771-e2bc-4f3a-a8f9-ff57eb450469/051eaa2f-9474-44d6-aaf0-0a7791a2895e.png)

3. Haga clic en **"Guardar Vendedora"** (botón rojo)

&gt; **Resultado:** La vendedora quedará registrada en el sistema y podrá iniciar sesión con las credenciales proporcionadas.

##### 2. Buscar Vendedoras

Utilice la barra de búsqueda superior para filtrar vendedoras por:
- **ID** (número identificador)
- **Nombre** completo o parcial

![Filtro de Búsqueda](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/91347946-555c-48e5-9350-947a07f164e1/30340f26-bbda-4a77-9a20-cb8b674cc191.png)

##### 3. Editar Información de Vendedora

1. Localice la tarjeta de la vendedora deseada
2. Haga clic en el botón **"Editar"** (azul)
3. Modifique los campos necesarios
4. Guarde los cambios

##### 4. Eliminar Vendedora

&gt; ⚠️ **Advertencia:** Al eliminar una vendedora, todos los retazos registrados por ella serán reasignados automáticamente al administrador que realiza la eliminación.

1. Haga clic en el botón **"Eliminar"** (rojo) en la tarjeta de la vendedora

   ![Botón Eliminar](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/2a7a46ba-8a67-459c-b31b-219a7de8ff2f/4621e823-7484-4732-91f4-e4f398720f89.png)

2. Confirme la acción haciendo clic en **"Sí, Eliminar"** en el cuadro de diálogo

   ![Confirmación de Eliminación](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/e7628ac1-cf19-4a6d-ac32-60a22a244821/d6c01ae5-6a95-4dca-b0b4-c7e494a1d8ab.png)

##### 5. Exportar Datos

Desde la vista de Gestión de Vendedoras puede exportar la información en dos formatos:

- **Excel** 📗: Botón verde con icono de Excel
- **PDF** 📄: Botón gris oscuro con icono de PDF

![Botones de Exportación](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/5a49fb83-7338-427e-8047-72aca54dccf7/10d07ba3-81eb-465b-a691-16fc0ce09b85.png)

---

### Gestión de Telas

Módulo para administrar el catálogo de tipos de telas disponibles en el sistema. Cada tipo de tela genera automáticamente un código QR único para su identificación.

#### Acceso al Módulo
1. Desde el Panel de Administración, haga clic en **"Gestión de Telas"**
2. O seleccione "Gestión de Telas" en el menú superior

#### Vista Principal - Registro de Tipos de Telas

La interfaz muestra tarjetas con la información de cada tipo de tela:
- ID y nombre de la tela
- Fecha de registro
- Precio por unidad (metro)
- Nombre descriptivo
- Descripción detallada
- Código QR de identificación

![Registro de Tipos de Telas](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/9358a3ab-2745-4487-8cf4-f72158763ac3/7075da01-eb2b-49eb-87fb-e9b609a8ee92.png)

#### Funciones Disponibles

##### 1. Registrar Nuevo Tipo de Tela

1. Haga clic en **"+ Registrar"**
   
   ![Botón Registrar Tela](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/d18b69e2-1dab-46c8-83fb-0242ed3a199d/57f2b338-fecb-46d0-9d54-6afd2cd405af.png)

2. Complete el formulario **"Registrar Nueva Tela"**:
   - **Nombre de la Tela:** Ej. "Seda Premium"
   - **Tipo de Material:** Ej. "Algodón / Poliéster"
   - **Descripción:** Detalles de la tela
   - **Precio por Unidad (Metro):** Precio de referencia en dólares

   ![Formulario Nueva Tela](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/6b428f3e-f708-4d8c-a1c0-1ef5d3df7198/95a2cce0-3cb3-4697-bfb7-ed176fe65c99.png)

3. Haga clic en **"Registrar"** para guardar

&gt; **Nota:** El sistema generará automáticamente un código QR único para el nuevo tipo de tela.

##### 2. Buscar Tipos de Tela

Filtre el catálogo utilizando la barra de búsqueda que soporta:
- **ID** del tipo de tela
- **Nombre** de la tela
- **Descripción**

![Búsqueda de Telas](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/3370d424-d4b4-4b61-8e9f-6bdb622917d2/bb236cdf-3581-404a-94cd-db67f3685ee0.png)

##### 3. Editar Tipo de Tela

1. Localice la tarjeta de la tela deseada
2. Haga clic en **"Editar"** (botón azul)
3. Modifique los campos necesarios
4. Guarde los cambios

##### 4. Eliminar Tipo de Tela

&gt; ⚠️ **Restricción Importante:** No se puede eliminar un tipo de tela que tenga retazos asociados en el sistema. Primero debe eliminar o reasignar todos los retazos vinculados.

1. Haga clic en **"Eliminar"** (botón rojo)
   
   ![Eliminar Tela](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/7d96fd6c-75ec-40ff-83e4-d0efdaf3e777/59e3bdb9-254a-4cd7-807f-c4aad576873a.png)

2. Confirme la eliminación en el cuadro de diálogo

Si intenta eliminar una tela con retazos asociados, el sistema mostrará el mensaje:
&gt; "No se puede eliminar: Esta tela tiene retazos asociados"

![Mensaje de Error](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/07afbc4b-59bd-4410-888b-c7f7ec11a8f1/37fc1b21-cfb0-4e41-a42f-8a38f06854e5.png)

---

### Gestión de Retazos

Módulo central para la administración de retazos sobrantes de telas. Permite el registro, seguimiento y control de inventario de retazos.

#### Acceso al Módulo
- Desde el Panel de Administración, seleccione **"Gestión de Retazos"**
- O utilice el menú superior de navegación

![Acceso Gestión de Retazos](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/ac7f5b63-198a-4473-a80b-e8be3315683b/e099b28c-4186-49e3-be69-1862254cfe2d.png)

#### Vista Principal

La interfaz muestra tarjetas de retazos con la siguiente información:
- ID y tipo de tela
- Estado: **"VENDIDO / INACTIVO"** o activo
- Fecha de registro
- Dimensiones (Ancho x Largo en metros)
- Rol y creador
- Precio calculado automáticamente
- Descripción
- Código QR único del retazo

![Vista de Retazos](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/4f7b4ffb-91a5-42c8-b595-105efcc17145/0e869db3-783a-4d2a-b843-1f551e5dd7d7.png)

#### Funciones Disponibles

##### 1. Registrar Nuevo Retazo

1. Haga clic en **"+ Registrar"**
   
   ![Botón Registrar Retazo](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/b32dfcd2-db6b-4458-853f-9e6eba24394e/91261afd-20e7-4e7a-a825-4f1142d8a2f3.png)

2. Complete el formulario **"Registrar Nuevo Retazo"**:
   - **Tipo de Tela:** Seleccione del catálogo disponible
   - **Largo (m):** Longitud del retazo (mínimo 0.15m)
   - **Ancho (m):** Ancho del retazo (mínimo 0.15m)
   - **Descripción:** Detalles del retazo (máximo 250 caracteres)

   ![Formulario Nuevo Retazo](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/a7895369-439b-4590-a0bb-402aa6b844bb/9d755df9-5ea4-463f-a7a6-a12d1d8dde55.png)

3. Haga clic en **"Registrar"**

&gt; **Cálculo Automático:** El sistema calcula automáticamente el precio del retazo basado en las dimensiones ingresadas y el precio por metro del tipo de tela seleccionado.

##### 2. Buscar Retazos

Utilice la barra de búsqueda para filtrar por:
- **ID** del retazo
- **Rol** del usuario que lo registró
- **Usuario** que lo registró

##### 3. Editar Retazo

1. Localice el retazo deseado y haga clic en **"Editar"** (azul)

   ![Botón Editar](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/c028c3ed-60f9-4e90-937d-4512f6c6cc57/ae9020c4-809f-4b85-84d1-2e6f4527fda1.png)

2. En el formulario **"Editar Retazos"** puede modificar:
   - Ancho (metros)
   - Largo (metros)
   - Descripción
   - **Estado del Retazo:** 
     - Activo (disponible para venta)
     - Vendido / Desactivado

   ![Formulario Editar](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/9849ac4d-1994-4437-80a5-05d1e78b6e65/963cd984-58ef-4e1c-8f1e-df7ac31d0089.png)

3. Haga clic en **"Guardar Cambios"**

##### 4. Eliminar Retazo

1. Haga clic en **"Eliminar"** (rojo) en la tarjeta del retazo
   
   ![Eliminar Retazo](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/631a8387-fc16-4abb-80d9-5045cccf1cdc/6be34fd2-9ae5-4226-a60f-76ea3b49079f.png)

2. Confirme la eliminación en el cuadro de diálogo de confirmación

   ![Confirmación](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/4a2dcd52-9ec1-41a0-8c6d-22336d6355a1/366af06e-267f-414e-8580-2e9c26a452b2.png)

&gt; ⚠️ **Advertencia:** Esta acción no se puede deshacer.

##### 5. Exportar Datos

Exporte el inventario de retazos en:
- **Excel** 📗: Para análisis y manipulación de datos
- **PDF** 📄: Para reportes y documentación

##### 6. Paginación

Cuando el número de retazos excede la capacidad de la vista, utilice los controles de paginación en la parte inferior:
- **Anterior:** Página previa
- **Números:** Selección directa de página
- **Siguiente:** Página siguiente

![Paginación](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/c1f8d72a-b794-486f-af11-888533e2a607/e394b695-e244-4000-89d5-6dc388b71002.png)

---

### Dashboard Estadístico

Panel de visualización de métricas y análisis del sistema.

#### Acceso
Seleccione **"Dashboard Estadístico"** en el menú superior de navegación.

![Acceso Dashboard](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/965a164c-2f6d-434d-8a2f-e5788d5625db/a1b4c8fc-d92f-4319-bd57-d12c3ac991af.png)

#### Dashboard de Métricas

El dashboard presenta tres gráficos principales:

##### 1. Ranking por Vendedora
- **Tipo:** Gráfico de barras horizontal
- **Datos:** Cantidad de retazos registrados por cada vendedora
- **Nota:** No incluye los retazos registrados por administradores

![Ranking Vendedoras](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/64c38202-af78-4f71-928b-399d3e7480f6/b865848a-4fd3-4737-a08d-def8829b3253.png)

##### 2. Retazos por Tipo de Tela
- **Tipo:** Gráfico de barras vertical
- **Datos:** Distribución de retazos según el tipo de tela
- **Utilidad:** Identificar qué tipos de tela generan más retazos

![Retazos por Tipo](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/46714aff-1250-4f06-8b67-8d76cffff108/713c007b-e0c9-4a0e-b866-422fc5c90dad.png)

##### 3. Progreso Semanal
- **Tipo:** Gráfico de líneas
- **Datos:** Evolución de retazos agregados durante la semana
- **Utilidad:** Seguimiento de la productividad

#### Navegación Rápida

Desde cualquier sección puede:
- Hacer clic en el **Logo** (esquina superior izquierda) para volver al Panel de Administración
- Usar el **menú superior** para navegar entre módulos
- Cerrar sesión desde el botón en la esquina superior derecha

---

## Sección de la Vendedora

Las vendedoras tienen acceso a funciones específicas para el registro de retazos y procesamiento de ventas.

### Acceso como Vendedora

1. En la pantalla de inicio de sesión, ingrese:
   - **Correo:** Su email asignado (ej. `andreina@example.com`)
   - **Contraseña:** Su contraseña

   ![Login Vendedora](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/46c6d5f3-36f9-44f6-b725-bf59155fa694/63ab4533-98a1-4506-ae55-2af2548f3bef.png)

2. Haga clic en **"Ingresar"**

### Panel de Vendedoras

La interfaz de vendedora presenta dos opciones principales:

| Opción | Descripción | Icono |
|--------|-------------|-------|
| **Registro de retazos** | Generación de QR y registro de nuevos retazos | 🧶 |
| **Consulta y verificación de retazos** | Registro de retazos introducidos al sistema | 🏷️ |

![Panel Vendedora](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/aa1e1c3b-f4ae-4452-a12a-2c3342525008/f5984bb9-db50-49b3-a24d-307cd7c271e0.png)

#### Información de Usuario
En la esquina superior derecha se muestra:
- Email de la vendedora
- Código de identificación (ej. "ANDRINA_SALESWOMAN")
- Botón de cierre de sesión

---

### Registro de Retazos

Módulo para crear nuevos retazos en el sistema.

#### Acceso
Haga clic en **"Registro de retazos"** desde el Panel de Vendedoras.

![Acceso Registro](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/c8eba18b-05ec-4c9c-8ae1-0a89c6bd0ee7/9179e5d8-dfc1-49b1-9cac-667b39793aa0.png)

#### Crear Nuevo Retazo

1. Seleccione el **Tipo de Tela** del menú desplegable
   
   ![Formulario Nuevo Retazo](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/7e4acf52-db89-400b-8ce6-5a68bfde6abf/ca84db76-641b-4f83-a3ef-957dd90e3973.png)

2. Ingrese las dimensiones:
   - **Largo (metros):** Longitud del retazo
   - **Ancho (metros):** Ancho del retazo

3. Agregue una **Descripción** detallada de las características del retazo

4. Haga clic en **"Registrar Retazo"**

&gt; **Resultado:** El sistema genera automáticamente un código QR único para el retazo y lo registra en el inventario.

---

### Consulta y Verificación de Retazos

Módulo para consultar retazos disponibles y generar facturas de venta.

#### Acceso
1. Desde el Panel de Vendedoras, haga clic en **"Consulta y verificación de retazos"**
   
   ![Acceso Consulta](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/18c0a488-7317-4f87-b679-d624504c2f08/d6effb56-0af8-4693-86ad-66c45f38b3e8.png)

2. O seleccione **"Consulta de Retazos"** en el menú superior

#### Vista de Consulta

La interfaz muestra tarjetas de retazos disponibles con:
- ID y tipo de tela
- Precio calculado (en verde)
- Creador y rol
- Dimensiones
- Descripción
- Código QR
- Casilla de selección (esquina superior derecha)

![Consulta de Retazos](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/bd194dfe-a635-4a58-83b2-d4869d7323e1/ff792b7c-7373-44bc-9538-121eb1c92f4e.png)

#### Funciones Disponibles

##### 1. Buscar Retazos

Filtre el inventario por:
- **ID** del retazo
- **Rol** del registrador
- **Usuario** que lo registró

![Búsqueda](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/32eb431a-5b0c-419c-ae7e-b1a23d625467/cf604b45-78ce-4181-9bf0-078911dea277.png)

##### 2. Seleccionar Retazos para Venta

1. Haga clic en la casilla de verificación (esquina superior derecha) de los retazos deseados
   
   ![Selección](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/edee2f73-8653-49b8-9763-78921feb920c/30a24c2b-108b-4959-b38a-542560954d62.png)

2. El sistema mostrará un contador en el botón **"Ver Factura"**

##### 3. Generar Factura (Proforma)

1. Haga clic en **"Ver Factura (X)"** donde X es la cantidad de retazos seleccionados
   
   ![Ver Factura](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/f81df7d2-5741-4f35-a8ba-898b11ec0a9b/c929ba7d-b9f2-4b17-a093-955e465e2211.png)

2. Se abrirá el **"Resumen de Venta"** con:
   - Fecha de la transacción
   - Listado de retazos seleccionados (ID, descripción, medidas, precio)
   - **Total a Pagar** (en verde, esquina superior derecha)
   - Opción para eliminar ítems individuales (🗑️)

   ![Resumen de Venta](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/9aa46ac8-def9-4cec-b1fc-beafbc0884ff/78688487-c461-4fd8-9ec3-eaa79bc37aaa.png)

##### 4. Imprimir Proforma

Haga clic en **"Imprimir"** para generar un PDF de la proforma de venta.

&gt; 💡 **Recomendación:** Descargue siempre la proforma para evitar pérdida de información.

![Imprimir](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/63088206-368b-408e-be4f-a44016f4c815/97565140-7ff5-46e4-927c-ed57e05aea90.png)

##### 5. Confirmar Venta

Una vez realizado el pago con el cliente:

1. Haga clic en **"Confirmar Venta"** (botón rojo con check ✓)
   
   ![Confirmar Venta](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/30680a12-719f-413f-9ba8-06eec585f3ab/4b88aba3-230b-4e9d-b85f-3238c2f70550.png)

2. El sistema marcará los retazos como **"VENDIDO / INACTIVO"**

&gt; **Nota:** Una vez confirmada la venta, los retazos ya no estarán disponibles para otras transacciones.

##### 6. Cancelar Proforma

Si no desea completar la venta, haga clic en **"Cancelar"** para cerrar el resumen sin realizar cambios.

![Cancelar](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/0ceb5179-af8a-4f75-b53a-7cdc3dc32778/dd5327b8-7e51-4082-8756-d7da56084f18.png)

##### 7. Escanear QR (Consulta Rápida)

Para consultar un retazo rápidamente escaneando su código QR:

1. Haga clic en **"Escanear QR"** (botón blanco con icono de QR)
   
   ![Escanear QR](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/817d12e1-44e0-4ce7-9712-a899ffa3e298/e85bc9bb-8df7-44a6-a322-d789a5a2253e.png)

2. Se abrirá la cámara del dispositivo. **Acérquese a unos 15cm del código QR**
   
   ![Escáner](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/7ef00537-d703-4d90-ab6d-6786ed8f2bb9/be1724af-1eab-4037-b38d-495072c34370.png)

3. **Conceda los permisos de cámara** si el navegador lo solicita

4. El sistema cargará automáticamente la información del retazo y generará el PDF de la proforma

   ![Resultado Escaneo](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/a6e9f167-cdc0-4108-a2e6-7e2211b3da7f/11c46adb-7998-451c-9b51-09ca5c70798c.png)

&gt; **Requisitos:** Navegador con soporte para cámara y permisos habilitados.

---

## Cierre de Sesión

Para salir del sistema de forma segura:

1. Localice el botón de **Cierre de Sesión** (icono de puerta/salida) en la esquina superior derecha
   
   ![Cerrar Sesión Admin](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/af89eda7-3a63-4874-ad53-a91aa6983361/522ade41-731b-41b4-bb6f-de48e2ff99da.png)

   ![Cerrar Sesión Vendedora](https://images.tango.us/workflows/834c241f-413d-4a6d-957a-b61f140f97e0/steps/7e2f8123-7b5e-4331-903f-085965959fb2/309542ab-c5f9-4862-9a3d-3cb289e24b47.png)

2. Haga clic para cerrar la sesión actual
3. Será redirigido a la pantalla de inicio de sesión

&gt; **Recomendación de Seguridad:** Siempre cierre sesión al terminar su trabajo, especialmente en equipos compartidos.

---

## Glosario de Términos

| Término | Definición |
|---------|------------|
| **Retazo** | Fragmento sobrante de tela, medido en metros, disponible para venta |
| **Tipo de Tela** | Categoría o clasificación de las telas (ej. Seda, Algodón, Lino) |
| **QR** | Código de respuesta rápida para identificación única de retazos y telas |
| **Proforma** | Documento preliminar de venta que detalla productos y precios |
| **Dashboard** | Panel visual con gráficos y estadísticas del sistema |
| **Vendedora** | Usuario con permisos limitados para registro y venta de retazos |
| **Administrador** | Usuario con permisos completos de gestión del sistema |

---
### Inicialización de Base de Datos (Primer Administrador)

Si la base de datos es nueva, debe crear el primer usuario desde el Shell de Django:

1. **Ejecutar:**  
```env
   python manage.py shell

   from your_app.models import Administrator, User

   perfil_admin = Administrator.objects.create(
      first_name="Admin", 
      last_name="Principal", 
      email="admin2@ejemplo.com", 
      username="admin2_user"
   ) 

   user = User.objects.create_superuser(
      email=perfil_admin.email, 
      username=perfil_admin.username, 
      password="tu_password_seguro", 
      role='admin', 
      profile_id=perfil_admin.administrator_id
   )
```


## Soporte Técnico

Para asistencia técnica o reporte de incidencias, contacte al administrador del sistema o al departamento de TI de El Castillo.

**El Castillo - Tu Centro Textil**  
Sistema de Gestión de Telas y Retazos  
© 2026 - Todos los derechos reservados

---

*Documento generado el 11 de febrero de 2026*  
*Manual versión 1.0*