# Seguridad — Numen

Resumen de las normas aplicadas al agregar login y guardado de datos de usuarios, y de lo que queda pendiente.

## Autenticación

- **Auth.js v5** (`next-auth@5`) maneja sesiones, cookies y los flujos OAuth/magic link — evitamos escribir criptografía de sesiones a mano.
- **Sesiones JWT firmadas** (`AUTH_SECRET`), en cookies `httpOnly`, `secure` y `sameSite` (comportamiento por defecto de la librería).
- **Contraseñas**: hasheadas con bcrypt (`lib/password.ts`, cost factor 12). Nunca se guardan en texto plano ni se loguean.
- **Política de contraseña** en el signup: mínimo 8 caracteres, al menos una letra, un número y un carácter especial (`app/actions/auth.ts`).
- **Mitigación de user enumeration en login**: siempre se compara contra un hash dummy si el usuario no existe, para que el tiempo de respuesta no delate si un email está registrado (`lib/password.ts`).
- **Rate limiting** en login, signup y magic link (`lib/rate-limit.ts`) — limita intentos por email en una ventana de tiempo.
- **3 métodos de login**: email+contraseña (Credentials), Google OAuth y magic link (email sin contraseña) — los dos últimos son opcionales y solo se activan si están configuradas sus variables de entorno.

## Autorización y guardado de datos

- **Postgres vía Prisma** (`prisma/schema.prisma`) — todas las queries son parametrizadas por el ORM, sin SQL crudo, así que no hay superficie de SQL injection.
- **Scoping por usuario en cada query**: toda lectura/escritura de Perfil, Sueños y Hábitos pasa por `lib/dal.ts` (`verifySession()`) y filtra explícitamente por `userId`. Antes de cualquier mutación sobre un hábito/sueño existente se verifica que pertenezca al usuario autenticado (`assertOwnsHabit` en `app/actions/habits.ts`, chequeo equivalente en `app/actions/dreams.ts`).
- **`proxy.ts`** hace un chequeo optimista (solo lee la cookie firmada, sin ir a la base) y redirige a `/login` — es la primera línea de defensa, pero la autorización real vive en la Data Access Layer, no en el proxy (así lo recomienda la guía oficial de Next.js).
- **Borrado en cascada**: los modelos `Account`, `Profile`, `Dream`, `Habit` y `HabitCompletion` tienen `onDelete: Cascade` sobre `User`, para que borrar una cuenta borre todos sus datos sin dejar huérfanos.

## Transporte y headers

`next.config.ts` agrega en todas las rutas:

- `Content-Security-Policy` (restringe scripts/estilos/conexiones a same-origin; `img-src` permite `data:`/`blob:` porque la evidencia de hábitos se guarda como foto en base64). Usa la variante "sin nonces" documentada por Next.js (`'unsafe-inline'` en `script-src`/`style-src`, `'unsafe-eval'` solo en dev) porque la variante con nonce exige que **todas** las páginas sean dinámicas — con nonces se probó en local y rompía la hidratación de React al bloquear el bootstrap inline de Next.js. Si más adelante se necesita CSP estricta sin `unsafe-inline`, hay que migrar a nonces generados en `proxy.ts` y volver dinámicas las páginas esqueleto que hoy son estáticas.
- `X-Frame-Options: DENY` y `frame-ancestors 'none'` (anti-clickjacking).
- `Strict-Transport-Security` (fuerza HTTPS una vez desplegado).
- `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.

## CSRF y XSS

- Los Server Actions de Next.js validan el header `Origin` automáticamente (protección CSRF nativa del framework).
- Los endpoints propios de Auth.js (`/api/auth/*`) usan su propia protección CSRF (patrón double-submit cookie).
- No se usa `dangerouslySetInnerHTML` en ningún lado; React escapa todo el contenido renderizado por defecto.

## Secretos

- `.env` está en `.gitignore` — nunca se commitea.
- `.env.example` documenta cada variable requerida y cómo generarla, sin valores reales.

## Limitaciones conocidas / próximos pasos

Para ser transparentes, esto es lo que **no** está resuelto todavía:

1. **Verificación de email no forzada.** El modelo `User` tiene `emailVerified`, pero el signup por contraseña no lo completa ni bloquea el login hasta verificar. Esto abre un caso borde: alguien podría registrarse con un email que no le pertenece: si el dueño real del email después entra por magic link, va a caer en esa misma cuenta (porque el magic link autentica por posesión del email), pero mientras tanto la contraseña cargada por la otra persona seguiría siendo válida. **Recomendado como siguiente paso**: mandar un email de verificación al registrarse y no permitir login por contraseña hasta confirmarlo.
2. **Rate limiting en memoria** (`lib/rate-limit.ts`): funciona para una sola instancia. Si se despliega en un entorno serverless multi-instancia (ej. Vercel con mucho tráfico), cada instancia tiene su propio contador. Para producción a mayor escala, reemplazar por un store compartido (ej. Upstash Redis) manteniendo la misma interfaz.
3. **Evidencia de hábitos (fotos) en base64 dentro de Postgres.** Funciona bien a la escala de una app personal, pero no escala indefinidamente. Si el uso crece, migrar a almacenamiento de objetos (S3, Cloudflare R2, Supabase Storage) con URLs firmadas.
4. **`nodemailer` tiene un advisory de severidad alta** (bypass de `disableFileAccess`/`disableUrlAccess` vía la opción `raw`) sin fix disponible todavía. No lo explotamos porque nunca pasamos la opción `raw` ni contenido controlado por el usuario al mensaje — Auth.js arma el email del magic link internamente. Igual conviene monitorear actualizaciones de la librería.
5. **No hay exportación ni borrado de cuenta self-service.** Si en algún momento hay usuarios reales, conviene agregar una pantalla de "borrar mi cuenta y todos mis datos" (el borrado en cascada a nivel de base ya está listo, falta la acción + UI).
6. **No hay 2FA.** Si se necesita mayor seguridad más adelante, se puede sumar TOTP como método adicional.

## Variables de entorno necesarias

Ver `.env.example`. Como mínimo hace falta `DATABASE_URL` (Postgres) y `AUTH_SECRET` para que el login por contraseña funcione. Google y magic link son opcionales.
