import {
  AtSign,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { getDirectionsUrl } from "@/lib/maps";
import type { Business } from "@/lib/types";

export function CatalogActions({ business }: { business: Business }) {
  const directions = getDirectionsUrl(business);
  const whatsapp = business.whatsapp
    ? `https://wa.me/${business.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${business.name}, I found you through your catalog.`)}`
    : null;
  return (
    <div className="flex flex-wrap gap-2">
      {directions ? (
        <ButtonLink href={directions} external>
          <MapPin size={16} /> Take Me to Location
        </ButtonLink>
      ) : null}
      {business.phone ? (
        <ButtonLink href={`tel:${business.phone}`} variant="secondary">
          <Phone size={16} /> Call
        </ButtonLink>
      ) : null}
      {whatsapp ? (
        <ButtonLink href={whatsapp} variant="secondary" external>
          <MessageCircle size={16} /> WhatsApp
        </ButtonLink>
      ) : null}
      {business.instagramUrl ? (
        <ButtonLink href={business.instagramUrl} variant="secondary" external>
          <AtSign size={16} /> Instagram <ExternalLink size={13} />
        </ButtonLink>
      ) : null}
    </div>
  );
}
