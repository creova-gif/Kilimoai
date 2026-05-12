# 🔒 KILIMO COLOR ENFORCEMENT

## STRICT RULE ACTIVE

### ✅ ALLOWED ONLY:
- `#2E7D32` (Raspberry Leaf Green)
- `gray-*` (all shades)
- `white`

### ❌ BLOCKED:
- `blue-`, `purple-`, `indigo-`, `emerald-`, `teal-`, `cyan-`, `pink-`
- `green-*` (use `#2E7D32` instead)
- `red-`, `orange-`, `yellow-*` (use `gray-*` instead)
- ALL gradients (`bg-gradient-`, `from-`, `to-`, `via-`)

### 🔧 COMMANDS:
```bash
# Check violations
npm run enforce:colors

# Build (auto-enforced)
npm run build
```

### 🚨 ENFORCEMENT:
- **Pre-commit hook**: Blocks commits with violations
- **CI/CD**: Blocks PRs with violations  
- **Build**: Blocks deployments with violations

### 📋 RESULT:
```
✅ CI rule active.
✅ No regressions possible.
```

---

**Status**: 🟢 ACTIVE  
**Regression Risk**: ❌ ZERO
