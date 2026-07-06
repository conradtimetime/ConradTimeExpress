(function () {
  const { useState } = React;
  const { CardSwiper, StarIcon, SectionEyebrow, SECTION_FRAME, getSectionFrameStyle, getSectionFrameCss } = window;

const BOOKING_TARGET = '#contact';

function getTierTheme(pkg, index, gold) {
  const rawKey = String(pkg.name || '').trim().toLowerCase();
  const tierAliases = {
    'other provinces':'silver',
    '5 delivery':'gold',
    monthly:'gold',
    exclusive:'platinum',
  };
  const key = tierAliases[rawKey] || rawKey;
  const themes = {
    standard: {
      key:'standard',
      icon:'rgba(15,30,53,0.46)',
      title:'rgba(15,30,53,0.72)',
      price:'#0f1e35',
      marker:'rgba(15,30,53,0.42)',
      surface:'linear-gradient(135deg, var(--cream) 0%, var(--cream) 100%)',
      frame:'linear-gradient(135deg, rgba(15,30,53,0.08), rgba(15,30,53,0.18))',
      shadow:'0 1px 4px rgba(0,0,0,0.04)',
      sheen:'linear-gradient(110deg, transparent 0%, transparent 100%)',
      sheenOpacity:'0',
      ctaBorder:'rgba(15,30,53,0.12)',
    },
    silver: {
      key:'silver',
      icon:'#aeb7c2',
      title:'#8d96a3',
      price:'#0f1e35',
      marker:'#aab3bf',
      surface:'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(249,246,240,0.96) 54%, rgba(234,237,241,0.7) 100%)',
      frame:'linear-gradient(125deg, #79818c 0%, #f8fbff 22%, #a9b2be 40%, #ffffff 56%, #8b95a2 76%, #d8dee6 100%)',
      shadow:'0 10px 26px rgba(130,142,158,0.18), inset 0 1px 0 rgba(255,255,255,0.72)',
      sheen:'linear-gradient(112deg, transparent 8%, rgba(255,255,255,0.55) 34%, rgba(174,183,194,0.18) 48%, transparent 68%)',
      sheenOpacity:'0.32',
      ctaBorder:'rgba(150,160,174,0.48)',
    },
    gold: {
      key:'gold',
      icon:gold,
      title:gold,
      price:'#0f1e35',
      marker:gold,
      surface:'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(249,246,240,0.96) 58%, rgba(255,240,201,0.42) 100%)',
      frame:`linear-gradient(125deg, #8a5a22 0%, ${gold} 18%, #fff0c9 36%, #d79a43 54%, #fff7d8 72%, #b7792f 100%)`,
      shadow:`0 0 0 1px ${gold}30, 0 0 30px ${gold}38, 0 14px 36px rgba(183,121,47,0.18), inset 0 1px 0 rgba(255,240,201,0.42)`,
      sheen:'linear-gradient(112deg, transparent 4%, rgba(255,240,201,0.62) 28%, rgba(226,181,111,0.16) 46%, transparent 66%)',
      sheenOpacity:'0.38',
      ctaBorder:`${gold}70`,
    },
    platinum: {
      key:'platinum',
      icon:'#7f8dff',
      title:'#7d86b9',
      price:'#0f1e35',
      marker:'#8b7cff',
      surface:'linear-gradient(135deg, rgba(255,255,255,0.76) 0%, rgba(247,248,255,0.96) 46%, rgba(255,239,252,0.72) 100%)',
      frame:'linear-gradient(128deg, #62f3ff 0%, #ffffff 13%, #6f85ff 28%, #ff55dd 44%, #8d68ff 58%, #5defff 74%, #fff4ff 88%, #3358d8 100%)',
      shadow:'0 0 0 1px rgba(116,248,255,0.18), 0 0 28px rgba(103,95,245,0.24), 0 0 46px rgba(255,75,216,0.16), inset 0 1px 0 rgba(255,255,255,0.74)',
      sheen:'linear-gradient(112deg, transparent 2%, rgba(116,248,255,0.5) 18%, rgba(255,255,255,0.72) 34%, rgba(255,75,216,0.34) 50%, rgba(91,239,255,0.28) 66%, transparent 82%)',
      sheenOpacity:'0.42',
      ctaBorder:'rgba(126,130,255,0.46)',
    },
  };
  return themes[key] || themes[Object.keys(themes)[index]] || themes.standard;
}

function getPackagePrice(pkg) {
  return {
    label:pkg.label || '',
    amount:pkg.amount || pkg.price || '',
    text:pkg.priceText || '',
    tone:pkg.priceTone || '',
    unit:pkg.unit || '',
    original:pkg.original || '',
    promoLabel:pkg.promoLabel || '',
  };
}

function getPackageFit(pkg) {
  return pkg.fit || pkg.fitFor || pkg.audience || '';
}

function normalizeCardTag(tag) {
  if (!tag) return null;
  if (typeof tag === 'string') return { label: tag, tone: 'promo', position: 'right' };
  if (!tag.label) return null;
  return {
    tone: 'promo',
    position: 'right',
    ...tag,
  };
}

function getPackageCornerTag(pkg, price) {
  return normalizeCardTag(pkg.cornerTag || pkg.cardTag || (price.promoLabel ? { label: price.promoLabel, tone: 'promo' } : null));
}

function CardCornerTag({ tag, gold, navy }) {
  const normalized = normalizeCardTag(tag);
  if (!normalized) return null;

  const tone = normalized.tone || normalized.variant || 'promo';
  const palettes = {
    promo: {
      background: `linear-gradient(135deg, #9a651f 0%, ${gold} 24%, #fff0b8 46%, #e2b56f 64%, #8d5919 100%)`,
      color: navy,
      shadow: '0 9px 22px rgba(226,181,111,0.42), 0 1px 0 rgba(255,255,255,0.5) inset',
      edge: 'rgba(255,255,255,0.52)',
    },
    navy: {
      background: `linear-gradient(135deg, ${navy} 0%, #243a5d 54%, ${navy} 100%)`,
      color: '#fff',
      shadow: '0 9px 22px rgba(15,30,53,0.28), 0 1px 0 rgba(255,255,255,0.18) inset',
      edge: 'rgba(255,255,255,0.24)',
    },
  };
  const palette = palettes[tone] || palettes.promo;
  const side = normalized.position === 'left' ? 'left' : 'right';

  return (
    <div
      className={`package-corner-tag package-corner-tag-${tone} package-corner-tag-${side}`}
      aria-hidden="true"
      style={{
        position:'absolute',
        top:'20px',
        [side]:'-48px',
        width:'168px',
        height:'34px',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        background:palette.background,
        color:palette.color,
        borderTop:`1px solid ${palette.edge}`,
        borderBottom:`1px solid rgba(15,30,53,0.1)`,
        boxShadow:palette.shadow,
        transform:`rotate(${side === 'right' ? '42deg' : '-42deg'})`,
        transformOrigin:'center',
        zIndex:3,
        pointerEvents:'none',
        overflow:'hidden',
      }}
    >
      <span style={{
        position:'relative',
        zIndex:1,
        fontFamily:'Jost',
        fontSize:'10px',
        fontWeight:700,
        letterSpacing:'0.18em',
        lineHeight:1,
        whiteSpace:'nowrap',
        textTransform:'uppercase',
        textShadow:tone === 'promo' ? '0 1px 0 rgba(255,255,255,0.45)' : 'none',
      }}>{normalized.label}</span>
    </div>
  );
}

function PricingCards({ items, activeIdx, onSelect, gold, navy }) {
  return (
    <CardSwiper className="reveal-stagger packages-grid g-4 swipe" style={{ display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:'2px' }}>
      {items.map((pkg, index) => (
        <PricingCard
          key={pkg.name}
          pkg={pkg}
          active={activeIdx === index}
          theme={getTierTheme(pkg, index, gold)}
          gold={gold}
          navy={navy}
          onSelect={() => onSelect(index)}
        />
      ))}
    </CardSwiper>
  );
}

function PricingCard({ pkg, active, theme, gold, navy, onSelect }) {
  const highlighted = Boolean(pkg.highlight);
  const selected = active;
  const currentPrice = getPackagePrice(pkg);
  const packageDetails = [...(pkg.details || []), ...(pkg.features || [])];
  const priceText = currentPrice.text || '';
  const priceSummary = priceText || `${currentPrice.amount || ''}${currentPrice.unit || ''}`;
  const priceTextLetterSpacing = /[A-Za-z]/.test(priceText) ? '0.08em' : 0;
  const cornerTag = getPackageCornerTag(pkg, currentPrice);
  const packageFit = getPackageFit(pkg);

  return (
    <article
      className={`package-card package-tier-${theme.key}${active ? ' is-active' : ''}${highlighted ? ' is-highlighted' : ''}`}
      aria-label={`${pkg.name}. ${cornerTag ? `${cornerTag.label}. ` : ''}${priceSummary}. ${packageFit ? `${packageFit}. ` : ''}${packageDetails.join(', ')}`}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      style={{
        '--package-accent': selected ? navy : theme.icon,
        '--tier-frame': theme.frame,
        '--tier-surface': theme.surface,
        '--tier-sheen': theme.sheen,
        '--tier-sheen-opacity': selected ? '0' : theme.sheenOpacity,
        position:'relative',
        padding:'48px 30px 38px',
        minWidth:0,
        minHeight:'560px',
        background:selected
          ? `var(--tier-surface) padding-box, linear-gradient(135deg, ${navy} 0%, #243a5d 48%, ${navy} 100%) border-box`
          : 'var(--tier-surface) padding-box, var(--tier-frame) border-box',
        border:'1px solid transparent',
        borderTop:selected || highlighted ? '2px solid transparent' : '1px solid transparent',
        boxShadow:theme.shadow,
        transition:'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
        cursor:'pointer',
        display:'grid',
        gridTemplateRows:'minmax(var(--package-title-row), auto) minmax(var(--package-price-row), auto) minmax(var(--package-details-row), 1fr) auto',
        isolation:'isolate',
      }}
    >
      {pkg.badge && (
        <div style={{
          position:'absolute',
          top:'-1px',
          left:'50%',
          transform:'translateX(-50%)',
          background:theme.key === 'gold' ? gold : navy,
          color:theme.key === 'gold' ? navy : '#fff',
          fontSize:'9px',
          letterSpacing:'0.2em',
          fontFamily:'Jost',
          fontWeight:500,
          padding:'4px 14px',
          whiteSpace:'nowrap',
          zIndex:2,
        }}>{pkg.badge.toUpperCase()}</div>
      )}

      <CardCornerTag tag={cornerTag} gold={gold} navy={navy} />

      <div className="package-card-head" style={{ display:'flex', alignItems:'flex-start', gap:'10px', minWidth:0 }}>
        <StarIcon size={12} color={theme.icon} style={{ opacity:selected ? 1 : 0.72, flexShrink:0 }} />
        <h3 style={{
          fontFamily:'Cormorant Garamond, serif',
          fontSize:'22px',
          fontWeight:400,
          letterSpacing:'0.15em',
          color:theme.title,
          transition:'color 0.3s',
          minWidth:0,
          overflowWrap:'anywhere',
        }}>{pkg.name.toUpperCase()}</h3>
      </div>

      <div className="package-current-price" style={{
        margin:0,
        paddingBottom:'10px',
        borderBottom:'1px solid rgba(15,30,53,0.1)',
        minWidth:0,
        height:'100%',
        boxSizing:'border-box',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
      }}>
        <div className="package-price-value" style={{ display:'flex', alignItems:priceText ? 'center' : 'baseline', gap:'8px', flexWrap:'nowrap', minWidth:0, marginBottom:'8px' }}>
          {priceText ? (
            <span className="package-price-contact" style={{
              fontFamily:'Jost',
              fontSize:'30px',
              fontWeight:500,
              letterSpacing:priceTextLetterSpacing,
              color:theme.price,
              lineHeight:1.12,
              whiteSpace:'normal',
              overflowWrap:'anywhere',
            }}>{priceText}</span>
          ) : (
            <>
              <span className="package-price-amount" style={{
                fontFamily:'Cormorant Garamond, serif',
                fontSize:'38px',
                fontWeight:300,
                color:theme.price,
                lineHeight:1,
                whiteSpace:'nowrap',
                letterSpacing:0,
                flexShrink:1,
              }}>{currentPrice.amount}</span>
              {currentPrice.unit && (
                <span className="package-price-unit" style={{
                  fontSize:'12px',
                  color:'rgba(15,30,53,0.45)',
                  fontFamily:'Jost',
                  whiteSpace:'nowrap',
                  flexShrink:0,
                }}>{currentPrice.unit}</span>
              )}
              {currentPrice.original && (
                <span className="package-price-original" style={{
                  fontSize:'13px',
                  color:'rgba(15,30,53,0.38)',
                  fontFamily:'Jost',
                  textDecoration:'line-through',
                  whiteSpace:'nowrap',
                  flexShrink:0,
                }}>{currentPrice.original}</span>
              )}
            </>
          )}
        </div>
        {packageFit && (
          <div className="package-fit-note" style={{
            fontSize:'12px',
            letterSpacing:0,
            lineHeight:1.35,
            color:selected ? 'rgba(15,30,53,0.48)' : 'rgba(15,30,53,0.36)',
            fontFamily:'Jost',
            fontWeight:400,
            overflowWrap:'anywhere',
          }}>{packageFit}</div>
        )}
      </div>

      <div className="package-details-list" style={{ display:'flex', flexDirection:'column', gap:'8px', minWidth:0, minHeight:0, paddingTop:'14px', boxSizing:'border-box' }}>
        {packageDetails.map((feature, featureIndex) => (
          <div key={featureIndex} style={{ display:'flex', alignItems:'flex-start', gap:'10px', minWidth:0 }}>
            <div style={{
              width:'13px',
              height:'13px',
              flexShrink:0,
              marginTop:'3px',
              border:`1px solid ${theme.marker}`,
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              transition:'border-color 0.3s',
            }}>
              <div style={{ width:'5px', height:'5px', background:theme.marker, transition:'background 0.3s' }} />
            </div>
            <span style={{
              fontSize:'13px',
              fontFamily:'Jost',
              fontWeight:300,
              lineHeight:1.45,
              color:selected ? 'rgba(15,30,53,0.72)' : 'rgba(15,30,53,0.45)',
              minWidth:0,
              overflowWrap:'anywhere',
              transition:'color 0.3s',
            }}>{feature}</span>
          </div>
        ))}
      </div>

      <a
        href={pkg.ctaHref || BOOKING_TARGET}
        className="package-cta"
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        style={{
          display:'block',
          textAlign:'center',
          marginTop:0,
          padding:'13px 18px',
          fontSize:'11px',
          letterSpacing:'0.13em',
          fontFamily:'Jost',
          fontWeight:500,
          textDecoration:'none',
          background:selected ? navy : 'transparent',
          color:selected ? '#fff' : 'rgba(15,30,53,0.42)',
          border:`1px solid ${selected ? navy : theme.ctaBorder}`,
          transition:'transform 0.25s ease, border-color 0.25s ease, color 0.25s ease, background 0.25s ease',
          overflowWrap:'anywhere',
        }}
      >{pkg.cta.toUpperCase()}</a>
    </article>
  );
}

/* ── PACKAGES ── */
function Packages({ c, gold, navy }) {
  const packages = c.packages.items || [];
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <section id="packages" className="packages-section" style={getSectionFrameStyle({
      background:'#fff',
      padding:SECTION_FRAME.padding.standard.desktop,
      display:'flex',
      alignItems:'center',
      boxShadow:'inset 0 -1px 0 rgba(226,181,111,0.12), inset 0 1px 0 rgba(226,181,111,0.08)' })}
      onClick={() => setActiveIdx(null)}>
      <style>{`
        ${getSectionFrameCss('#packages.packages-section')}

        #packages .packages-shell {
          width:100%;
          max-width:1400px;
          margin:0 auto;
        }

        #packages .packages-grid {
          grid-template-columns:repeat(4,minmax(0,1fr)) !important;
        }

        #packages .package-card {
          overflow:hidden;
          --package-title-row:52px;
          --package-price-row:88px;
          --package-details-row:226px;
        }

        #packages .package-card::before {
          content:'';
          position:absolute;
          inset:-36%;
          z-index:0;
          pointer-events:none;
          background:var(--tier-sheen);
          opacity:var(--tier-sheen-opacity);
          transform:translateX(-34%) rotate(8deg);
          transition:transform 0.78s ease, opacity 0.28s ease;
        }

        #packages .package-card:hover::before {
          transform:translateX(18%) rotate(8deg);
        }

        #packages .package-card > * {
          position:relative;
          z-index:1;
        }

        #packages .package-corner-tag::after {
          content:'';
          position:absolute;
          inset:-1px;
          background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.68) 42%, transparent 72%);
          transform:translateX(-130%);
          animation:package-tag-sheen 3.8s ease-in-out infinite;
        }

        @keyframes package-tag-sheen {
          0%, 42% { transform:translateX(-130%); }
          68%, 100% { transform:translateX(130%); }
        }

        @media (min-width:768px) {
          #packages .packages-heading {
            white-space:nowrap !important;
          }
        }

        #packages .package-card:hover {
          transform:translateY(-4px);
        }

        #packages .package-card:not(.is-active) .package-cta:hover {
          transform:translateY(-1px);
          border-color:var(--package-accent) !important;
          color:var(--package-accent) !important;
          background:transparent !important;
        }

        #packages .package-card.is-active .package-cta:hover {
          transform:translateY(-1px);
          background:${navy} !important;
          border-color:${navy} !important;
          color:#fff !important;
        }

        #packages .package-fit-note,
        #packages .package-price-note,
        #packages .package-card-head,
        #packages .package-details-list,
        #packages .package-price-contact,
        #packages .package-price-value,
        #packages .package-price-original,
        #packages .package-price-unit {
          min-width:0;
        }

        @media (max-width:1180px) {
          #packages .packages-grid {
            grid-template-columns:repeat(2,minmax(0,1fr)) !important;
            gap:10px !important;
          }
        }

        @media (max-width:767px) {
          #packages .packages-grid {
            gap:12px !important;
          }

          #packages .package-card {
            --package-title-row:48px;
            --package-price-row:92px;
            --package-details-row:238px;
            min-height:540px !important;
            padding:44px 24px 34px !important;
          }

          #packages .package-corner-tag {
            top:18px !important;
            right:-44px !important;
            width:154px !important;
            height:30px !important;
          }

          #packages .package-corner-tag span {
            font-size:9px !important;
            letter-spacing:0.14em !important;
          }

          #packages .package-price-amount {
            font-size:34px !important;
          }

          #packages .package-price-original {
            font-size:12px !important;
          }

          #packages .package-price-contact {
            font-size:28px !important;
          }

          #packages .package-fit-note {
            font-size:11px !important;
            line-height:1.35 !important;
          }

          #packages .package-price-note {
            font-size:11px !important;
            line-height:1.55 !important;
            margin-top:18px !important;
          }
        }

        @media (max-width:360px) {
          #packages .package-card {
            --package-title-row:46px;
            --package-price-row:88px;
            --package-details-row:232px;
            min-height:520px !important;
            padding-left:20px !important;
            padding-right:20px !important;
          }

          #packages .package-price-amount {
            font-size:31px !important;
          }

          #packages .package-price-contact {
            font-size:26px !important;
          }
        }
      `}</style>
      <div className="packages-shell">
        <div className="reveal" style={{ textAlign:'center', marginBottom:'34px' }}>
          <SectionEyebrow label={c.packages.label} gold={gold} centered style={{ marginBottom:'16px' }} />
          <h2 className="packages-heading" style={{
            fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(36px, 4.5vw, 56px)',
            fontWeight:300, color:navy, lineHeight:1.08, whiteSpace:'normal', marginBottom:0,
          }}>{c.packages.title}</h2>
        </div>

        <PricingCards items={packages} activeIdx={activeIdx} onSelect={setActiveIdx} gold={gold} navy={navy} />
        {c.packages.priceNote && (
          <p className="package-price-note" style={{
            margin:'22px auto 0',
            maxWidth:'920px',
            color:'rgba(15,30,53,0.42)',
            fontFamily:'Jost',
            fontSize:'12px',
            fontWeight:300,
            lineHeight:1.7,
            letterSpacing:0,
            textAlign:'center',
            overflowWrap:'anywhere',
          }}>{c.packages.priceNote}</p>
        )}
      </div>
    </section>
  );
}


  window.Packages = Packages;
})();
