// Server-side contact delivery. Configure RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL in Vercel.
module.exports = async (req,res) => {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const body=req.body||{};
 const name=String(body.name||'').trim(),email=String(body.email||'').trim(),message=String(body.message||'').trim();
 if(body.website)return res.status(200).json({ok:true});
 if(!name||name.length>100||!email||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||!message||message.length>4000)return res.status(400).json({error:'Invalid form'});
 const key=process.env.RESEND_API_KEY,to=process.env.CONTACT_TO_EMAIL,from=process.env.CONTACT_FROM_EMAIL;
 if(!key||!to||!from)return res.status(503).json({error:'Contact email not configured'});
 try{
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:'Biblioteka Rexhep Jashari — mesazh nga formulari',text:'Emri: '+name+'\nEmaili: '+email+'\n\n'+message})});
 if(!response.ok)return res.status(502).json({error:'Delivery failed'});
 return res.status(200).json({ok:true});
 }catch(e){return res.status(502).json({error:'Delivery failed'})}
};
