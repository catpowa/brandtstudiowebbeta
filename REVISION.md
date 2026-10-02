# Revisión de publicación · 27 septiembre 2026

Estado: prototipo revisado; no publicado. Esta revisión técnica y documental no sustituye una revisión jurídica local ni una auditoría completa de accesibilidad. Los pendientes son concretos y están en LEEME.md.

## Marco de referencia y decisiones

Panamá se toma como base por la información del negocio suministrada. El domicilio legal y los mercados a los que se dirige la oferta deben confirmarse; clientes en otros países pueden activar normas adicionales.

- **Privacidad:** Ley 81 de 2019 y Decreto Ejecutivo 285 de 2021. La autoridad describe requisitos para recabar datos y derechos de sus titulares. Se añadió finalidad explícita, consentimiento afirmativo, contacto para derechos y explicación de proveedores. Faltan identidad legal, retención definitiva y garantías de transferencias. [ANTAI: reglamentación](https://antai.gob.pa/reglamentan-ley-81-de-proteccion-de-datos-personales/), [Ley 81](https://www.antai.gob.pa/wp-content/uploads/2019/09/Ley-81-de-2019-Proteccion-de-Datos-Personales.pdf), [preguntas frecuentes](https://antai.gob.pa/preguntas-frecuentes-de-proteccion-de-datos-personales/).
- **Consumidor:** el Decreto 46 reglamenta disposiciones de la Ley 45. No se añadió una renuncia general a reembolsos ni se sustituyeron los derechos obligatorios por una cláusula de aceptación. Las condiciones del proyecto se deben pactar antes del pago. [ACODECO: Decreto 46](https://tableroquejas.acodeco.gob.pa/uploads/pdf/transparencia/DecretoEjecutivo-46.pdf).
- **Precios:** la Ley 473 de 2025 exige exhibir el total incluyendo impuestos, tasas y otros cargos aplicables, según la comunicación del MEF de febrero de 2026. **Los mínimos del Figma están sin confirmar como importes finales.** No publicar esos valores hasta confirmar carga fiscal y que el alcance inicial pueda contratarse por ese total. Una nota genérica de impuestos posteriores no resuelve este requisito. [MEF: precios totales](https://www.mef.gob.pa/2026/02/la-obligacion-de-emitir-la-factura-fiscal-se-mantiene-con-la-entrada-en-vigencia-de-la-ley-no-473-de-2025/).
- **Comercio por Internet:** revisar obligaciones de información/identificación y requisitos aplicables a la actividad bajo Ley 51 de 2008, sus modificaciones y reglamentación. La falta de checkout no permite descartar por sí sola la normativa comercial. No se ha tramitado ni asumido que exista un registro del negocio ante DGCE. [MICI: marco legal](https://mici.gob.pa/marco-legal-act/), [DGCE](https://mici.gob.pa/dgce-preguntas-frecuentes/).
- **Cookies:** se eligió no instalar rastreo opcional. El código auditado no usa cookies, localStorage, píxeles, scripts de analítica ni embeds sociales. No se implementó banner sin opciones reales que gestionar. Es una decisión sobre esta implementación, no una exención universal. Repetir inspección del dominio público y revisar cualquier futura integración/mercado antes de añadir seguimiento.

## Datos e integraciones

| Componente | Datos / finalidad | Estado |
| --- | --- | --- |
| Selector | Tres respuestas no identificativas, procesadas en el navegador; ruta en query string al contacto | Funciona localmente |
| Formulario | Nombre, email, consulta y consentimiento; marca/interés opcionales | Implementado |
| Vercel | Alojamiento, función y posibles registros técnicos/IP | Código preparado, sin despliegue |
| Resend | Transporte de la consulta al buzón fijo | Requiere cuenta, dominio y clave |
| Buzón | Recepción, respuesta y archivo | Proveedor y receptor por confirmar |
| Instagram/WhatsApp | Solo enlace; carga al elegir salir del sitio | Sin widgets ni SDK |
| ChatGPT, Claude, Notion y demás herramientas | Solo iconos y texto local | Ningún formulario se comparte con ellas |

No hay base de datos propia, compras, cobros, newsletters ni envío automático a CRM. No se pide teléfono, documento, adjunto, dirección personal ni información financiera. Retención y borrado del buzón no están automatizados. El enlace alternativo mailto entrega el texto a la aplicación de correo elegida por el visitante.

## Seguridad implementada y límites

- Validación en servidor: método, origen exacto configurado, tipo y tamaño de contenido, campos y longitudes, correo, consentimiento y campo trampa.
- Destinatario fijo del servidor; el visitante no puede indicar otro destinatario. Mensaje como texto, sin interpolación de HTML. Reply-to validado.
- Clave privada solo en variable del servidor; `.env` excluido de Git. Ninguna clave en la entrega.
- Fallo explícito si falta configuración o falla el proveedor. No se registra el contenido del mensaje ni se muestran errores internos.
- Identificador estable para idempotencia en reintentos; no equivale a garantía de entrega a inbox. Confirmar en proveedor y buzón.
- Cabeceras CSP, anti-framing, no-referrer, nosniff y permisos de cámara/micrófono/geolocalización desactivados. Estilos inline permitidos para colores del catálogo; scripts inline bloqueados.
- Pendiente: rate limit en Vercel Firewall. Un campo trampa no detiene todos los bots. No se añadió un contador en memoria que pudiera aparentar protección distribuida.
- `LEGAL_READY=false` mantiene desactivada la recepción directa hasta completar los pendientes. No debe activarse por omisión o solo para ocultar el aviso.

## Accesibilidad y pruebas realizadas

- 11 páginas: comprobación de enlaces/recursos locales e imágenes con atributo alt. Logotipos de herramientas decorativos con alt vacío y nombre visible; logo de navegación con nombre alternativo.
- Portada, servicios, contacto, cuatro políticas y laboratorio a 390 px: sin desbordamiento horizontal. Portada y cierre inspeccionados visualmente en móvil, portada y ficha lateral en escritorio.
- Comprobación de contraste calculado sobre estilos de texto y fondo en esas 8 páginas: sin resultados por debajo de 4.5:1 para texto normal o 3:1 para texto grande en los elementos inspeccionados. No equivale a validación de cada estado gráfico ni certificación WCAG.
- Etiquetas vinculadas, campos requeridos, consentimiento sin marcar, foco visible, región de estado, diálogo nativo y navegación con teclado. Movimiento con pausa manual y respeto por reducción de movimiento.
- Formulario probado localmente con datos ficticios: muestra que el envío está inactivo y ofrece alternativa; no salió correo real.
- API probada con proveedor simulado: configuración ausente, consentimiento omitido, correo malformado, bot, exceso de longitud, origen externo, método incorrecto, JSON inválido, tipo incorrecto, aceptación y fallos/timeout. Todas las aserciones pasan. No se comprobó entrega real ni despliegue Vercel.

## Contenido y derechos

No hay fotografías, vídeos, imágenes de stock ni reseñas. Las cifras 10+/6+/50+ procedían de la instrucción original, pero no se aportó documentación de respaldo; se retiraron del sitio público en esta versión. Los nombres y descripciones de expedientes proceden de las referencias del usuario; comprobar autorización/confidencialidad y exactitud antes de publicar. No son avales ni testimonios.

El logotipo Branditamina es el archivo aportado; se conserva sin redibujar. Su símbolo ® requiere confirmar registro/titularidad. La ausencia de fotografías no elimina derechos sobre logotipos, tipografías, textos o marcas. La composición toma ideas de referencias y no contiene capturas ni código copiado de esas webs.

Rethink Sans está alojada localmente con su licencia OFL incluida. Adapter Mono no se distribuye: se utiliza una pila monoespaciada del sistema. Iconos de herramientas desde Simple Icons (los previos, versión 11.15.0; Claude descargado el 27.09.2026 desde el paquete publicado). La licencia del proyecto no concede derechos sobre las marcas. Uso identificativo; confirmar lineamientos de cada titular y sustituir por nombres si no procede el icono. [Simple Icons y advertencia sobre marcas](https://github.com/simple-icons/simple-icons#disclaimer).
