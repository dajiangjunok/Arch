"use client";

import { useEffect } from "react";

type Day = {
  n: string;
  img: string;
  date: string;
  tag: string;
  hl: string;
  title: string;
  body: string;
  badges: readonly string[];
};

export function ReferenceEffects({
  page,
  days,
  chipDayMap,
}: {
  page: string;
  days: readonly Day[];
  chipDayMap: Readonly<Record<string, number>>;
}) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`.arch-reference.arch-${page}`);
    if (!root) return;

    const cleanup: Array<() => void> = [];
    const listen = <T extends EventTarget>(target: T, event: string, handler: EventListenerOrEventListenerObject) => {
      target.addEventListener(event, handler);
      cleanup.push(() => target.removeEventListener(event, handler));
    };

    const progress = root.querySelector<HTMLElement>("#scrollProgress");
    const updateProgress = () => {
      if (!progress) return;
      const documentRoot = document.documentElement;
      const max = documentRoot.scrollHeight - documentRoot.clientHeight;
      progress.style.width = `${max > 0 ? (documentRoot.scrollTop / max) * 100 : 0}%`;
    };
    listen(window, "scroll", updateProgress);
    updateProgress();

    const revealElements = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    revealElements.forEach((element) => observer.observe(element));
    const revealFallback = window.setTimeout(() => revealElements.forEach((element) => element.classList.add("in")), 1200);
    cleanup.push(() => {
      observer.disconnect();
      window.clearTimeout(revealFallback);
    });

    root.querySelectorAll<HTMLElement>(".flip-card, .gflip").forEach((card) => {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      const toggle = () => card.classList.toggle("flipped");
      const keydown = (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          toggle();
        }
      };
      listen(card, "click", toggle);
      listen(card, "keydown", keydown);
    });

    root.querySelectorAll<HTMLElement>(".pillar").forEach((pillar) => {
      listen(pillar, "click", () => pillar.classList.toggle("open"));
    });

    root.querySelectorAll<HTMLElement>("[data-dossier-placeholder]").forEach((link) => {
      listen(link, "click", (event) => {
        event.preventDefault();
        window.alert("占位链接 — 请替换为真实 Dossier PDF 地址");
      });
    });

    const hero = root.querySelector<HTMLElement>("#heroMain");
    const blob = root.querySelector<HTMLElement>("#heroBlob");
    if (hero && blob && window.matchMedia("(hover: hover)").matches) {
      const move = (event: Event) => {
        const pointer = event as MouseEvent;
        const bounds = hero.getBoundingClientRect();
        const x = (pointer.clientX - bounds.left) / bounds.width - 0.5;
        const y = (pointer.clientY - bounds.top) / bounds.height - 0.5;
        blob.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
      };
      listen(hero, "mousemove", move);
      listen(hero, "mouseleave", () => { blob.style.transform = "translate(0, 0)"; });
    }

    const track = root.querySelector<HTMLElement>("#ticketTrack");
    const showDay = (index: number, button: HTMLElement) => {
      const day = days[index];
      if (!day) return;
      const empty = root.querySelector<HTMLElement>("#detailEmpty");
      const content = root.querySelector<HTMLElement>("#detailContent");
      if (empty) empty.style.display = "none";
      if (content) {
        content.classList.remove("show");
        void content.offsetWidth;
        content.classList.add("show");
      }
      const setText = (selector: string, value: string) => {
        const element = root.querySelector<HTMLElement>(selector);
        if (element) element.textContent = value;
      };
      setText("#dDay", `DAY ${day.n}`);
      setText("#dDate", day.date);
      setText("#dTitle", day.title);
      setText("#dBody", day.body);
      setText("#dPhotoLabel", day.tag);
      const badges = root.querySelector<HTMLElement>("#dBadges");
      if (badges) {
        badges.replaceChildren(...day.badges.map((label, badgeIndex) => {
          const badge = document.createElement("span");
          badge.className = `badge${badgeIndex === 0 ? " alt" : ""}`;
          badge.textContent = label;
          return badge;
        }));
      }
      const photo = root.querySelector<HTMLImageElement>("#dPhoto");
      if (photo && day.img) {
        photo.src = day.img;
        photo.alt = day.title;
      }
      root.querySelectorAll(".ticket").forEach((ticket) => ticket.classList.remove("active"));
      button.classList.add("active");
      button.classList.remove("stamped");
      void button.offsetWidth;
      button.classList.add("stamped");
    };

    if (track && days.length) {
      days.forEach((day, index) => {
        const stack = document.createElement("div");
        stack.className = "ticket-stack";
        const button = document.createElement("button");
        button.className = "ticket";
        button.type = "button";
        button.setAttribute("role", "tab");
        button.dataset.idx = String(index);
        const tag = document.createElement("span");
        tag.className = "day-tag";
        tag.textContent = day.tag;
        const number = document.createElement("div");
        number.className = "day-num";
        number.textContent = day.n;
        const date = document.createElement("div");
        date.className = "day-date";
        date.textContent = day.date;
        const highlight = document.createElement("div");
        highlight.className = "day-hl";
        highlight.textContent = day.hl;
        button.append(tag, number, date, highlight);
        listen(button, "click", () => showDay(index, button));
        stack.appendChild(button);
        track.appendChild(stack);
      });
      cleanup.push(() => track.replaceChildren());
    }

    root.querySelectorAll<HTMLElement>("#chipRow .chip").forEach((chip) => {
      listen(chip, "click", () => {
        const index = chipDayMap[chip.dataset.chip || ""];
        chip.classList.remove("pulse");
        void chip.offsetWidth;
        chip.classList.add("pulse");
        if (index === undefined) return;
        const button = root.querySelector<HTMLElement>(`.ticket[data-idx="${index}"]`);
        if (button) {
          showDay(index, button);
          root.querySelector("#timeline")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    return () => cleanup.reverse().forEach((dispose) => dispose());
  }, [chipDayMap, days, page]);

  return <div className="scroll-progress" id="scrollProgress" aria-hidden="true" />;
}
