(function () {
  const { useState } = React;
  const { SITE_CONFIG } = window.CONRAD_EXPRESS_DATA;

/* ── CONTACT ── */
function Contact({ c, gold, navy, language }) {
  const [form, setForm] = useState({ name:'', phone:'', type:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const fieldConstraints = {
    name: { autoComplete:'name', maxLength:80, required:true },
    phone: { autoComplete:'tel', inputMode:'tel', maxLength:32, required:true },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedForm = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      type: form.type,
      message: form.message.trim(),
    };
    if (!normalizedForm.name || !normalizedForm.phone || !normalizedForm.type) return;
    setForm(normalizedForm);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputStyle = {
    width:'100%', padding:'14px 0', background:'transparent',
    border:'none', borderBottom:`1px solid rgba(255,255,255,0.15)`,
    color:'#fff', fontSize:'14px', fontFamily:'Jost, sans-serif', fontWeight:300,
    outline:'none', transition:'border-color 0.2s', letterSpacing:'0.03em',
  };

  return (
    <section id="contact" style={{
      background:navy,
      padding:'120px 96px',
      backgroundImage:`radial-gradient(ellipse 60% 45% at 5% 10%, rgba(184,151,106,0.08) 0%, transparent 55%), radial-gradient(ellipse 40% 50% at 95% 90%, rgba(184,151,106,0.06) 0%, transparent 50%)`,
      boxShadow:'inset 0 1px 0 rgba(184,151,106,0.12)',
    }}>
      <div style={{ maxWidth:'1400px', margin:'0 auto' }}>
        <div className="g-split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'96px', alignItems:'start' }}>
          <div className="reveal-left">
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
              <div style={{ width:'40px', height:'1px', background:gold }} />
              <span style={{ fontSize:'11px', letterSpacing:'0.25em', color:gold, fontFamily:'Jost' }}>
                {c.contact.label.toUpperCase()}
              </span>
            </div>
            <h2 style={{
              fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(40px, 4vw, 60px)',
              fontWeight:300, color:'#fff', lineHeight:1.1, whiteSpace:'pre-line',
              marginBottom:'32px',
            }}>{c.contact.title}</h2>
            <p style={{
              fontSize:'14px', lineHeight:1.9, color:'rgba(255,255,255,0.45)',
              fontFamily:'Jost', fontWeight:300, whiteSpace:'pre-line',
            }}>{c.contact.sub}</p>

            {/* Contact details */}
            <div style={{ marginTop:'52px', display:'flex', flexDirection:'column', gap:'24px' }}>
              {[
                { label:'LINE OA', val:c.footer.line },
                { label:'Email', val:SITE_CONFIG.contact.email },
                { label:'Phone', val:c.footer.tel },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', gap:'24px', alignItems:'center' }}>
                  <span style={{ fontSize:'10px', letterSpacing:'0.2em', color:`${gold}80`, fontFamily:'Jost', minWidth:'60px' }}>
                    {item.label.toUpperCase()}
                  </span>
                  <span style={{ fontSize:'14px', color:'rgba(255,255,255,0.6)', fontFamily:'Jost', fontWeight:300 }}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="reveal-right" style={{ display:'flex', flexDirection:'column', gap:'28px' }}>
            {submitted && (
              <div style={{
                background:`${gold}15`, border:`1px solid ${gold}40`,
                padding:'16px 24px', color:gold, fontSize:'13px', fontFamily:'Jost',
                letterSpacing:'0.05em',
              }}>
                ✓ {language === 'th' ? 'รับคำขอของคุณแล้ว เราจะติดต่อกลับภายใน 2 ชั่วโมง' : 'Your request has been received. We will respond within 2 hours.'}
              </div>
            )}

            {[
              { key:'name', label:c.contact.fields.name, type:'text' },
              { key:'phone', label:c.contact.fields.phone, type:'tel' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display:'block', fontSize:'10px', letterSpacing:'0.2em', color:`${gold}60`, fontFamily:'Jost', marginBottom:'8px' }}>
                  {f.label.toUpperCase()}
                </label>
                <input
                  name={f.key}
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  {...fieldConstraints[f.key]}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderBottomColor = gold}
                  onBlur={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
                />
              </div>
            ))}

            <div>
              <label style={{ display:'block', fontSize:'10px', letterSpacing:'0.2em', color:`${gold}60`, fontFamily:'Jost', marginBottom:'8px' }}>
                {c.contact.fields.type.toUpperCase()}
              </label>
              <select
                name="serviceType"
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                required
                style={{ ...inputStyle, appearance:'none' }}
                onFocus={e => e.target.style.borderBottomColor = gold}
                onBlur={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
              >
                <option value="" style={{ background:navy }}>—</option>
                {c.contact.types.map((t, i) => (
                  <option key={i} value={t} style={{ background:navy }}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display:'block', fontSize:'10px', letterSpacing:'0.2em', color:`${gold}60`, fontFamily:'Jost', marginBottom:'8px' }}>
                {c.contact.fields.message.toUpperCase()}
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                maxLength={600}
                rows={4}
                style={{ ...inputStyle, resize:'none' }}
                onFocus={e => e.target.style.borderBottomColor = gold}
                onBlur={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <button type="submit" style={{
              background: gold, color: navy, border:'none',
              padding:'16px 40px', fontSize:'12px', letterSpacing:'0.15em',
              fontFamily:'Jost, sans-serif', fontWeight:500,
              cursor:'pointer', alignSelf:'flex-start', transition:'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='#cead82'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background=gold; e.currentTarget.style.transform='translateY(0)'; }}
            >{c.contact.fields.cta.toUpperCase()}</button>
          </form>
        </div>
      </div>
    </section>
  );
}


  window.Contact = Contact;
})();
