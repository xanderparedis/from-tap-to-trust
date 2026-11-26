"use client";
import { useEffect, useId, useRef } from "react";
import { mountWaterMascot } from "./water-mascot-motion";
export function WaterMascot() {
  const root = useRef<HTMLDivElement>(null);
  const id = "water-mascot-" + useId().replace(/:/g, "");
  useEffect(() => {
    if (root.current)
      return mountWaterMascot(root.current);
  }, []);
  return (<div ref={root} className="mascot-slot animated-mascot" data-mascot-state="awake">
 <svg className="mascot-stage" viewBox="-90 -90 880 790" shapeRendering="geometricPrecision" role="button" tabIndex={0} aria-labelledby={`${id}-title ${id}-description`}>
  <title id={`${id}-title`}>De watermascotte van From Tap to Trust</title>
  <desc id={`${id}-description`}>Een zachte blauwe vorm met ogen die je muis volgen en bubbeltjes die samenvloeien. Aai hem, klik of tik op hem voor een sprongetje. Na rust dommelt hij in; beweeg in zijn buurt om hem wakker te maken. Met Enter of spatie springt hij.</desc>
  <defs>
   <filter id={`${id}-fusion`} filterUnits="userSpaceOnUse" x="-90" y="-90" width="880" height="790" colorInterpolationFilters="sRGB">
    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="soft-water"/>
    <feColorMatrix in="soft-water" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="joined-water"/>
    <feComposite in="SourceGraphic" in2="joined-water" operator="atop"/>
   </filter>
  </defs>
  <g className="liquid-fusion" filter={`url(#${id}-fusion)`} pointerEvents="none" aria-hidden="true">
   <use href={`#${id}-liquid-shapes`} />
  </g>
  <g id={`${id}-liquid-shapes`} className="liquid">
  <g className="water-necks" fill="#144bba" aria-hidden="true">
   <path /><path /><path /><path /><path /><path /><path /><path /><path /><path />
  </g>
  <g className="satellites" fill="#144bba">
   <path /><path /><path />
   <path /><path /><path />
   <path /><path /><path />
  </g>
  <g className="escaping-drops" fill="#144bba" aria-hidden="true">
   <path opacity="0"/>
  </g>
  <g className="body-motion">
   <path className="body" fill="#144bba" d="M390 55 C450 55 503 102 503 160 C503 220 435 245 435 303 C435 360 502 391 502 449 C502 506 459 538 405 538 C343 538 329 484 268 477 C216 470 180 475 137 448 C84 414 65 358 68 300 C70 240 97 198 146 172 C189 150 243 149 295 104 C325 77 353 53 390 55 Z"/>
  </g>
  </g>
  <g className="character">
   <g className="eyes" fill="#fff">
    <path className="eye-left" d="M267 252 C283 250 295 271 293 293 C292 316 281 331 266 329 C250 328 241 311 242 291 C242 270 252 253 267 252 Z"/>
    <path className="eye-right" d="M343 246 C360 247 373 269 372 292 C372 316 359 335 344 333 C327 333 317 313 318 291 C319 268 329 246 343 246 Z"/>
    <path className="heart-left" opacity="0"/>
    <path className="heart-right" opacity="0"/>
    <path className="dizzy-left" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" opacity="0"/>
    <path className="dizzy-right" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" opacity="0"/>
    <path className="angry-brows" d="M242 248 Q263 252 282 264 M328 264 Q348 252 370 248" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0"/>
   </g>
   <path className="smile" d="M280 347 Q307 373 334 347" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0"/>
   <path className="dizzy-mouth" d="M290 347 Q298 339 306 347 T322 347" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0"/>
   <path className="angry-mouth" d="M288 357 Q307 338 326 357" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" opacity="0"/>
   <path className="sleep-mouth" d="M299 346 C299 334 315 334 315 346 C315 358 299 358 299 346 Z" fill="none" stroke="#fff" strokeWidth="4" opacity="0"/>
  </g>
 </svg>
  </div>);
}
