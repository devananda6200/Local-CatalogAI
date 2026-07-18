"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Copy, Download, MessageCircle, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Business } from "@/lib/types";
import { getPublicCatalogUrl } from "@/lib/urls";

export function QrShareCenter({ business }: { business: Business }) {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");
  useEffect(() => {
    const publicUrl = getPublicCatalogUrl(
      window.location.origin,
      business.slug,
    );
    QRCode.toDataURL(publicUrl, {
      width: 900,
      margin: 2,
      color: { dark: "#17201b", light: "#fffefa" },
      errorCorrectionLevel: "H",
    })
      .then((dataUrl) => {
        setUrl(publicUrl);
        setQr(dataUrl);
      })
      .catch(() => toast.error("Could not generate the QR code."));
  }, [business.slug]);
  async function copy() {
    await navigator.clipboard.writeText(url);
    toast.success("Public catalog link copied");
  }
  function download() {
    if (!qr) return;
    const link = document.createElement("a");
    link.href = qr;
    link.download = `${business.slug}-catalog-qr.png`;
    link.click();
    toast.success("QR code downloaded");
  }
  async function share() {
    if (navigator.share)
      await navigator.share({
        title: business.name,
        text: `Browse the ${business.name} catalog`,
        url,
      });
    else await copy();
  }
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <section
        id="qr-print-card"
        className="rounded-[2rem] border border-black/5 bg-[#fffefa] p-6 text-center shadow-sm print:border-0 print:shadow-none"
      >
        <p className="text-xs font-bold tracking-[.18em] text-[#176b4d] uppercase">
          Scan to browse
        </p>
        <h2 className="mt-2 text-2xl font-black">{business.name}</h2>
        {qr ? (
          <Image
            src={qr}
            alt={`QR code for ${business.name} catalog`}
            width={900}
            height={900}
            unoptimized
            className="mx-auto mt-5 aspect-square w-full max-w-72"
          />
        ) : (
          <div className="mx-auto mt-5 aspect-square w-full max-w-72 animate-pulse rounded-2xl bg-black/5" />
        )}
        <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[#68756d]">
          Point your phone camera here to open our current catalog.
        </p>
        <p className="mt-3 text-xs font-bold break-all">{url}</p>
      </section>
      <section className="space-y-5">
        <article className="rounded-[2rem] border border-black/5 bg-[#fffefa] p-6">
          <h2 className="text-xl font-black">Your catalog link</h2>
          <p className="mt-2 text-sm leading-6 text-[#68756d]">
            Use the same destination everywhere. The QR code always opens this
            exact public page.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#f1f3ef] p-2 pl-4">
            <p className="min-w-0 flex-1 truncate text-sm font-bold">
              {url || "Preparing link…"}
            </p>
            <Button
              type="button"
              onClick={copy}
              variant="secondary"
              className="shrink-0"
            >
              <Copy size={15} /> Copy
            </Button>
          </div>
        </article>
        <article className="rounded-[2rem] border border-black/5 bg-[#fffefa] p-6">
          <h2 className="text-xl font-black">Share and display</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button type="button" onClick={download} variant="secondary">
              <Download size={16} /> Download PNG
            </Button>
            <Button
              type="button"
              onClick={() => window.print()}
              variant="secondary"
            >
              <Printer size={16} /> Print QR layout
            </Button>
            <Button
              type="button"
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(`Browse ${business.name}: ${url}`)}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              variant="secondary"
            >
              <MessageCircle size={16} /> Share on WhatsApp
            </Button>
            <Button type="button" onClick={share}>
              <Share2 size={16} /> Share from device
            </Button>
          </div>
        </article>
        <article className="rounded-[2rem] bg-[#17201b] p-6 text-white">
          <p className="text-sm font-black">Print tip</p>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Place the QR near your entrance, counter, tables, or product
            packaging. Keep at least 2 cm of clear space around it.
          </p>
        </article>
      </section>
    </div>
  );
}
