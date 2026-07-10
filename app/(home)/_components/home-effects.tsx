"use client";

import { useEffect } from "react";

export function HomeEffects() {
  useEffect(() => {
    document.body.classList.add("loaded");
    const revealEls = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      revealEls.forEach((el) => io.observe(el));
    }

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) {
      return;
    }

    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let cursorFrame = 0;
    let cleanupFns: Array<() => void> = [];

    document.body.classList.add("cursor-on");

    const onMouseMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
    };
    const onMouseDown = () => document.body.classList.add("cursor-down");
    const onMouseUp = () => document.body.classList.remove("cursor-down");
    const onMouseOver = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest("a, button, .gallery-scroller, .tag, .ticket, .audience-block")) {
        document.body.classList.add("cursor-hover");
      }
    };
    const onMouseOut = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest("a, button, .gallery-scroller, .tag, .ticket, .audience-block")) {
        document.body.classList.remove("cursor-hover");
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    function cursorLoop() {
      if (dot && ring) {
        dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx - ring.offsetWidth / 2}px, ${ry - ring.offsetHeight / 2}px)`;
      }
      cursorFrame = window.requestAnimationFrame(cursorLoop);
    }
    cursorLoop();

    const onClick = (event: MouseEvent) => {
      if (reduced) {
        return;
      }
      const colors = ["#1b3a6b", "#e8a317", "#f5f1e8", "#1a1a1a"];
      for (let i = 0; i < 7; i += 1) {
        const el = document.createElement("div");
        el.className = "confetti";
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.left = `${event.clientX}px`;
        el.style.top = `${event.clientY}px`;
        const size = 5 + Math.random() * 6;
        el.style.width = `${size}px`;
        el.style.height = `${size * (0.7 + Math.random() * 0.6)}px`;
        document.body.appendChild(el);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 2.2 + Math.random() * 3.2;
        const vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity - 2.4;
        let rotation = Math.random() * 360;
        const rv = (Math.random() - 0.5) * 22;
        let x = 0;
        let y = 0;
        let life = 0;

        function fall() {
          life += 1;
          vy += 0.16;
          x += vx;
          y += vy;
          rotation += rv;
          el.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
          el.style.opacity = String(Math.max(0, 1 - life / 55));
          if (life < 55) {
            window.requestAnimationFrame(fall);
          } else {
            el.remove();
          }
        }
        window.requestAnimationFrame(fall);
      }
    };
    document.addEventListener("click", onClick);

    if (!reduced) {
      document.querySelectorAll<HTMLElement>(".frame.tilt").forEach((frame) => {
        const item = frame.parentElement;
        if (!item) {
          return;
        }
        const move = (event: MouseEvent) => {
          const rect = frame.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          frame.style.transform = `perspective(600px) rotateX(${-py * 7}deg) rotateY(${px * 9}deg) translateY(-4px)`;
          frame.style.boxShadow = `${6 - px * 8}px ${8 - py * 6}px 0 0 var(--ink)`;
        };
        const leave = () => {
          frame.style.transform = "";
          frame.style.boxShadow = "";
        };
        item.addEventListener("mousemove", move);
        item.addEventListener("mouseleave", leave);
        cleanupFns.push(() => {
          item.removeEventListener("mousemove", move);
          item.removeEventListener("mouseleave", leave);
        });
      });

      document.querySelectorAll<HTMLElement>(".magnetic").forEach((button) => {
        const move = (event: MouseEvent) => {
          const rect = button.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = event.clientX - cx;
          const dy = event.clientY - cy;
          const distance = Math.hypot(dx, dy);
          if (distance < 90 + Math.max(rect.width, rect.height) / 2) {
            button.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
          } else {
            button.style.transform = "";
          }
        };
        document.addEventListener("mousemove", move);
        cleanupFns.push(() => document.removeEventListener("mousemove", move));
      });

      const sun = document.querySelector<HTMLElement>(".px-sun");
      const bridge = document.querySelector<HTMLElement>(".px-bridge");
      const hero = document.querySelector<HTMLElement>(".hero");
      if (sun && bridge && hero) {
        const move = (event: MouseEvent) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          sun.style.transform = `translate(${nx * -14}px, ${ny * -10}px)`;
          bridge.style.transform = `translate(${nx * 7}px, ${ny * 5}px)`;
        };
        const leave = () => {
          sun.style.transform = "";
          bridge.style.transform = "";
        };
        hero.addEventListener("mousemove", move);
        hero.addEventListener("mouseleave", leave);
        cleanupFns.push(() => {
          hero.removeEventListener("mousemove", move);
          hero.removeEventListener("mouseleave", leave);
        });
      }
    }

    const scroller = document.getElementById("galleryScroller");
    if (scroller) {
      let down = false;
      let startX = 0;
      let startLeft = 0;
      let moved = false;

      const mouseDown = (event: MouseEvent) => {
        down = true;
        moved = false;
        startX = event.pageX;
        startLeft = scroller.scrollLeft;
        scroller.classList.add("dragging");
      };
      const mouseMove = (event: MouseEvent) => {
        if (!down) {
          return;
        }
        const dx = event.pageX - startX;
        if (Math.abs(dx) > 3) {
          moved = true;
        }
        scroller.scrollLeft = startLeft - dx;
      };
      const mouseUp = () => {
        down = false;
        scroller.classList.remove("dragging");
      };
      const click = (event: MouseEvent) => {
        if (moved) {
          event.preventDefault();
        }
      };

      scroller.addEventListener("mousedown", mouseDown);
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
      scroller.addEventListener("click", click, true);
      cleanupFns.push(() => {
        scroller.removeEventListener("mousedown", mouseDown);
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
        scroller.removeEventListener("click", click, true);
      });
    }

    return () => {
      document.body.classList.remove("cursor-on", "cursor-down", "cursor-hover");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("click", onClick);
      window.cancelAnimationFrame(cursorFrame);
      cleanupFns.forEach((cleanup) => cleanup());
      cleanupFns = [];
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}
