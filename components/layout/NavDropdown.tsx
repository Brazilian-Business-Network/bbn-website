"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type DropdownItem = {
  href: string;
  label: string;
  active: boolean;
};

type NavDropdownProps = {
  /** The label half of the trigger is a real link to this href. */
  href: string;
  label: string;
  /** True when the trigger or any of its children is the current page. */
  active: boolean;
  groupLabel: string;
  /** Already-interpolated aria-label for the chevron, e.g. "Abrir submenu Sobre". */
  submenuLabel: string;
  items: DropdownItem[];
};

/**
 * Split trigger for the "Sobre" group:
 *
 *  - the label is a real <Link>, so the section page is always reachable — on
 *    touch, with JS disabled, and for anyone who just wants to go there;
 *  - the chevron beside it is a real <button> that toggles the menu, which is
 *    what makes the three children reachable on a touch device, where there is
 *    no hover to open with.
 *
 * On top of that: hover opens (pointer), Arrow keys open and traverse
 * (keyboard), and Escape, a click outside, or focus leaving the group closes.
 */
export function NavDropdown({
  href,
  label,
  active,
  groupLabel,
  submenuLabel,
  items,
}: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLLIElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  // Small delay on pointer-out so a diagonal mouse path to the panel doesn't
  // snap the menu shut.
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  // A tap or click anywhere outside the group closes it. Needed because the
  // chevron can open the menu without hover ever being involved, so there is no
  // pointer-leave to rely on.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (target && !wrapperRef.current?.contains(target)) setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const focusItem = (index: number) => {
    const count = items.length;
    const next = ((index % count) + count) % count;
    itemRefs.current[next]?.focus();
  };

  const openAndFocus = (position: "first" | "last") => {
    setOpen(true);
    // Wait for the panel to be focusable before moving focus into it.
    requestAnimationFrame(() =>
      focusItem(position === "first" ? 0 : items.length - 1),
    );
  };

  /** Arrow keys open the menu from either half of the split trigger. */
  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocus(event.key === "ArrowDown" ? "first" : "last");
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const handleItemKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(index - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(items.length - 1);
    }
  };

  // Close once focus leaves the group entirely (covers Tab-out).
  const handleBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (!next || !wrapperRef.current?.contains(next)) setOpen(false);
  };

  return (
    <li
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={cancelClose}
      onBlur={handleBlur}
    >
      <span className="flex items-center">
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "label-caps inline-flex items-center py-2 transition-colors duration-200",
            active ? "text-bbn-gold" : "text-bbn-ink hover:text-bbn-gold",
          )}
        >
          {label}
        </Link>

        {/* The disclosure control proper — this is what carries the ARIA state,
            and what gives the menu a tap affordance on touch. */}
        <button
          ref={toggleRef}
          type="button"
          aria-label={submenuLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((previous) => !previous)}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            // 44px tap target, pulled tight to the label so the two halves still
            // read as one control.
            "-mr-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-sm transition-colors duration-200",
            active ? "text-bbn-gold" : "text-bbn-ink hover:text-bbn-gold",
          )}
        >
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-3.5 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </span>

      <div
        id={panelId}
        role="group"
        aria-label={groupLabel}
        hidden={!open}
        className={cn(
          "absolute left-0 top-full min-w-56 pt-2",
          // Animate in only when motion is welcome.
          "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1",
        )}
      >
        <ul className="flex flex-col rounded-sm border border-bbn-line bg-bbn-card py-2 shadow-lg shadow-black/60">
          {items.map((item, index) => (
            <li key={item.href}>
              <Link
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                onKeyDown={(event) => handleItemKeyDown(event, index)}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-5 py-3 text-sm transition-colors duration-200",
                  item.active
                    ? "text-bbn-gold"
                    : "text-bbn-ink hover:bg-bbn-surface hover:text-bbn-gold",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
