(function () {
  const { useEffect, useState } = React;
  const { SITE_CONFIG, POLICIES } = window.CONRAD_EXPRESS_DATA;
  const { SectionEyebrow } = window;

const renderInline = (text) => String(text).split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
  if (part.startsWith('**') && part.endsWith('**')) {
    return <strong key={index}>{part.slice(2, -2)}</strong>;
  }
  return <React.Fragment key={index}>{part}</React.Fragment>;
});

function PolicyBlock({ block, gold, navy }) {
  const paragraphStyle = {
    fontSize:'14px',
    lineHeight:1.85,
    color:'rgba(255,255,255,0.72)',
    whiteSpace:'pre-line',
    margin:'0 0 16px',
    fontFamily:'Jost, sans-serif',
    fontWeight:300,
  };

  if (block.type === 'table') {
    return (
      <div className="contact-policy-table-wrap">
        <table className="contact-policy-table" style={{
          width:'100%',
          minWidth:'620px',
          borderCollapse:'collapse',
          fontSize:'13px',
          color:'rgba(255,255,255,0.68)',
        }}>
          <thead>
            <tr>
              {block.headers.map((header, index) => (
                <th key={index} style={{
                  textAlign:'left',
                  padding:'12px 14px',
                  borderBottom:`1px solid ${gold}45`,
                  color:gold,
                  fontWeight:500,
                  letterSpacing:'0.04em',
                }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={{
                    padding:'12px 14px',
                    borderBottom:'1px solid rgba(255,255,255,0.08)',
                    verticalAlign:'top',
                    lineHeight:1.65,
                  }}>{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === 'list' || block.type === 'ordered') {
    const ListTag = block.type === 'ordered' ? 'ol' : 'ul';
    return (
      <ListTag style={{
        margin:'0 0 18px 20px',
        padding:0,
        color:'rgba(255,255,255,0.72)',
        fontSize:'14px',
        lineHeight:1.8,
        fontFamily:'Jost, sans-serif',
        fontWeight:300,
      }}>
        {block.items.map((item, index) => (
          <li key={index} style={{ paddingLeft:'6px', marginBottom:'8px' }}>{renderInline(item)}</li>
        ))}
      </ListTag>
    );
  }

  return <p style={paragraphStyle}>{renderInline(block.text)}</p>;
}

function PolicyPanel({ policy, ui, gold, navy, onClose }) {
  const titleId = `contact-policy-title-${policy.id}`;

  return (
    <div
      className="contact-policy-overlay"
      role="presentation"
      onClick={onClose}
    >
      <article
        className="contact-policy-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={e => e.stopPropagation()}
        style={{
          background:`linear-gradient(160deg, ${navy}f7 0%, #07101ef7 100%)`,
          border:`1px solid ${gold}45`,
        }}
      >
        <div className="contact-policy-head" style={{ borderBottom:`1px solid ${gold}25` }}>
          <div>
            <span style={{
              display:'block',
              fontSize:'10px',
              letterSpacing:'0.22em',
              color:`${gold}88`,
              fontFamily:'Jost, sans-serif',
              marginBottom:'10px',
              textTransform:'uppercase',
            }}>{ui.eyebrow}</span>
            <h3 id={titleId} style={{
              fontFamily:'Cormorant Garamond, serif',
              fontSize:'clamp(30px, 4vw, 48px)',
              fontWeight:300,
              lineHeight:1.08,
              color:'#fff',
              margin:0,
            }}>{policy.title}</h3>
            <p style={{
              margin:'12px 0 0',
              fontSize:'12px',
              letterSpacing:'0.08em',
              color:'rgba(255,255,255,0.48)',
              fontFamily:'Jost, sans-serif',
            }}>{policy.brand} · {ui.updatedLabel}: {policy.updated}</p>
          </div>

          <button
            type="button"
            aria-label={ui.close}
            onClick={onClose}
            className="contact-policy-close"
            style={{
              color:gold,
              border:`1px solid ${gold}50`,
              background:'rgba(255,255,255,0.03)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = gold;
              e.currentTarget.style.color = navy;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.color = gold;
            }}
          >{ui.close}</button>
        </div>

        <div className="contact-policy-content">
          {policy.sections.map((section) => (
            <section key={section.heading} style={{ marginBottom:'34px' }}>
              <h4 style={{
                color:gold,
                fontSize:'18px',
                lineHeight:1.35,
                fontWeight:500,
                fontFamily:'Jost, sans-serif',
                margin:'0 0 14px',
              }}>{section.heading}</h4>
              {section.blocks.map((block, index) => (
                <PolicyBlock key={index} block={block} gold={gold} navy={navy} />
              ))}
            </section>
          ))}

          {policy.note && (
            <p style={{
              margin:'6px 0 0',
              padding:'18px 20px',
              border:`1px solid ${gold}25`,
              background:`${gold}10`,
              color:'rgba(255,255,255,0.66)',
              fontSize:'13px',
              lineHeight:1.8,
              fontStyle:'italic',
              fontFamily:'Jost, sans-serif',
              fontWeight:300,
            }}>{policy.note}</p>
          )}
        </div>
      </article>
    </div>
  );
}

/* ── CONTACT ── */
function Contact({ c, gold, navy, language }) {
  const [form, setForm] = useState({ name:'', phone:'', type:'', message:'' });
  const [submitState, setSubmitState] = useState('idle');
  const [activePolicyId, setActivePolicyId] = useState(null);
  const policyOrder = POLICIES.order || [];
  const activePolicy = activePolicyId ? POLICIES.documents?.[activePolicyId] : null;
  const policyUi = POLICIES.ui?.[language] || POLICIES.ui?.th || POLICIES.ui?.en || {};
  const fieldConstraints = {
    name: { autoComplete:'name', maxLength:80, required:true },
    phone: { autoComplete:'tel', inputMode:'tel', maxLength:32, required:true },
  };
  const otherShipmentTypes = (c.contact.types || []).filter((type) => {
    const normalized = String(type).trim().toLowerCase();
    return normalized === 'other' || normalized === 'อื่นๆ';
  });
  const shipmentTypes = [
    ...c.services.items.map((service) => service.title),
    ...(otherShipmentTypes.length ? otherShipmentTypes : [language === 'th' ? 'อื่นๆ' : 'Other']),
  ];

  useEffect(() => {
    if (!activePolicyId) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActivePolicyId(null);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePolicyId]);

  const openPolicy = (policyId) => {
    if (!policyId || !POLICIES.documents?.[policyId]) return;
    setActivePolicyId(policyId);
    requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ block:'start' });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedForm = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      type: form.type,
      message: form.message.trim(),
    };
    if (!normalizedForm.name || !normalizedForm.phone || !normalizedForm.type) return;

    const payload = {
      ...normalizedForm,
      language,
      pageUrl: window.location.href,
      submittedAt: new Date().toISOString(),
      userAgent: window.navigator.userAgent,
    };

    const endpoint = SITE_CONFIG.contact.formEndpoint;

    setSubmitState('submitting');
    try {
      if (endpoint) {
        await fetch(endpoint, {
          method:'POST',
          mode:'no-cors',
          headers:{ 'Content-Type':'text/plain;charset=utf-8' },
          body:JSON.stringify(payload),
        });
      }
      setForm({ name:'', phone:'', type:'', message:'' });
      setSubmitState('success');
      setTimeout(() => setSubmitState('idle'), 5000);
    } catch (error) {
      setForm(normalizedForm);
      setSubmitState('error');
    }
  };

  const inputStyle = {
    width:'100%', padding:'14px 0', background:'transparent',
    border:'none', borderBottom:`1px solid rgba(255,255,255,0.15)`,
    color:'#fff', fontSize:'14px', fontFamily:'Jost, sans-serif', fontWeight:300,
    outline:'none', transition:'border-color 0.2s', letterSpacing:'0.03em',
  };
  const labelStyle = {
    display:'block', fontSize:'10px', letterSpacing:'0.2em',
    color:`${gold}60`, fontFamily:'Jost', marginBottom:'8px',
  };
  // Shared underline focus/blur for every field
  const focusUnderline = {
    onFocus: e => { e.target.style.borderBottomColor = gold; },
    onBlur: e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)'; },
  };

  return (
    <section id="contact" className="contact-section" style={{
      background:navy,
      padding:'88px 96px 0',
      minHeight:'calc(100vh - 72px)',
      height:'calc(100vh - 72px)',
      boxSizing:'border-box',
      display:'flex',
      flexDirection:'column',
      justifyContent:'space-between',
      position:'relative',
      overflow:'hidden',
      backgroundImage:`radial-gradient(ellipse 60% 45% at 5% 10%, rgba(226,181,111,0.08) 0%, transparent 55%), radial-gradient(ellipse 40% 50% at 95% 90%, rgba(226,181,111,0.06) 0%, transparent 50%)`,
      boxShadow:'inset 0 1px 0 rgba(226,181,111,0.12)',
    }}>
      <style>{`
        #contact.contact-section {
          padding:88px 96px 0 !important;
          min-height:calc(100vh - 72px) !important;
          height:calc(100vh - 72px) !important;
        }
        #contact .contact-body {
          flex:1 1 auto;
          min-height:0;
          align-items:center !important;
        }
        #contact .contact-footer {
          width:calc(100% + 192px) !important;
          margin-left:-96px !important;
          margin-right:-96px !important;
          padding-left:96px !important;
          padding-right:96px !important;
          box-sizing:border-box !important;
        }
        #contact .contact-copy {
          align-self:flex-start !important;
        }
        #contact .contact-policy-overlay {
          position:absolute;
          inset:0;
          z-index:260;
          padding:88px 96px 78px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(6,14,26,0.97);
        }
        #contact .contact-policy-panel {
          width:min(980px, 100%);
          max-height:100%;
          border-radius:8px;
          box-shadow:0 26px 80px rgba(0,0,0,0.46);
          display:flex;
          flex-direction:column;
          overflow:hidden;
        }
        #contact .contact-policy-head {
          flex:0 0 auto;
          padding:30px 34px 26px;
          display:grid;
          grid-template-columns:1fr auto;
          gap:24px;
          align-items:start;
        }
        #contact .contact-policy-close {
          min-width:72px;
          height:40px;
          border-radius:8px;
          cursor:pointer;
          font-family:Jost, sans-serif;
          font-size:11px;
          letter-spacing:0.14em;
          text-transform:uppercase;
          transition:background 0.2s, color 0.2s, border-color 0.2s;
        }
        #contact .contact-policy-content {
          min-height:0;
          overflow:auto;
          padding:30px 34px 36px;
          scrollbar-width:thin;
          scrollbar-color:rgba(226,181,111,0.45) transparent;
        }
        #contact .contact-policy-content::-webkit-scrollbar,
        #contact .contact-policy-table-wrap::-webkit-scrollbar {
          width:6px;
          height:6px;
        }
        #contact .contact-policy-content::-webkit-scrollbar-thumb,
        #contact .contact-policy-table-wrap::-webkit-scrollbar-thumb {
          background:rgba(226,181,111,0.45);
          border-radius:999px;
        }
        #contact .contact-policy-table-wrap {
          width:100%;
          overflow-x:auto;
          margin:0 0 20px;
          border:1px solid rgba(226,181,111,0.18);
          border-radius:8px;
        }
        @media (max-width:1440px) {
          #contact.contact-section { padding:82px 64px 0 !important; }
          #contact .contact-footer {
            width:calc(100% + 128px) !important;
            margin-left:-64px !important;
            margin-right:-64px !important;
            padding-left:64px !important;
            padding-right:64px !important;
          }
        }
        @media (max-height:820px) and (min-width:768px) {
          #contact.contact-section { padding-top:64px !important; }
          #contact .contact-shell { gap:64px !important; }
          #contact .contact-heading { font-size:clamp(38px, 4vw, 54px) !important; margin-bottom:22px !important; }
          #contact .contact-details { margin-top:32px !important; gap:18px !important; }
          #contact .contact-form { gap:20px !important; }
          #contact .contact-footer-inner { padding-top:18px !important; padding-bottom:18px !important; }
        }
        @media (max-width:1024px) {
          #contact.contact-section {
            height:auto !important;
            min-height:calc(100vh - 72px) !important;
            padding:88px 40px 0 !important;
            overflow:visible !important;
          }
          #contact .contact-body { min-height:auto !important; padding:34px 0 46px !important; align-items:flex-start !important; }
          #contact .contact-shell { grid-template-columns:1fr !important; gap:52px !important; }
          #contact .contact-footer {
            width:calc(100% + 80px) !important;
            margin-left:-40px !important;
            margin-right:-40px !important;
            padding-left:40px !important;
            padding-right:40px !important;
          }
          #contact .contact-footer-inner { align-items:flex-start !important; }
          #contact .contact-policy-overlay {
            position:fixed;
            padding:88px 40px 34px;
          }
        }
        @media (max-width:767px) {
          #contact.contact-section { padding:82px 22px 0 !important; }
          #contact .contact-body { padding:24px 0 38px !important; }
          #contact .contact-heading { font-size:clamp(40px, 12vw, 54px) !important; }
          #contact .contact-footer {
            width:calc(100% + 44px) !important;
            margin-left:-22px !important;
            margin-right:-22px !important;
            padding-left:22px !important;
            padding-right:22px !important;
          }
          #contact .contact-footer-inner { flex-direction:column !important; gap:16px !important; }
          #contact .contact-policy-overlay { padding:82px 16px 22px; }
          #contact .contact-policy-head {
            grid-template-columns:1fr;
            gap:18px;
            padding:24px 22px 22px;
          }
          #contact .contact-policy-close {
            width:100%;
          }
          #contact .contact-policy-content {
            padding:24px 22px 28px;
          }
        }
      `}</style>

      <div className="contact-body" style={{ width:'100%', display:'flex', alignItems:'center' }}>
        <div style={{ width:'100%', maxWidth:'1400px', margin:'0 auto' }}>
        <div className="g-split contact-shell" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'96px', alignItems:'center' }}>
          <div className="reveal-left contact-copy" style={{ alignSelf:'flex-start' }}>
            <SectionEyebrow label={c.contact.label} gold={gold} />
            <h2 className="contact-heading" style={{
              fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(40px, 4vw, 60px)',
              fontWeight:300, color:'#fff', lineHeight:1.1, whiteSpace:'pre-line',
              marginBottom:'32px',
            }}>{c.contact.title}</h2>
            <p style={{
              fontSize:'14px', lineHeight:1.9, color:'rgba(255,255,255,0.45)',
              fontFamily:'Jost', fontWeight:300, whiteSpace:'pre-line',
            }}>{c.contact.sub}</p>

            {/* Contact details */}
            <div className="contact-details" style={{ marginTop:'52px', display:'flex', flexDirection:'column', gap:'24px' }}>
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
          <div className="reveal-right contact-form-wrap" style={{ position:'relative' }}>
            {(submitState === 'success' || submitState === 'error') && (
              <div
                className="contact-status"
                aria-live="polite"
                style={{
                  position:'absolute',
                  left:0,
                  right:0,
                  top:'-76px',
                  background:submitState === 'success' ? `${gold}15` : 'rgba(180,66,66,0.12)',
                  border:submitState === 'success' ? `1px solid ${gold}40` : '1px solid rgba(220,110,110,0.35)',
                  padding:'16px 24px',
                  color:submitState === 'success' ? gold : 'rgba(255,185,185,0.86)',
                  fontSize:'13px',
                  fontFamily:'Jost',
                  letterSpacing:submitState === 'success' ? '0.05em' : '0.04em',
                  pointerEvents:'none',
                  zIndex:4,
                }}
              >
                {submitState === 'success'
                  ? `✓ ${language === 'th' ? 'รับคำขอของคุณแล้ว เราจะติดต่อกลับภายใน 2 ชั่วโมง' : 'Your request has been received. We will respond within 2 hours.'}`
                  : (language === 'th' ? 'ส่งคำขอไม่สำเร็จ กรุณาลองอีกครั้งหรือติดต่อเราทาง LINE OA' : 'Unable to submit. Please try again or contact us via LINE OA.')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form" style={{ display:'flex', flexDirection:'column', gap:'28px' }}>

            {[
              { key:'name', label:c.contact.fields.name, type:'text' },
              { key:'phone', label:c.contact.fields.phone, type:'tel' },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label.toUpperCase()}</label>
                <input
                  name={f.key}
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  disabled={submitState === 'submitting'}
                  {...fieldConstraints[f.key]}
                  style={inputStyle}
                  {...focusUnderline}
                />
              </div>
            ))}

            <div>
              <label style={labelStyle}>{c.contact.fields.type.toUpperCase()}</label>
              <select
                name="serviceType"
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                disabled={submitState === 'submitting'}
                required
                style={{ ...inputStyle, appearance:'none' }}
                {...focusUnderline}
              >
                <option value="" style={{ background:navy }}>—</option>
                {shipmentTypes.map((t, i) => (
                  <option key={i} value={t} style={{ background:navy }}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>{c.contact.fields.message.toUpperCase()}</label>
              <textarea
                name="message"
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                disabled={submitState === 'submitting'}
                maxLength={600}
                rows={4}
                style={{ ...inputStyle, resize:'none' }}
                {...focusUnderline}
              />
            </div>

            <button type="submit" disabled={submitState === 'submitting'} style={{
              background: gold, color: navy, border:'none',
              padding:'16px 40px', fontSize:'12px', letterSpacing:'0.15em',
              fontFamily:'Jost, sans-serif', fontWeight:500,
              cursor:submitState === 'submitting' ? 'wait' : 'pointer', alignSelf:'flex-start', transition:'all 0.25s',
              opacity:submitState === 'submitting' ? 0.65 : 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.background='#fff0c9'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background=gold; e.currentTarget.style.transform='translateY(0)'; }}
            >{submitState === 'submitting'
              ? (language === 'th' ? 'กำลังส่ง...' : 'SUBMITTING...')
              : c.contact.fields.cta.toUpperCase()}</button>
            </form>
          </div>
        </div>
        </div>
      </div>

      {activePolicy && (
        <PolicyPanel
          policy={activePolicy}
          ui={policyUi}
          gold={gold}
          navy={navy}
          onClose={() => setActivePolicyId(null)}
        />
      )}

      <div role="contentinfo" className="contact-footer" style={{
        width:'100%',
        flex:'0 0 auto',
        borderTop:`1px solid rgba(226,181,111,0.18)`,
        background:'#060e1a',
        boxShadow:'0 -18px 42px rgba(0,0,0,0.18)',
      }}>
        <div className="contact-footer-inner" style={{
          maxWidth:'1400px',
          margin:'0 auto',
          padding:'22px 0 24px',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          flexWrap:'wrap',
          gap:'22px',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
            <span style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'16px', letterSpacing:'0.15em', color:'rgba(255,255,255,0.42)' }}>
              CONRAD EXPRESS
            </span>
            <span style={{ color:`${gold}40`, margin:'0 4px' }}>·</span>
            <span style={{ fontSize:'11px', letterSpacing:'0.15em', color:`${gold}60`, fontFamily:'Jost' }}>
              {c.footer.tagline.toUpperCase()}
            </span>
          </div>

          <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
            {c.footer.links.map((l, i) => {
              const policyId = policyOrder[i];
              const hasPolicy = Boolean(POLICIES.documents?.[policyId]);
              return (
              <button key={i} type="button" disabled={!hasPolicy} aria-haspopup="dialog" onClick={() => openPolicy(policyId)} style={{
                background:'transparent', border:'none', padding:0, cursor:hasPolicy ? 'pointer' : 'default',
                fontSize:'10.5px', color:'rgba(255,255,255,0.3)', textDecoration:'none',
                letterSpacing:'0.1em', fontFamily:'Jost', transition:'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = gold}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
              >{l}</button>
              );
            })}
          </div>

          <span style={{ fontSize:'10.5px', color:'rgba(255,255,255,0.25)', fontFamily:'Jost' }}>
            {c.footer.copy}
          </span>
        </div>
      </div>
    </section>
  );
}


  window.Contact = Contact;
})();
