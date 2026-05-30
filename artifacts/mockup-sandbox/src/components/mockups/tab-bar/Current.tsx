import { Home, Tractor, Plus, Bot, User } from "lucide-react";

const ACTIVE_COLOR = "#10b981";
const INACTIVE_COLOR = "#9CA3AF";

function TabItem({ icon: Icon, active }: { icon: any; active?: boolean }) {
  return (
    <div style={{ width: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <Icon
        size={24}
        color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
        strokeWidth={active ? 2.5 : 2}
      />
      {active && (
        <div style={{
          position: "absolute",
          bottom: -6,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: ACTIVE_COLOR,
        }} />
      )}
    </div>
  );
}

export function Current() {
  return (
    <div style={{
      width: 430,
      height: 260,
      background: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 60%, #d1fae5 100%)",
      position: "relative",
      fontFamily: "system-ui, sans-serif",
      overflow: "hidden",
    }}>
      {/* Background content hints */}
      <div style={{ padding: "20px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(34,209,90,0.15)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 10, borderRadius: 5, background: "rgba(0,0,0,0.1)", width: "60%", marginBottom: 5 }} />
            <div style={{ height: 8, borderRadius: 4, background: "rgba(0,0,0,0.06)", width: "40%" }} />
          </div>
        </div>
        <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />

        {/* Problem annotations */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { color: "#ef4444", text: "No labels — icons unexplained" },
            { color: "#f59e0b", text: "Wrong brand green (#10b981 ≠ #22d15a)" },
            { color: "#f59e0b", text: "4px dot = invisible active state" },
            { color: "#ef4444", text: "Bot icon wrong metaphor for AI chat" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "#64748b", fontFamily: "system-ui" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Tab Bar */}
      <div style={{
        position: "absolute",
        bottom: 18,
        left: 20,
        right: 20,
        height: 64,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #F3F4F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        paddingLeft: 8,
        paddingRight: 8,
      }}>
        <TabItem icon={Home} active />
        <TabItem icon={Tractor} />

        {/* Center FAB */}
        <div style={{
          position: "relative",
          top: -24,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: "linear-gradient(135deg, #34d399, #059669)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 12px rgba(16,185,129,0.4)",
          border: "4px solid #ffffff",
          flexShrink: 0,
        }}>
          <Plus color="#fff" size={28} strokeWidth={3} />
        </div>

        <TabItem icon={Bot} />
        <TabItem icon={User} />
      </div>

      {/* Label: BEFORE */}
      <div style={{
        position: "absolute",
        top: 10,
        right: 14,
        background: "#ef4444",
        color: "#fff",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 0.8,
        padding: "2px 7px",
        borderRadius: 6,
        fontFamily: "system-ui",
      }}>BEFORE</div>
    </div>
  );
}
