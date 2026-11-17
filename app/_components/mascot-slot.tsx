import Image from "next/image";
import { mascottes } from "../../inhoud.json";

type Mascot = { pad: string; alt: string };

const slots: Record<keyof typeof mascottes, Mascot | null> = mascottes;

export function MascotSlot({ slot }: { slot: keyof typeof mascottes }) {
  const mascot = slots[slot];

  return mascot ? (
    <Image className="mascot-slot mascot-image" src={mascot.pad} alt={mascot.alt}
      width={144} height={144} unoptimized />
  ) : (
    <span className="mascot-slot mascot-placeholder" aria-hidden="true">Mascotte</span>
  );
}
