// Small drawings for the "What I do" cards. They are drawn in the theme colour (currentColor), so they change
// with the theme picker. Pick one per skill in content.js with  art: "web"  (the names are the keys below).

const S = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };
const soft = (o) => ({ fill: "currentColor", opacity: o });

const ART = {
  shop: (
    <>
      <rect x="88" y="14" width="64" height="112" rx="10" {...S} />
      <rect x="110" y="20" width="20" height="3" rx="1.5" {...soft(0.5)} />
      <rect x="95" y="30" width="23" height="24" rx="4" {...soft(0.35)} />
      <rect x="122" y="30" width="23" height="24" rx="4" {...soft(0.2)} />
      <rect x="95" y="58" width="15" height="3" rx="1.5" {...soft(0.6)} />
      <rect x="122" y="58" width="15" height="3" rx="1.5" {...soft(0.6)} />
      <rect x="95" y="66" width="23" height="24" rx="4" {...soft(0.2)} />
      <rect x="122" y="66" width="23" height="24" rx="4" {...soft(0.35)} />
      <rect x="95" y="94" width="15" height="3" rx="1.5" {...soft(0.6)} />
      <rect x="122" y="94" width="15" height="3" rx="1.5" {...soft(0.6)} />
      <rect x="95" y="104" width="50" height="13" rx="6.5" fill="currentColor" />
      <circle cx="170" cy="36" r="15" fill="currentColor" />
      <path d="M162 30h3l2.5 9h8.5l2-6.5h-12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="168.5" cy="42.5" r="1.6" fill="#fff" />
      <circle cx="174.5" cy="42.5" r="1.6" fill="#fff" />
      <circle cx="64" cy="92" r="16" {...S} />
      <text x="64" y="98" textAnchor="middle" fontSize="17" fontWeight="800" fill="currentColor">₵</text>
      <path d="M80 92h6" {...S} strokeDasharray="2 4" />
    </>
  ),
  web: (
    <>
      <rect x="30" y="18" width="180" height="104" rx="10" {...S} />
      <path d="M30 36h180" {...S} />
      <circle cx="42" cy="27" r="3" {...soft(0.6)} />
      <circle cx="52" cy="27" r="3" {...soft(0.4)} />
      <circle cx="62" cy="27" r="3" {...soft(0.25)} />
      <rect x="44" y="48" width="86" height="9" rx="4.5" fill="currentColor" />
      <rect x="44" y="63" width="70" height="5" rx="2.5" {...soft(0.35)} />
      <rect x="44" y="73" width="58" height="5" rx="2.5" {...soft(0.35)} />
      <rect x="44" y="86" width="36" height="12" rx="6" fill="currentColor" />
      <rect x="144" y="46" width="52" height="52" rx="8" {...soft(0.18)} />
      <path d="M156 86l10-12 8 8 6-6 8 10" {...S} strokeWidth="2.5" />
      <rect x="156" y="104" width="62" height="28" rx="8" fill="currentColor" />
      <text x="187" y="123" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="monospace">&lt;/&gt;</text>
    </>
  ),
  app: (
    <>
      <rect x="92" y="12" width="60" height="116" rx="11" {...S} />
      <rect x="114" y="18" width="16" height="3" rx="1.5" {...soft(0.5)} />
      {[30, 48, 66].map((y, r) =>
        [101, 116, 131].map((x, c) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="12" height="12" rx="3.5" {...soft([0.9, 0.35, 0.6, 0.25, 0.8, 0.45, 0.5, 0.7, 0.3][r * 3 + c])} />
        )),
      )}
      <rect x="100" y="106" width="44" height="12" rx="6" {...soft(0.25)} />
      <rect x="28" y="38" width="56" height="26" rx="8" {...soft(0.15)} />
      <circle cx="40" cy="51" r="5" fill="currentColor" />
      <rect x="50" y="46" width="26" height="4" rx="2" {...soft(0.55)} />
      <rect x="50" y="54" width="18" height="4" rx="2" {...soft(0.35)} />
      <rect x="160" y="74" width="54" height="26" rx="8" {...soft(0.15)} />
      <path d="M170 87l4 4 8-8" {...S} strokeWidth="2.5" />
      <rect x="188" y="83" width="18" height="4" rx="2" {...soft(0.5)} />
    </>
  ),
  bot: (
    <>
      <path d="M68 40V29" {...S} />
      <circle cx="68" cy="25" r="4.5" fill="currentColor" />
      <rect x="38" y="40" width="60" height="50" rx="14" {...S} />
      <circle cx="56" cy="62" r="5.5" fill="currentColor" />
      <circle cx="80" cy="62" r="5.5" fill="currentColor" />
      <path d="M58 78h20" {...S} />
      <path d="M38 60h-6M98 60h6" {...S} />
      <rect x="114" y="22" width="92" height="26" rx="13" fill="currentColor" />
      <rect x="126" y="33" width="50" height="4" rx="2" fill="#fff" opacity="0.85" />
      <rect x="130" y="58" width="76" height="24" rx="12" {...soft(0.22)} />
      <rect x="142" y="68" width="40" height="4" rx="2" {...soft(0.7)} />
      <rect x="114" y="92" width="72" height="24" rx="12" fill="currentColor" />
      <circle cx="132" cy="104" r="2.5" fill="#fff" />
      <circle cx="142" cy="104" r="2.5" fill="#fff" />
      <circle cx="152" cy="104" r="2.5" fill="#fff" />
      <path d="M52 112c0 10 12 14 22 10" {...S} strokeDasharray="3 5" />
    </>
  ),
  automation: (
    <>
      <rect x="44" y="14" width="74" height="112" rx="9" {...S} />
      {[38, 62, 86].map((y) => (
        <g key={y}>
          <path d={`M56 ${y}l5 5 9-10`} {...S} />
          <rect x="78" y={y - 2} width="30" height="5" rx="2.5" {...soft(0.4)} />
        </g>
      ))}
      <rect x="56" y="104" width="50" height="10" rx="5" fill="currentColor" />
      <path d="M124 54c14 0 16 10 24 14" {...S} strokeDasharray="3 5" />
      <circle cx="168" cy="80" r="24" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="7 5.57" />
      <circle cx="168" cy="80" r="18" {...soft(0.15)} />
      <circle cx="168" cy="80" r="7" {...S} />
    </>
  ),
  python: (
    <>
      <rect x="26" y="18" width="188" height="104" rx="10" {...soft(0.08)} />
      <rect x="26" y="18" width="188" height="104" rx="10" {...S} />
      <circle cx="40" cy="30" r="3" {...soft(0.6)} />
      <circle cx="50" cy="30" r="3" {...soft(0.4)} />
      <circle cx="60" cy="30" r="3" {...soft(0.25)} />
      <g fontFamily="ui-monospace, Consolas, monospace" fontSize="12" fill="currentColor">
        <text x="40" y="56">&gt;&gt;&gt; def total(x):</text>
        <text x="40" y="74" opacity="0.7">...     return sum(x)</text>
        <text x="40" y="92">&gt;&gt;&gt; total([80, 150])</text>
        <text x="40" y="110" fontWeight="800">230</text>
      </g>
      <rect x="66" y="101" width="8" height="12" {...soft(0.6)} />
    </>
  ),
  arduino: (
    <>
      <path d="M182 34c0-18 30-18 30 2v22" {...S} strokeWidth="2.5" />
      <rect x="40" y="34" width="160" height="80" rx="8" {...soft(0.14)} />
      <rect x="40" y="34" width="160" height="80" rx="8" {...S} />
      <path d="M64 42h108" stroke="currentColor" strokeWidth="6" strokeDasharray="4 4" />
      <path d="M78 106h84" stroke="currentColor" strokeWidth="6" strokeDasharray="4 4" />
      <rect x="28" y="56" width="22" height="24" rx="3" {...soft(0.6)} />
      <rect x="100" y="60" width="50" height="26" rx="3" fill="currentColor" />
      <path d="M104 57h42M104 89h42" stroke="currentColor" strokeWidth="3" strokeDasharray="3 4" />
      <circle cx="176" cy="72" r="13" {...soft(0.2)} />
      <circle cx="176" cy="72" r="6" fill="currentColor" />
      <circle cx="70" cy="90" r="5" {...S} strokeWidth="2.5" />
    </>
  ),
  matlab: (
    <>
      <path d="M38 22v90h170" {...S} opacity="0.6" />
      {[[54, 62], [78, 44], [102, 70], [126, 30], [150, 54], [174, 40]].map(([x, h]) => (
        <rect key={x} x={x} y={112 - h} width="14" height={h} rx="3" {...soft(0.22)} />
      ))}
      <path d="M38 76C58 36 78 36 98 70s40 34 60 0 32-34 48-30" {...S} />
      <circle cx="98" cy="70" r="4.5" fill="currentColor" />
      <circle cx="158" cy="70" r="4.5" fill="currentColor" />
      <circle cx="206" cy="40" r="4.5" fill="currentColor" />
      <rect x="150" y="14" width="58" height="20" rx="6" fill="currentColor" />
      <text x="179" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="ui-monospace, Consolas, monospace">plot()</text>
    </>
  ),
  repair: (
    <>
      <rect x="60" y="14" width="60" height="112" rx="11" {...S} />
      <rect x="82" y="20" width="16" height="3" rx="1.5" {...soft(0.5)} />
      <circle cx="90" cy="70" r="18" {...soft(0.18)} />
      <path d="M81 70l6 6 12-13" {...S} />
      <g transform="rotate(40 166 64)">
        <rect x="158" y="18" width="16" height="40" rx="6" fill="currentColor" />
        <rect x="164" y="58" width="4" height="46" rx="2" fill="currentColor" opacity="0.75" />
        <path d="M162 104h8l-4 8z" fill="currentColor" opacity="0.75" />
      </g>
      <circle cx="176" cy="106" r="14" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="4.5 4.3" />
      <circle cx="176" cy="106" r="4" fill="currentColor" />
    </>
  ),
};

export default function Art({ name }) {
  if (!ART[name]) return null;
  return (
    <svg className="skill-art" viewBox="0 0 240 140" role="img" aria-hidden="true">
      {ART[name]}
    </svg>
  );
}
