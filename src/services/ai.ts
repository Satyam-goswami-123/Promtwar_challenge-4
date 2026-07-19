// ============================================================
// NexusAI Stadium — AI Service Layer
// ============================================================

// ---- AI Response Engine (Simulates Gemini) ----
export const AI_RESPONSES: Record<string, string[]> = {
  restroom: [
    "The nearest accessible restroom is **30 meters from your current location** at Gate A, Level 1 — Section 111 Corridor. Current wait time: **~3 minutes** ✅\n\nThere's also a quieter option at Gate C, Level 1 (4-minute walk, no queue currently).",
  ],
  food: [
    "Great choice! Based on your location (Section 14C), here are your top-rated options:\n\n🌮 **El Estadio Tacos** (Gate B, Level 1) — Wait: 8 min | ⭐ 4.8\n🍔 **Champions Grill** (Section 112 Concourse) — Wait: 12 min | ⭐ 4.6\n🥪 **Rapid Bites** (Mobile Cart 7, your aisle) — Wait: 2 min | ⭐ 4.3\n\n*Tip: You can pre-order via the app and skip the queue!*",
  ],
  parking: [
    "**Your post-match parking recommendation:**\n\n🚗 Lot P3 (where you parked): Currently 95% full — expect **25-min exit delay**.\n\n**AI Suggestion:** Stay in your seat for 15 minutes after the final whistle. Historical data shows exit times drop by 60% after the initial rush. You'll save ~20 minutes total.",
  ],
  transport: [
    "Here are your best options to leave AT&T Stadium:\n\n🚇 **Orange Line Metro** — 8-min wait, runs every 6 min. Most efficient.\n🚌 **FIFA Shuttle A** — 12-min wait to downtown hotels\n🚗 **Rideshare** — 6-min wait NOW (book immediately before surge hits 3.2x in 25 min)\n♿ **Accessibility Shuttle** — 5-min wait, direct hotel routes\n\nWould you like directions to any of these?",
  ],
  seat: [
    "Your seat is **Section 14C, Row 8, Seat 22**, Gate 3 — Upper West Stand.\n\nFrom Gate 3 entrance:\n1. Take elevator to Level 3 (wheelchair accessible) or stairs up 2 flights\n2. Turn right at Section 12\n3. Walk straight to Section 14C — you'll see the blue section markers\n\nEstimated walk time: **3 minutes** 🗺️",
  ],
  score: [
    "⚽ **Brazil 2 — 1 Argentina** | Quarter-Final\n⏱️ 67th minute — LIVE\n\n📊 **Match Stats:**\n- Possession: BRA 54% | ARG 46%\n- Shots on target: BRA 8 | ARG 6\n- Corners: BRA 7 | ARG 4\n\n🔥 Last goal: Vinicius Jr. (61') — curling long-range stunner!\nExpected goals: BRA 2.1 | ARG 1.4",
  ],
  help: [
    "Hi! I'm **NEXUS**, your FIFA World Cup 2026 AI assistant. I'm here to help you with:\n\n🏟️ **Stadium Navigation** — directions, accessible routes, maps\n🍔 **Food & Concessions** — menus, wait times, pre-ordering\n🚌 **Transport** — metro, shuttles, parking, rideshare\n⚽ **Match Info** — live scores, stats, highlights\n♿ **Accessibility** — wheelchair routes, assistance requests\n🆘 **Emergency Help** — medical, security, lost items\n\nWhat do you need? I speak your language (50+ supported) 🌍",
  ],
  lost: [
    "I'll help you immediately. For a **lost item**:\n\n📞 Report to the Lost & Found booth at Gate B Information Center (open 24hrs during match days)\n\nFor a **lost person** (child or separated companion):\n1. Stay where you are\n2. I'm flagging this to our **Volunteer Team** now\n3. You'll receive a callback within 2 minutes\n\n🆘 For urgent emergencies: Press the red Emergency button or call **+1-800-FIFA-HELP**",
  ],
  emergency: [
    "🚨 **EMERGENCY PROTOCOL ACTIVATED**\n\nI'm immediately alerting the nearest response team to your location (Section 14C).\n\n**EMS estimated arrival: 3 minutes**\n\nWhile you wait:\n- Clear space around the person\n- Keep them still and calm\n- AED unit is located at the Section 12 entrance pillar (60m away)\n\nA volunteer has been notified and is en route. Stay on this chat — I'll update you every 30 seconds.",
  ],
  default: [
    "I understand you need help. Let me look that up for you at AT&T Stadium...\n\nBased on my knowledge of your location and current stadium conditions, here's what I found:\n\nCould you be a bit more specific? For example:\n- 'Where is the nearest restroom?'\n- 'What's the food wait time?'\n- 'How do I get to my seat?'\n- 'Live score update'\n\nI'm here 24/7 during FIFA World Cup 2026! 🏆",
  ],
};

export function getAIResponse(message: string): Promise<string> {
  const lower = message.toLowerCase();
  let responses = AI_RESPONSES.default;

  if (lower.includes('restroom') || lower.includes('toilet') || lower.includes('bathroom') || lower.includes('wc')) {
    responses = AI_RESPONSES.restroom;
  } else if (lower.includes('food') || lower.includes('eat') || lower.includes('drink') || lower.includes('hungry') || lower.includes('concession') || lower.includes('snack')) {
    responses = AI_RESPONSES.food;
  } else if (lower.includes('park') || lower.includes('car') || lower.includes('lot')) {
    responses = AI_RESPONSES.parking;
  } else if (lower.includes('transport') || lower.includes('metro') || lower.includes('bus') || lower.includes('shuttle') || lower.includes('uber') || lower.includes('leave') || lower.includes('go home')) {
    responses = AI_RESPONSES.transport;
  } else if (lower.includes('seat') || lower.includes('section') || lower.includes('where am i') || lower.includes('my seat') || lower.includes('direction')) {
    responses = AI_RESPONSES.seat;
  } else if (lower.includes('score') || lower.includes('goal') || lower.includes('match') || lower.includes('game') || lower.includes('brazil') || lower.includes('argentina')) {
    responses = AI_RESPONSES.score;
  } else if (lower.includes('help') || lower.includes('what can') || lower.includes('assist')) {
    responses = AI_RESPONSES.help;
  } else if (lower.includes('lost') || lower.includes('missing') || lower.includes('found')) {
    responses = AI_RESPONSES.lost;
  } else if (lower.includes('emergency') || lower.includes('medical') || lower.includes('hurt') || lower.includes('help') || lower.includes('ambulance')) {
    responses = AI_RESPONSES.emergency;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(responses[Math.floor(Math.random() * responses.length)]);
    }, 800 + Math.random() * 700);
  });
}
