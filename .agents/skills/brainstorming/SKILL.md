---
name: brainstorming
description: "Use before any creative work on KILIMO AI — new features, UI redesigns, component additions, or architectural changes. Explores user intent and design before writing code."
---

# Brainstorming KILIMO AI Ideas Into Designs

Help turn ideas into fully formed designs and specs through natural collaborative dialogue, tailored for an agricultural intelligence app serving smallholder farmers.

## Hard Gate

Do NOT invoke any implementation skill, write any code, scaffold any component, or take any implementation action until you have presented a design and the user has approved it. This applies to EVERY task regardless of perceived simplicity.

## Checklist

1. **Explore project context** — check files, docs, recent commits, existing components
2. **Understand the farmer user** — consider literacy levels, device constraints, network conditions
3. **Ask clarifying questions** — one at a time, understand purpose/constraints/success criteria
4. **Propose 2-3 approaches** — with trade-offs and your recommendation
5. **Present design** — in sections scaled to complexity, get user approval after each section
6. **Write design doc** — save to `docs/designs/YYYY-MM-DD-<topic>-design.md`
7. **Spec self-review** — check for placeholders, contradictions, ambiguity
8. **User reviews written spec** — ask user to review before proceeding
9. **Transition to implementation** — invoke writing-plans skill

## Farmer-Centric Considerations

Always consider these constraints when designing for KILIMO AI:

- **Devices**: Primarily older Android phones, small screens (320-414px)
- **Network**: Intermittent 2G/3G; design for offline-first where possible
- **Literacy**: Varying digital literacy; prefer icons + text, simple language
- **Environment**: Outdoor use in bright sunlight; high contrast, large text
- **Language**: Must work seamlessly in both English and Swahili
- **Accessibility**: Screen readers, large touch targets, reduced motion support

## Design Sections

Cover these in your design presentation:

- **User flow**: How does the farmer navigate to this feature?
- **UI mockup**: Layout, components, animations (describe or sketch)
- **State management**: Where does data live? How is it persisted?
- **Error handling**: What happens when the network fails?
- **Offline behavior**: What works without connectivity?
- **i18n**: How do English/Swahili strings fit the UI?
- **Performance**: Will this work on a low-end device?
- **Testing**: How do we verify this works for farmers?

## After the Design

- Write the validated design to `docs/designs/YYYY-MM-DD-<topic>-design.md`
- Commit the design document
- Ask the user to review the spec before proceeding
- Only then invoke `writing-plans` to create the implementation plan

## Key Principles

- **One question at a time** — Don't overwhelm with multiple questions
- **Multiple choice preferred** — Easier for users than open-ended
- **YAGNI ruthlessly** — Farmers need simple, reliable tools
- **Explore alternatives** — Always propose 2-3 approaches
- **Incremental validation** — Present design, get approval before coding
- **Be flexible** — Go back and clarify when needed
