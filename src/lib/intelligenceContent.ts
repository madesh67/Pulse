// Content configuration for Section 02 - Intelligence / Smart Experience
export const intelligenceContent = {
  sectionId: "intelligence",
  sectionIndex: "02",
  sectionTag: "INTELLIGENCE",
  headline: "Intelligence, at a Glance.",
  introCopy:
    "Beyond pure materiality lies an interface of silent intelligence. Engineered to anticipate your rhythm with zero noise, intuitive haptics, and absolute clarity.",

  // 3 Core Verified Capabilities
  capabilities: [
    {
      id: "awareness",
      index: "01",
      category: "CONTEXTUAL AWARENESS",
      title: "Silent Intelligence & Glanceability",
      subtitle: "Essential Information Without Distraction",
      description:
        "The responsive interface renders vital complications and timekeeping with paper-like contrast. Ambient sensors adapt clarity in real time, serving essential insights the instant your wrist rises.",
      metrics: [
        { label: "VISIBILITY", value: "Ambient Real-Time" },
        { label: "INTERACTION", value: "Instant Glance" },
      ],
      image: "/assets/frames/frame-111.webp",
      imageAlt: "PULSE Nova Pro responsive display interface and contextual glanceability",
      layout: "split-right",
    },
    {
      id: "voice",
      index: "02",
      category: "VOICE & ACOUSTIC PRECISION",
      title: "Beamforming Voice & Sound Clarity",
      subtitle: "Direct Acoustic Ports & Isolated Commands",
      description:
        "Integrated studio-grade beamforming microphone technology isolates your voice from ambient noise for effortless commands. Paired with an ultra-linear speaker for high-fidelity audible feedback and rapid acoustic alerts.",
      metrics: [
        { label: "MICROPHONE", value: "Beamforming Array" },
        { label: "AUDIO", value: "Ultra-Linear Acoustic" },
      ],
      image: "/assets/frames/frame-205.webp",
      imageAlt: "PULSE Nova Pro beamforming microphone array and digital crown flank",
      layout: "split-left",
    },
    {
      id: "tactile",
      index: "03",
      category: "HAPTIC FEEDBACK & ACTION",
      title: "Stepped Haptics & Rapid Control",
      subtitle: "Tactile Navigation with Zero Look Delay",
      description:
        "Calibrated magnetic detents in the rotary crown deliver crisp mechanical haptics directly to your fingertip. Dedicated physical back and action buttons provide instantaneous menu return and workout control without touch latency.",
      metrics: [
        { label: "HAPTICS", value: "Stepped Magnetic" },
        { label: "ACTION", value: "Instant Quick-Return" },
      ],
      image: "/assets/frames/frame-282.webp",
      imageAlt: "PULSE Nova Pro tactile interfaces, speaker ports and ergonomic quick action",
      layout: "split-right",
    },
  ],

  // Editorial Closing
  closing: {
    label: "INTELLIGENCE PHILOSOPHY",
    quote: "Technology designed not to demand attention, but to reward it.",
  },
};
