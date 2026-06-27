import { Home, Tractor, Sparkles, User, LayoutGrid } from "lucide-react";

const PRIMARY = "#22d15a";
const SHADOW_GREEN = "#0a3d18";

type Tab = { icon: any; label: string; active?: boolean };

function TabItem({ icon: Icon, label, active }: Tab) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      padding: active ? "6px 14px" : "6px 10px",
      borderRadius: 14,
      background: active ? PRIMARY : "transparent",
      transition: "all 0.2s ease",
      minWidth: active ? 72 : 44,
    }}>
      <Icon
        size={active ? 22 : 22}
        color={active ? "#ffffff" : "#9CA3AF"}
        strokeWidth={active ? 2.5 : 2}
      />
      <span style={{
        fontSize: 9.5,
        fontWeight: active ? 700 : 500,
        color: active ? "#ffffff" : "#9CA3AF",
        fontFamily: "'Inter', system-ui, sans-serif",
        letterSpacing: 0.2,
        lineHeight: 1,
      }}>{label}</span>
    </div>
  );
}

export function Redesigned() {
  return (
    <div style={{
      width: 430,
      height: 260,
      background: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 60%, #d1fae5 100%)",
      position: "relative",
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: "hidden",
    }}>
      {/* Background content */}
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${PRIMARY}25` }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 10, borderRadius: 5, background: "rgba(0,0,0,0.1)", width: "55%", marginBottom: 5 }} />
            <div style={{ height: 8, borderRadius: 4, background: "rgba(0,0,0,0.06)", width: "38%" }} />
          </div>
        </div>
        <div style={{ height: 1, background: "rgba(0,0,0,0.05)", marginBottom: 10 }} />

        {/* Fix annotations */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            { color: PRIMARY, text: "Labels always visible — orientation at a glance" },
            { color: PRIMARY, text: "Brand green #22d15a — pixel-perfect" },
            { color: PRIMARY, text: "Full pill active state — clear focus indicator" },
            { color: PRIMARY, text: "Sparkles icon — AI chat intention clear" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="8" height="8" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="4" fill={item.color} />
              </svg>
              <span style={{ fontSize: 10, color: "#166534", fontFamily: "system-ui" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Redesigned Floating Tab Bar */}
      <div style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        height: 70,
        borderRadius: 22,
        backgroundColor: "#ffffff",
        boxShadow: `0 8px 32px rgba(10,61,24,0.12), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(34,209,90,0.08)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        paddingLeft: 6,
        paddingRight: 6,
      }}>

        <TabItem icon={Home} label="Nyumbani" active />
        <TabItem icon={Tractor} label="Mashamba" />

        {/* Center FAB — Features Hub */}
        <div style={{
          position: "relative",
          top: -22,
          width: 58,
          height: 58,
          borderRadius: 29,
          background: `linear-gradient(145deg, #34d399, ${PRIMARY}, #16a34a)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 8px 20px rgba(34,209,90,0.45), 0 2px 8px rgba(34,209,90,0.2)`,
          border: "3.5px solid #ffffff",
        }}>
          <LayoutGrid color="#ffffff" size={24} strokeWidth={2.2} />
        </div>

        <TabItem icon={Sparkles} label="Sankofa AI" />
        <TabItem icon={User} label="Profaili" />
      </div>

      {/* Label: AFTER */}
      <div style={{
        position: "absolute",
        top: 10,
        right: 14,
        background: PRIMARY,
        color: "#fff",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 0.8,
        padding: "2px 7px",
        borderRadius: 6,
        fontFamily: "system-ui",
        boxShadow: `0 2px 8px rgba(34,209,90,0.35)`,
      }}>AFTER ✦</div>
    </div>
  );
}
