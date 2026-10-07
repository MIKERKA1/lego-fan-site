"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import TiltedCard from "@/components/TiltedCard";
import { gallery } from "@/content/site";
import { Credit, Pic } from "./parts";

export function Gallery() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // the large image is only mounted while the dialog is open
  const item = gallery[index];
  const go = (d: number) => setIndex((i) => (i + d + gallery.length) % gallery.length);

  const open = (i: number) => {
    setIndex(i);
    setIsOpen(true);
    dialog.current?.showModal();
  };

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {gallery.map((g, i) => (
          <li key={g.image}>
            <button type="button" onClick={() => open(i)} className="group block w-full rounded-lg text-left" aria-haspopup="dialog">
              <TiltedCard>
                <span className="block aspect-[4/3] overflow-hidden rounded-lg shadow-[0_0_0_2px_var(--border)]">
                  <Pic image={g.image} alt={g.alt} sizes="(min-width: 768px) 33vw, 50vw" className="h-full object-cover" />
                </span>
              </TiltedCard>
              <span className="mt-2 block text-sm font-semibold group-hover:underline">{g.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={item.caption}
        className="m-auto w-[min(64rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-auto overscroll-contain rounded-lg bg-card p-0 text-card-foreground backdrop:bg-black/75"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        onClose={() => setIsOpen(false)}
      >
        <figure>
          {isOpen && <Pic key={item.image} image={item.image} alt={item.alt} sizes="(min-width: 1024px) 64rem, 100vw" className="max-h-[75dvh] bg-black object-contain" eager />}
          <figcaption className="flex flex-wrap items-center gap-3 p-4">
            <span className="mr-auto min-w-0">
              <span className="block font-semibold">{item.caption}</span>
              <Credit image={item.image} />
            </span>
            <button type="button" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-md border-2 border-border hover:bg-muted" aria-label="Предыдущее фото">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} className="grid size-11 place-items-center rounded-md border-2 border-border hover:bg-muted" aria-label="Следующее фото">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => dialog.current?.close()} className="grid size-11 place-items-center rounded-md border-2 border-border bg-primary text-primary-foreground hover:bg-primary/85" aria-label="Закрыть" autoFocus>
              <X className="size-5" aria-hidden="true" />
            </button>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}
