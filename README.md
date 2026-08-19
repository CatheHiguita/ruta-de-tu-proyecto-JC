# Ruta de tu Proyecto — Jóvenes creaTIvos

Aplicación de seguimiento del proceso formativo. Cada estudiante registra su avance
por checkpoint y los mentores revisan el progreso general del grupo.

## Estructura

```
supabase/          Definiciones de base de datos (sincronizadas por la GitHub App)
  migrations/      Migraciones SQL versionadas
web/               Frontend estático (desplegado en Vercel)
  index.html       Ruta del estudiante
  admin.html       Panel de seguimiento para mentores
  checkpoints.js   Definición de los checkpoints (compartida por ambas páginas)
  theme.css        Tokens de diseño compartidos
  config.js        URL y anon key de Supabase
```

No hay backend propio ni proceso de build. Las páginas estáticas se comunican
directamente con Supabase, y la seguridad la aplica Row Level Security en Postgres.

## Configuración inicial

### 1. Base de datos

Las migraciones se aplican solas al hacer push a `main`, mediante la GitHub App
de Supabase. En el dashboard de Supabase, dentro de la configuración de la
integración, el directorio de Supabase debe apuntar a `supabase`.

> **Importante:** la sincronización va en una sola dirección, del repositorio
> hacia la base de datos. Los cambios hechos a mano en el editor de tablas del
> dashboard **no** regresan al repositorio. Para traerlos hay que ejecutar
> `supabase db pull` y commitear la migración resultante. De lo contrario el
> repositorio y la base terminan divergiendo en silencio.

### 2. Credenciales del frontend

Editar `web/config.js` con los valores del proyecto, disponibles en
Supabase → Project Settings → API:

```js
window.SUPABASE_CONFIG = {
  url: 'https://xxxxxxxx.supabase.co',
  anonKey: 'eyJhbGci...',
};
```

Ambos valores son públicos por diseño y están pensados para viajar al navegador.
La `anon key` no otorga privilegios por sí sola: RLS restringe cada consulta a
las filas del propio usuario.

**Nunca colocar aquí la `service_role` key.** Esa clave ignora RLS por completo
y expondría los datos de todo el grupo.

### 3. Autenticación

El ingreso es con **correo y contraseña**. El registro no envía ningún correo:
la persona crea su cuenta y entra en el mismo paso.

En Supabase → Authentication → Providers → Email:

- **Enable email provider:** activado
- **Confirm email:** desactivado

Si `Confirm email` queda activo, el registro no abre sesión y queda esperando un
correo de confirmación. La app detecta ese caso y lo dice en pantalla, pero el
ingreso queda bloqueado hasta apagar la opción.

En Supabase → Authentication → URL Configuration:

- **Site URL:** `https://ruta-de-tu-proyecto-jc.vercel.app`
- **Redirect URLs:** una entrada por cada origen desde el que se abre la app:
  - `https://ruta-de-tu-proyecto-jc.vercel.app/**`
  - `http://localhost:5173/**` (solo para desarrollo local)

Estas URLs ya no se usan para entrar, pero sí para el enlace de recuperación de
contraseña. Si no coinciden con el dominio real, ese enlace redirige al Site URL
por defecto de Supabase, que apunta a `localhost`.

Estos valores viven en el dashboard del proyecto hosted, no en el repositorio:
`supabase/config.toml` los replica para el stack local (`supabase start`), pero
no los aplica en producción.

#### Por qué contraseña y no magic link

El SMTP integrado de Supabase permite **2 correos por hora** y no se puede subir
sin configurar un SMTP propio (ver el comentario de `email_sent` en
`supabase/config.toml`). Con una cohorte entera pidiendo enlaces, ese límite se
agota en minutos y el ingreso se cae con `email rate limit exceeded`. Con
contraseña, el ingreso no depende del correo.

> **Limitación conocida:** el enlace de "olvidé mi contraseña" **sí** usa ese
> SMTP y hereda el mismo límite. Mientras no haya SMTP propio, quien olvide su
> contraseña puede quedar bloqueado; un administrador puede resetearla desde
> Authentication → Users en el dashboard. Configurar un SMTP propio en
> Authentication → Emails elimina esta limitación.

#### Correos

Solo queda una plantilla: `supabase/templates/recovery.html`, el enlace para
cambiar la contraseña. Es la fuente de verdad versionada y la que usa el stack
local; en el proyecto hosted hay que pegar su contenido en Authentication →
Emails → Reset Password.

### 4. Despliegue

En Vercel, al importar el repositorio:

- **Root Directory:** `web`
- **Framework Preset:** Other
- Sin comando de build

### 5. Asignar el primer administrador

Los usuarios se crean con rol `student`. Para habilitar el panel de seguimiento,
ejecutar en el SQL Editor de Supabase, después de que la persona haya ingresado
al menos una vez:

```sql
update public.profiles
set role = 'admin'
where email = 'correo@sofka.com.co';
```

Un estudiante no puede otorgarse este rol a sí mismo: el privilegio `UPDATE`
sobre la columna `role` está revocado a nivel de base de datos.

## Modelo de datos

| Tabla | Contenido |
|---|---|
| `profiles` | Perfil del usuario: correo, nombre, ruta (`basico`/`avanzado`) y rol |
| `progress` | Estado de cada checkpoint por estudiante |
| `progress_summary` | Vista agregada que alimenta el panel de mentores |

Los checkpoints **no** viven en la base de datos. Están definidos en
`web/checkpoints.js` porque son contenido, no datos: la base solo almacena el
identificador del checkpoint. Cambiar un título o un paso no requiere migración.

### Estados de un checkpoint

| Estado | Significado |
|---|---|
| `pending` | Sin iniciar |
| `showingSteps` | El estudiante indicó que aún no lo hace y está viendo el paso a paso |
| `showingMentor` | Leyó el paso a paso y aun así necesita ayuda |
| `done` | Completado |

`showingMentor` es la señal más valiosa del panel: identifica los temas donde el
material escrito no está siendo suficiente y conviene reforzar con mentoría.

## Desarrollo local

Las páginas usan módulos de JavaScript, que no funcionan al abrir el archivo
directamente desde el disco. Hay que servirlas por HTTP:

```bash
cd web && python3 -m http.server 5173
```

Y visitar `http://localhost:5173`. Para que el enlace de recuperación de
contraseña funcione en local, `http://localhost:5173/**` debe estar en las
Redirect URLs del dashboard (ver [Autenticación](#3-autenticación)).
