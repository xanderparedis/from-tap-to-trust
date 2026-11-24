import Image from "next/image";
import { mascottes } from "../../inhoud.json";
import { WaterMascot } from "./water-mascot";

type Mascot = { pad: string; alt: string };

const slots: Record<keyof typeof mascottes, Mascot | null> = mascottes;

export function MascotSlot({ slot }: { slot: keyof typeof mascottes }) {
  const mascot = slots[slot];

  return mascot ? (
    <Image className="mascot-slot mascot-image" src={mascot.pad} alt={mascot.alt}
      width={144} height={144} unoptimized />
  ) : (
    <WaterMascot />
  );
}
