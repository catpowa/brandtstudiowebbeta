# Branditamina · versión preparada para GitHub y Vercel

El diseño y el código están terminados para revisión. **El envío real y la publicación legal están pendientes de los datos y ajustes indicados abajo.** No se ha publicado ni enviado correo real. La previsualización local nunca envía mensajes.

## Qué cambió

- Portada con «La dosis correcta» en una línea, franja animada con pausa y caja Fórmula base con cuatro enlaces.
- 19 tratamientos: 13 precios «Desde» tomados del primer Figma; 6 sin precio inventado, con cotización a medida. USD. Confirmar que sean mínimos FINALES con impuestos y cargos incluidos, y el alcance inicial, antes de publicar (Ley 473 de 2025; ver REVISION.md). La landing de US$150 se identifica expresamente como Canva para no prometer desarrollo a ese importe.
- Claude con icono local, Eleven sin «Design» e Instagram en todos los pies de página.
- Privacidad, términos, cookies y cancelaciones/reembolsos con el estilo del sitio.
- Consentimiento no premarcado, campos etiquetados, errores comprensibles y envío preparado para Vercel.
- Las cifras 10+/6+/50+ se retiraron de la versión pública hasta documentar su respaldo. Se conservan en el material previo. No se añadieron reseñas ni garantías de resultados.

## Dónde llegan los formularios

1. El selector «Encontrar mi dosis» funciona en el navegador. No envía nada por sí solo.
2. Al elegir conversar, la ruta pasa al formulario como contexto editable.
3. La persona indica nombre, correo y su caso. Marca y área son opcionales. Acepta el tratamiento de esos datos para responder a su consulta.
4. Al pulsar «Enviar mi caso», `/api/contact` valida la solicitud. Resend transporta un correo hacia `CONTACT_TO` (propuesto: info@branditamina.com).
5. En tu buzón recibes nombre, correo, marca, interés, caso y constancia del consentimiento/versionado de la política. La fecha del mensaje la registra el proveedor de correo. «Responder» usa el correo del visitante.

La confirmación significa que Resend aceptó la solicitud; no garantiza bandeja de entrada. Revisar entrega/rebotes en Resend y spam en el buzón. No hay base de datos, CRM ni suscripción de marketing. Si falla, quedan los campos y una alternativa para abrir el correo del visitante. Esa alternativa solo se envía cuando él pulsa enviar en su aplicación.

## Activación en Vercel

Sube **el contenido de esta carpeta** a la raíz del repositorio de GitHub, incluyendo `public/`, `api/`, `package.json` y `vercel.json`. No subas la carpeta v2 anterior en su lugar.

1. Importa el repositorio en Vercel. Framework: Other. Output Directory: `public`. Sin comando de build; la API se detecta en `api/contact.js`. Node 22 o 24.
2. Crea/configura una cuenta de Resend. Verifica un dominio o subdominio de envío con los registros DNS que indique Resend. No cambies los registros MX del correo existente salvo instrucción de su proveedor; verificar envío no requiere migrar tu buzón.
3. Crea una clave de envío y guárdala en Vercel → Settings → Environment Variables. **No pegar claves en el HTML, en GitHub ni en el chat.**
4. Configura en Production:

| Variable | Valor |
| --- | --- |
| `RESEND_API_KEY` | Clave privada de Resend |
| `CONTACT_TO` | Buzón receptor confirmado |
| `CONTACT_FROM` | Remitente del dominio verificado, p. ej. Branditamina <web@tu-dominio-verificado> |
| `SITE_ORIGIN` | Origen exacto público, con https y sin barra final; p. ej. https://branditamina.com |
| `LEGAL_READY` | `false` hasta completar la revisión; luego `true` |

5. Redirige dominios alternativos (www, dominio de Vercel) al dominio canónico. La API solo acepta `SITE_ORIGIN`; evita habilitar todos los orígenes. Mantén `LEGAL_READY=false` en previews.
6. Activa una regla de límite de frecuencia en Vercel Firewall para POST `/api/contact` antes de activar el envío (punto de partida: 5 solicitudes/minuto por IP, ajustar según uso). Verifica disponibilidad y coste de tu plan. El control de origen y el campo trampa no sustituyen un límite distribuido; un bot puede falsificar Origin.
7. Completa los pendientes del siguiente apartado, cambia `LEGAL_READY=true` y vuelve a desplegar. Las variables nuevas requieren redeploy.
8. Haz un envío controlado con tu propio correo: comprobar aceptación, llegada a bandeja y función Responder. Comprobar fallo, consentimiento obligatorio, móvil y ausencia de cookies/terceros no previstos en el dominio público. No marcar listo solo porque aparece el mensaje de aceptación.

Guías oficiales: [envío desde Vercel](https://vercel.com/kb/guide/sending-emails-from-an-application-on-vercel), [variables](https://vercel.com/docs/environment-variables), [Resend](https://resend.com/docs/api-reference/emails/send-email), [límite de frecuencia](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

## Pendiente antes de publicar

- Nombre legal del responsable, domicilio comercial de contacto e identificación comercial/fiscal que corresponda. Sustituir el aviso amarillo en privacidad y términos. Panamá es la jurisdicción de referencia según el material recibido; confirmar domicilio y mercados objetivo.
- Confirmar correo receptor (el material suministrado indica info@branditamina.com), proveedor del buzón, y que existe y puede recibir.
- Definir y aplicar retención: recomendación operativa a aprobar, consultas sin contratación 6 meses desde el último contacto; borrar antes cuando proceda. No es un plazo legal universal. Documentar contratos/facturas y reclamaciones por separado conforme a las obligaciones aplicables. Actualizar privacidad con el plazo decidido y establecer el borrado del buzón/proveedores; la web no lo automatiza.
- Revisar contratos de tratamiento y transferencias internacionales de Vercel, Resend y proveedor del buzón; identificar países, subencargados y garantías aplicables. La política actual señala expresamente esta revisión pendiente.
- Confirmar importes mínimos e impuestos, condiciones de cada servicio y política de cancelaciones con el responsable del negocio. No se ha añadido cobro en línea.
- Confirmar derechos para publicar nombres/alcances de los expedientes, permiso del logotipo propio y fundamento del símbolo ® del archivo suministrado. No se ha verificado el registro marcario.
- Revisión legal local de las políticas con estos datos completos. Los textos no son una certificación de cumplimiento ni garantizan ausencia de reclamaciones.

## Archivos editables

`public/data.js`: servicios y mínimos. `public/*.html`: páginas y textos. `public/site.css`: diseño. `public/site.js`: interacciones. `api/contact.js`: validación y correo. `vercel.json`: cabeceras y publicación. `REVISION.md`: fuentes y revisión técnica/legal.

## Probar localmente

Con Node instalado, abre esta carpeta en una terminal y ejecuta `npm start`. Visita http://127.0.0.1:8767. No necesita instalar dependencias. El servidor local responde que el correo está sin activar, incluso si existe una clave en el entorno. `npm test` verifica la API con proveedor simulado; no envía mensajes.

Esta entrega no necesita React ni paquetes de terceros para funcionar. No se ha ejecutado un despliegue de Vercel con credenciales reales.
