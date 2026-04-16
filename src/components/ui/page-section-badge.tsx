"use client";

import { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Badge from "@/components/ui/badge";

type BadgeVariant = "light" | "dark";

type ActiveBadge = {
  id: string;
  text: string;
  variant: BadgeVariant;
};

const BADGE_SELECTOR = "[data-page-badge]";
const VIEWPORT_PROBE_RATIO = 0.45;

const readBadgeFromElement = (element: HTMLElement): ActiveBadge => ({
  id: element.id || element.dataset.pageBadge || "section-badge",
  text: element.dataset.pageBadge || "",
  variant: (element.dataset.badgeVariant as BadgeVariant) || "dark",
});

const getActiveElementByProbe = (elements: HTMLElement[]) => {
  const probeY = window.innerHeight * VIEWPORT_PROBE_RATIO;
  let active = elements[0];

  for (const element of elements) {
    if (element.getBoundingClientRect().top <= probeY) {
      active = element;
    }
  }

  return active;
};

export default function PageSectionBadge() {
  const [activeBadge, setActiveBadge] = useState<ActiveBadge | null>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sections = gsap.utils.toArray<HTMLElement>(BADGE_SELECTOR);
    if (!sections.length) return;

    const setBadgeFromElement = (element: HTMLElement) => {
      const next = readBadgeFromElement(element);
      setActiveBadge((current) =>
        current?.id === next.id && current.text === next.text ? current : next,
      );
    };

    const syncBadgeByScrollPosition = () => {
      const currentSection = getActiveElementByProbe(sections);
      setBadgeFromElement(currentSection);
    };

    syncBadgeByScrollPosition();

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 45%",
        onEnter: () => setBadgeFromElement(section),
        onEnterBack: () => setBadgeFromElement(section),
      }),
    );

    ScrollTrigger.addEventListener("refresh", syncBadgeByScrollPosition);

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      ScrollTrigger.removeEventListener("refresh", syncBadgeByScrollPosition);
    };
  }, []);

  if (!activeBadge) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[48] -translate-x-1/2">
      <Badge
        key={activeBadge.id}
        text={activeBadge.text}
        variant={activeBadge.variant}
        align="center"
      />
    </div>
  );
}
