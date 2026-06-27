import {
  Home, Sparkles, TrendingUp, Camera, BarChart3,
  Bell, Leaf, Droplets, Sun, ArrowUpRight, ArrowDownRight,
  Send, Mic, BrainCircuit, Globe, Activity, Thermometer,
  CheckCircle2, Check, Clock, ChevronRight, MessageSquare,
  Zap, CloudRain, Wind, ShoppingBag, Star, Filter, Search,
  AlertCircle, ScanLine
} from "lucide-react";

const P = "#22d15a";
const DARK = "#061a0d";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.1)";
const MUTE = "rgba(255,255,255,0.45)";

/* ─── Shared phone shell ──────────────────────────── */
function Phone({ label, accent = P, children }: { label: string; accent?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{
        width: 248, height: 526,
        borderRadius: 36,
        background: "linear-gradient(160deg,#0f2d17,#071910)",
        border: "1.5px solid rgba(34,209,90,0.18)",
        boxShadow: `0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}>
        {/* Notch */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:72, height:24, background:"#071910", borderRadius:"0 0 16px 16px", zIndex:10 }} />
        {/* Status bar */}
        <div style={{ height:36, display:"flex", alignItems:"flex-end", justifyContent:"space-between", paddingInline:14, paddingBottom:4, position:"relative", zIndex:9 }}>
          <span style={{ fontSize:9, color:"rgba(255,255,255,0.5)", fontFamily:"system-ui" }}>9:41</span>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            {[3,3,3,2].map((h,i)=><div key={i} style={{width:3,height:h+i*2,borderRadius:1,background:`rgba(255,255,255,${0.3+i*0.2})`}}/>)}
            <div style={{width:14,height:7,border:"1px solid rgba(255,255,255,0.4)",borderRadius:2,position:"relative"}}>
              <div style={{position:"absolute",left:1,top:1,bottom:1,right:3,background:"rgba(255,255,255,0.6)",borderRadius:1}}/>
            </div>
          </div>
        </div>
        {/* Screen content */}
        <div style={{ flex:1, height:"calc(100% - 36px)", overflow:"hidden" }}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", width:80, height:4, borderRadius:2, background:"rgba(255,255,255,0.25)" }} />
      </div>
      <span style={{ fontFamily:"'Inter', system-ui", fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.5)", letterSpacing:1, textTransform:"uppercase" }}>{label}</span>
    </div>
  );
}

/* ─── 1. Home Screen ──────────────────────────────── */
function HomeScreen() {
  const vitals = [
    { icon: Droplets, val: "65%", label: "Unyevu", color: "#60a5fa" },
    { icon: Thermometer, val: "24°", label: "Joto", color: "#fb923c" },
    { icon: Sun, val: "UV 4", label: "Mwanga", color: "#facc15" },
    { icon: Wind, val: "12km", label: "Upepo", color: "#a78bfa" },
  ];
  const steps = [
    { date:"Feb 10", title:"Mbolea Vuli", done:true },
    { date:"Feb 17", title:"Kupanda Mbegu", done:true },
    { date:"Feb 24", title:"Mbolea KCl", done:false },
    { date:"Mar 03", title:"Dawa SP-36", done:false },
  ];
  return (
    <div style={{ height:"100%", overflowY:"hidden", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"10px 14px 8px", background:"linear-gradient(180deg,rgba(34,209,90,0.12),transparent)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, color: MUTE, fontFamily:"system-ui" }}>Habari, Amara 👋</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#fff", fontFamily:"'Playfair Display', serif", lineHeight:1.2 }}>Shamba la Pemba</div>
          </div>
          <div style={{ width:30, height:30, borderRadius:15, background:`${P}25`, border:`1.5px solid ${P}40`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Bell size={13} color={P} />
          </div>
        </div>
      </div>

      {/* AI Insight card */}
      <div style={{ margin:"0 10px 8px", padding:"8px 10px", borderRadius:12, background:`linear-gradient(135deg,${P}18,${P}08)`, border:`1px solid ${P}30` }}>
        <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
          <Sparkles size={12} color={P} style={{ marginTop:1 }} />
          <div>
            <div style={{ fontSize:9, color:P, fontFamily:"system-ui", fontWeight:700, marginBottom:2 }}>Mapendekezo ya AI</div>
            <div style={{ fontSize:9.5, color:"rgba(255,255,255,0.8)", fontFamily:"system-ui", lineHeight:1.4 }}>Wadudu waliotambuliwa kwenye mahindi. Piga dawa wiki hii ili kupunguza hasara.</div>
          </div>
        </div>
      </div>

      {/* Vitals row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:4, padding:"0 10px", marginBottom:8 }}>
        {vitals.map(({ icon: Icon, val, label, color }) => (
          <div key={label} style={{ padding:"6px 4px", borderRadius:10, background:CARD, border:`1px solid ${BORDER}`, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <Icon size={11} color={color} />
            <div style={{ fontSize:10, fontWeight:700, color:"#fff", fontFamily:"system-ui" }}>{val}</div>
            <div style={{ fontSize:8, color:MUTE, fontFamily:"system-ui" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Track records stepper */}
      <div style={{ margin:"0 10px", padding:"8px 10px", borderRadius:12, background:CARD, border:`1px solid ${BORDER}` }}>
        <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.7)", fontFamily:"system-ui", marginBottom:8 }}>Marekodi ya Ufuatiliaji</div>
        <div style={{ display:"flex", alignItems:"center", gap:0, position:"relative" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
              {i < steps.length - 1 && (
                <div style={{ position:"absolute", top:9, left:"50%", right:"-50%", height:2, background: s.done ? P : "rgba(255,255,255,0.12)", zIndex:0 }} />
              )}
              <div style={{ width:18, height:18, borderRadius:9, background: s.done ? P : "rgba(255,255,255,0.1)", border:`2px solid ${s.done ? P : "rgba(255,255,255,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
                {s.done && <Check size={9} color="#fff" strokeWidth={3} />}
              </div>
              <div style={{ fontSize:7, color: s.done ? "rgba(255,255,255,0.7)" : MUTE, fontFamily:"system-ui", marginTop:3, textAlign:"center", lineHeight:1.2 }}>{s.date}</div>
              <div style={{ fontSize:7, color: s.done ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.3)", fontFamily:"system-ui", textAlign:"center", lineHeight:1.2 }}>{s.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, padding:"8px 10px 0" }}>
        {[{ icon:Camera, label:"Changanua",color:"#fb923c"},{icon:Globe,label:"Soko",color:"#60a5fa"},{icon:Activity,label:"Uchambuzi",color:"#a78bfa"},{icon:BrainCircuit,label:"Sankofa AI",color:P}].map(({icon:Icon,label,color})=>(
          <div key={label} style={{ padding:"7px 10px", borderRadius:10, background:CARD, border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:6 }}>
            <Icon size={12} color={color} />
            <span style={{ fontSize:9, color:"rgba(255,255,255,0.75)", fontFamily:"system-ui" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 2. Sankofa AI Screen ─────────────────────────── */
function AIScreen() {
  const prompts = ["Wadudu mahindi","Bei za soko","Mvua inakuja?","Mbolea gani?"];
  const messages = [
    { role:"user", text:"Angalia afya ya mahindi yangu" },
    { role:"ai", text:"Nimechunguza data ya shamba lako. Kuna dalili za wadudu (FAW) kwenye 23% ya eneo. Ninapendekeza dawa ya emamectin benzoate wiki hii." },
  ];
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"10px 14px 10px", background:`linear-gradient(160deg,${P}20,transparent)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:14, background:`linear-gradient(135deg,${P},#16a34a)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Sparkles size={13} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:"'Playfair Display', serif" }}>Sankofa AI</div>
            <div style={{ fontSize:8, color:P, fontFamily:"system-ui" }}>● Mtandaoni</div>
          </div>
        </div>
      </div>

      {/* Suggested prompts */}
      <div style={{ padding:"0 10px 8px", display:"flex", gap:4, flexWrap:"wrap" }}>
        {prompts.map(p => (
          <div key={p} style={{ padding:"3px 8px", borderRadius:20, background:`${P}18`, border:`1px solid ${P}35`, fontSize:8, color:"rgba(255,255,255,0.75)", fontFamily:"system-ui", whiteSpace:"nowrap" }}>{p}</div>
        ))}
      </div>

      {/* Chat */}
      <div style={{ flex:1, padding:"0 10px", display:"flex", flexDirection:"column", gap:8, overflow:"hidden" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth:"80%", padding:"7px 10px", borderRadius: m.role==="user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              background: m.role==="user" ? `linear-gradient(135deg,${P},#16a34a)` : "rgba(255,255,255,0.08)",
              border: m.role==="ai" ? `1px solid ${BORDER}` : "none",
              fontSize:9, color:"rgba(255,255,255,0.9)", fontFamily:"system-ui", lineHeight:1.5,
            }}>{m.text}</div>
          </div>
        ))}
        {/* Typing indicator */}
        <div style={{ display:"flex", gap:3, alignItems:"center", padding:"6px 10px", borderRadius:12, background:"rgba(255,255,255,0.06)", border:`1px solid ${BORDER}`, width:"fit-content" }}>
          {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:3,background:P,opacity:0.4+i*0.3}}/>)}
        </div>
      </div>

      {/* Input bar */}
      <div style={{ padding:"8px 10px 16px", display:"flex", gap:6, alignItems:"center" }}>
        <div style={{ flex:1, height:34, borderRadius:17, background:"rgba(255,255,255,0.07)", border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", paddingInline:12 }}>
          <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)", fontFamily:"system-ui" }}>Andika ujumbe...</span>
        </div>
        <div style={{ width:34, height:34, borderRadius:17, background:`linear-gradient(135deg,${P},#16a34a)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Mic size={14} color="#fff" />
        </div>
        <div style={{ width:34, height:34, borderRadius:17, background:`${P}30`, border:`1px solid ${P}50`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Send size={12} color={P} />
        </div>
      </div>
    </div>
  );
}

/* ─── 3. Market Screen ────────────────────────────── */
function MarketScreen() {
  const items = [
    { emoji:"🌽", name:"Mahindi (Meupe)", price:"TZS 85,000", unit:"100kg", trend:"+2.4%", up:true },
    { emoji:"🌾", name:"Mchele (Daraja A)", price:"TZS 120,000", unit:"100kg", trend:"-1.2%", up:false },
    { emoji:"🫘", name:"Maharage (Soya)", price:"TZS 210,000", unit:"100kg", trend:"+0.8%", up:true },
    { emoji:"🧅", name:"Vitunguu", price:"TZS 45,000", unit:"20kg", trend:"+5.1%", up:true },
    { emoji:"🍅", name:"Nyanya", price:"TZS 38,000", unit:"15kg", trend:"+1.8%", up:true },
    { emoji:"☕", name:"Kahawa (AA)", price:"TZS 680,000", unit:"100kg", trend:"+3.2%", up:true },
  ];
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"10px 14px 8px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#fff", fontFamily:"'Playfair Display', serif" }}>Soko la Mazao</div>
          <div style={{ display:"flex", gap:6 }}>
            <Search size={14} color={MUTE} />
            <Filter size={14} color={MUTE} />
          </div>
        </div>
        <div style={{ fontSize:8, color:MUTE, fontFamily:"system-ui", marginTop:2 }}>Tandale · Dar es Salaam · Leo</div>
      </div>

      {/* Trending strip */}
      <div style={{ margin:"0 10px 8px", padding:"6px 10px", borderRadius:10, background:`linear-gradient(135deg,${P}15,${P}05)`, border:`1px solid ${P}25`, display:"flex", gap:6, alignItems:"center" }}>
        <TrendingUp size={11} color={P} />
        <span style={{ fontSize:8.5, color:P, fontFamily:"system-ui", fontWeight:600 }}>Kahawa +3.2% · Vitunguu +5.1% inayongoza leo</span>
      </div>

      {/* Price list */}
      <div style={{ flex:1, overflowY:"hidden", padding:"0 10px", display:"flex", flexDirection:"column", gap:5 }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding:"6px 10px", borderRadius:10, background:CARD, border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:14 }}>{item.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,0.85)", fontFamily:"system-ui", lineHeight:1.2 }}>{item.name}</div>
              <div style={{ fontSize:8, color:MUTE, fontFamily:"system-ui" }}>{item.unit}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#fff", fontFamily:"system-ui" }}>{item.price}</div>
              <div style={{ fontSize:8, color: item.up ? P : "#f87171", fontFamily:"system-ui", display:"flex", alignItems:"center", justifyContent:"flex-end", gap:2 }}>
                {item.up ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}{item.trend}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 4. Scan / Diagnosis Screen ─────────────────── */
function ScanScreen() {
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", position:"relative" }}>
      {/* Camera view */}
      <div style={{ flex:1, position:"relative", overflow:"hidden", background:"#0a1f0d" }}>
        {/* Fake crop image */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#1a3a1f 0%, #0f2a13 100%)" }} />
        {/* Grid lines */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(34,209,90,0.15)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Scan frame corners */}
        {[{t:20,l:20},{t:20,r:20},{b:20,l:20},{b:20,r:20}].map((pos,i)=>(
          <div key={i} style={{
            position:"absolute",
            ...pos,
            width:24, height:24,
            borderColor:P, borderStyle:"solid", borderWidth:0,
            ...(i===0 ? {borderTopWidth:2,borderLeftWidth:2,borderTopLeftRadius:6} : {}),
            ...(i===1 ? {borderTopWidth:2,borderRightWidth:2,borderTopRightRadius:6} : {}),
            ...(i===2 ? {borderBottomWidth:2,borderLeftWidth:2,borderBottomLeftRadius:6} : {}),
            ...(i===3 ? {borderBottomWidth:2,borderRightWidth:2,borderBottomRightRadius:6} : {}),
          }}/>
        ))}

        {/* Scan line */}
        <div style={{ position:"absolute", left:20, right:20, top:"45%", height:2, background:`linear-gradient(90deg,transparent,${P},transparent)`, boxShadow:`0 0 8px ${P}60` }} />

        {/* Leaf clusters (fake foliage) */}
        {[[30,40],[70,55],[50,70],[20,65],[80,35]].map(([x,y],i)=>(
          <Leaf key={i} size={18+i*4} color={`rgba(34,${100+i*20},50,${0.3+i*0.1})`} style={{ position:"absolute", left:`${x}%`, top:`${y}%`, transform:`rotate(${i*45}deg)` }} />
        ))}

        {/* Header overlay */}
        <div style={{ position:"absolute", top:0, left:0, right:0, padding:"10px 14px 8px", background:"linear-gradient(180deg,rgba(6,26,13,0.9),transparent)" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:"'Playfair Display', serif" }}>Changanua Mazao</div>
          <div style={{ fontSize:8, color:P, fontFamily:"system-ui" }}>● Inatambua...</div>
        </div>
      </div>

      {/* Result card */}
      <div style={{ padding:"10px 10px 16px", background:"linear-gradient(0deg,#0a1f0d,transparent)" }}>
        <div style={{ padding:"10px", borderRadius:14, background:"rgba(10,20,13,0.95)", border:`1px solid ${P}40` }}>
          <div style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}>
            <div style={{ width:28, height:28, borderRadius:14, background:"#ff4d4d25", border:"1px solid #ff4d4d50", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <AlertCircle size={13} color="#ff4d4d" />
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"#ff4d4d", fontFamily:"system-ui" }}>Fall Armyworm (FAW)</div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.6)", fontFamily:"system-ui" }}>Ukali: Wastani · 23% ya eneo</div>
            </div>
            <div style={{ marginLeft:"auto", padding:"3px 8px", borderRadius:8, background:`${P}20`, border:`1px solid ${P}40`, fontSize:8, color:P, fontFamily:"system-ui", fontWeight:600 }}>Dharura</div>
          </div>
          <div style={{ fontSize:8.5, color:"rgba(255,255,255,0.7)", fontFamily:"system-ui", lineHeight:1.5 }}>Piga dawa ya emamectin benzoate ndani ya siku 3. Angalia wiki ijayo.</div>
        </div>
      </div>
    </div>
  );
}

/* ─── 5. Analytics Screen ────────────────────────── */
function AnalyticsScreen() {
  const bars = [0.4, 0.55, 0.65, 0.45, 0.75, 0.90, 0.82, 0.70, 0.88, 0.95, 0.60, 0.85];
  const labels = ["Jul","Aug","Sep","Oct","Nov","Dec"];
  const metrics = [
    { label:"Mavuno Yanayotarajiwa", val:"4.2 t/ha", delta:"+12%", up:true },
    { label:"Hatari ya Wadudu", val:"Wastani", delta:"23%", up:false },
    { label:"Utabiri wa Bei", val:"TZS 95K", delta:"+8%", up:true },
  ];
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"10px 14px 8px" }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#fff", fontFamily:"'Playfair Display', serif" }}>Uchambuzi</div>
        <div style={{ fontSize:8, color:MUTE, fontFamily:"system-ui" }}>Mwaka 2025–2026 · Mahindi</div>
      </div>

      {/* Metrics cards */}
      <div style={{ padding:"0 10px", display:"flex", flexDirection:"column", gap:5, marginBottom:8 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ padding:"7px 10px", borderRadius:11, background:CARD, border:`1px solid ${BORDER}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:8, color:MUTE, fontFamily:"system-ui" }}>{m.label}</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#fff", fontFamily:"system-ui" }}>{m.val}</div>
            </div>
            <div style={{ padding:"3px 7px", borderRadius:8, background: m.up ? `${P}20` : "#f87171" + "20", border:`1px solid ${m.up ? P+"40" : "#f87171" + "40"}`, fontSize:8, color: m.up ? P : "#f87171", fontFamily:"system-ui", fontWeight:700 }}>
              {m.up ? <ArrowUpRight size={9} style={{display:"inline"}}/> : <ArrowDownRight size={9} style={{display:"inline"}}/>} {m.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ margin:"0 10px", padding:"10px", borderRadius:12, background:CARD, border:`1px solid ${BORDER}` }}>
        <div style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,0.6)", fontFamily:"system-ui", marginBottom:8 }}>Kiwango cha Kukua (NDVI)</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:60 }}>
          {bars.map((v, i) => (
            <div key={i} style={{ flex:1, height:`${v * 100}%`, borderRadius:"3px 3px 0 0", background: i === bars.length - 1 ? `linear-gradient(0deg,#16a34a,${P})` : `rgba(34,209,90,${0.25 + v * 0.5})`, minWidth:4, position:"relative" }}>
              {i === bars.length - 1 && <div style={{ position:"absolute", top:-4, left:"50%", transform:"translateX(-50%)", width:6, height:6, borderRadius:3, background:P, boxShadow:`0 0 6px ${P}` }} />}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          {labels.map(l => <span key={l} style={{ fontSize:7, color:"rgba(255,255,255,0.3)", fontFamily:"system-ui" }}>{l}</span>)}
        </div>
      </div>

      {/* Pest risk gauge */}
      <div style={{ margin:"6px 10px 0", padding:"8px 10px", borderRadius:11, background:CARD, border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ position:"relative", width:40, height:40 }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5"/>
            <circle cx="20" cy="20" r="16" fill="none" stroke="#f59e0b" strokeWidth="5" strokeDasharray={`${0.55*100.5} 100.5`} strokeLinecap="round" transform="rotate(-90 20 20)"/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#f59e0b", fontFamily:"system-ui" }}>55%</div>
        </div>
        <div>
          <div style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,0.75)", fontFamily:"system-ui" }}>Hatari ya Wadudu</div>
          <div style={{ fontSize:8, color:MUTE, fontFamily:"system-ui" }}>Wastani · Angalia wiki hii</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Root Showcase ──────────────────────────────── */
export function Showcase() {
  const screens = [
    { label: "Nyumbani", component: <HomeScreen /> },
    { label: "Sankofa AI", component: <AIScreen /> },
    { label: "Soko", component: <MarketScreen /> },
    { label: "Changanua", component: <ScanScreen /> },
    { label: "Uchambuzi", component: <AnalyticsScreen /> },
  ];

  return (
    <div style={{
      width: 1920, height: 1080,
      background: `radial-gradient(ellipse 80% 80% at 50% 50%, #0d2e17 0%, ${DARK} 70%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "system-ui, sans-serif",
    }}>
      {/* Background glow orbs */}
      <div style={{ position:"absolute", top:"20%", left:"15%", width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle,${P}08,transparent 70%)`, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"15%", right:"12%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(96,165,250,0.05),transparent 70%)", pointerEvents:"none" }}/>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:8 }}>
          <div style={{ width:2, height:24, background:`linear-gradient(180deg,transparent,${P})` }} />
          <span style={{ fontSize:11, fontWeight:700, color:P, letterSpacing:3, textTransform:"uppercase", fontFamily:"system-ui" }}>KILIMO AI</span>
          <div style={{ width:2, height:24, background:`linear-gradient(180deg,${P},transparent)` }} />
        </div>
        <div style={{ fontSize:40, fontWeight:700, color:"#fff", fontFamily:"'Playfair Display', serif", lineHeight:1.1, marginBottom:8 }}>
          Kilimo cha Kisasa kwa Mkulima wa Tanzania
        </div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,0.45)", fontFamily:"system-ui", letterSpacing:0.3 }}>
          Akili Bandia · Masoko · Utambuzi wa Mazao · Uchambuzi wa Data
        </div>
      </div>

      {/* Phone row */}
      <div style={{ display:"flex", alignItems:"flex-end", gap:28 }}>
        {screens.map((s, i) => {
          const isCenter = i === 2;
          return (
            <div key={i} style={{ transform: isCenter ? "translateY(-16px) scale(1.04)" : `translateY(${Math.abs(i-2)*6}px)`, transition:"transform 0.3s" }}>
              <Phone label={s.label} key={s.label}>
                {s.component}
              </Phone>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:16 }}>
        {["AI-Powered","Swahili-First","Tanzania-Built"].map((t,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
            {i > 0 && <div style={{ width:3, height:3, borderRadius:2, background:"rgba(255,255,255,0.2)" }}/>}
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"system-ui", letterSpacing:0.5 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
