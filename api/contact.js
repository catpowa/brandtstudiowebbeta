// No request bodies, email addresses or provider errors are logged.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const reply = (status, code) => res.status(status).json({ok:status===200,code});
  if (req.method !== 'POST') {res.setHeader('Allow','POST');return reply(405,'METHOD');}
  const {RESEND_API_KEY,CONTACT_TO,CONTACT_FROM,SITE_ORIGIN,LEGAL_READY}=process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM || !SITE_ORIGIN || LEGAL_READY !== 'true') return reply(503,'NOT_CONFIGURED');
  if (req.headers.origin !== SITE_ORIGIN) return reply(403,'ORIGIN');
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type']||'')) return reply(415,'CONTENT_TYPE');
  if (Number(req.headers['content-length'])>12000) return reply(413,'TOO_LARGE');
  let b;
  try {b=typeof req.body==='string'?JSON.parse(req.body):req.body;} catch {return reply(400,'INVALID');}
  if (!b || Array.isArray(b) || typeof b!=='object') return reply(400,'INVALID');
  if (Buffer.byteLength(JSON.stringify(b),'utf8')>12000) return reply(413,'TOO_LARGE');
  const valid=(v,min,max)=>typeof v==='string'&&v.trim().length>=min&&v.length<=max&&!v.includes('\0');
  if (!valid(b.nombre,1,100)||!valid(b.email,3,254)||!valid(b.reto,5,3000)||!valid(b.marca??'',0,160)||!valid(b.area??'',0,300)||b.consent!==true||b.website||!valid(b.requestId,36,36)) return reply(400,'INVALID');
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(b.email)||/[\r\n]/.test(b.email)||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(b.requestId)) return reply(400,'INVALID');
  const text=`Nueva consulta web\n\nNombre: ${b.nombre.trim()}\nCorreo: ${b.email.trim()}\nMarca: ${(b.marca||'No indicada').trim()}\nInterés: ${(b.area||'Orientación').trim()}\n\n${b.reto.trim()}\n\nConsentimiento afirmativo: responder a esta consulta.\nPolítica: 26.09.2026`;
  try {
    const result=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`contact/${b.requestId}`},body:JSON.stringify({from:CONTACT_FROM,to:[CONTACT_TO],reply_to:b.email.trim(),subject:'Nuevo caso · Branditamina',text}),signal:AbortSignal.timeout(12000)});
    const data=await result.json();
    if (!result.ok || typeof data.id!=='string') return reply(502,'PROVIDER');
    return reply(200,'ACCEPTED');
  } catch { return reply(502,'PROVIDER'); }
}
