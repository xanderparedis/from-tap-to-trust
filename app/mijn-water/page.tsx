import type { Metadata } from "next";
import { Intro } from "../_components/content";
import { WaterLookup } from "./water-lookup";

export const metadata: Metadata = { title: "Where does my water come from?" };

export default function WaterPage() {
  return (
    <>
      <Intro section={"Water sources"} title={"From source to your tap."}>
        <p>{"Find your water company and follow the journey of Antwerp's drinking water."}</p>
      </Intro>
      <WaterLookup />
    </>
  );
}
