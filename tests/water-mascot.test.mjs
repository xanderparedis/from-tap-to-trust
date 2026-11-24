import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { setMaxListeners } from 'node:events';
import ts from 'typescript';

const component = fs.readFileSync(path.join(import.meta.dirname, '../app/_components/water-mascot.tsx'), 'utf8');
const initialBody = component.match(/className="body"[^>]*d="([^"]+)"/)[1];
const source = fs.readFileSync(path.join(import.meta.dirname, '../app/_components/water-mascot-motion.ts'), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;

function setup(reducedMotion = false) {
  class Element extends EventTarget {
    constructor() { super(); this.attributes = {}; this.dataset = {}; this.isConnected = true; }
    setAttribute(key, value) {
      assert.doesNotMatch(String(value), /NaN|Infinity|undefined/, `Invalid ${key}`);
      this.attributes[key] = String(value);
    }
    getAttribute(key) { return this.attributes[key] ?? null; }
    contains() { return false; }
    getBoundingClientRect() { return {left: 0, top: 0, width: 880, height: 790}; }
  }
  class Controller extends AbortController {
    constructor() { super(); setMaxListeners(0, this.signal); }
  }
  const window = new EventTarget();
  const document = new EventTarget();
  document.hidden = false;
  const media = new EventTarget();
  media.matches = reducedMotion;
  const frames = new Map();
  const observers = [];
  let nextId = 1;
  let now = 0;
  const exports = {};
  const context = vm.createContext({
    exports, window, document, Node: Element, AbortController: Controller,
    matchMedia: () => media,
    requestAnimationFrame: callback => { const id = nextId++; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe(root) { this.root = root; }
      disconnect() { this.disconnected = true; }
    },
  });
  vm.runInContext(compiled, context);

  function mount() {
    const root = new Element();
    const elements = {};
    root.querySelector = selector => elements[selector] ??= new Element();
    root.querySelector('.body').attributes.d = initialBody;
    const particles = Array.from({length: 9}, () => new Element());
    const necks = Array.from({length: 10}, () => new Element());
    const drops = [new Element()];
    root.querySelectorAll = selector => selector.includes('satellites') ? particles : selector.includes('water-necks') ? necks : drops;
    const cleanup = exports.mountWaterMascot(root);
    return {root, elements, particles, cleanup, state: () => root.getAttribute('data-mascot-state')};
  }
  function step(seconds) {
    for (let i = 0; i < Math.ceil(seconds * 60); i++) {
      const pending = [...frames];
      frames.clear();
      for (const [, callback] of pending) callback(now);
      now += 1000 / 60;
    }
  }
  function fire(target, type, properties = {}) {
    const event = new Event(type);
    for (const [key, value] of Object.entries(properties)) Object.defineProperty(event, key, {value});
    target.dispatchEvent(event);
  }
  return {mount, step, fire, window, document, media, frames, observers};
}

test('gradually falls asleep and wakes smoothly on nearby mouse, touch and keyboard focus', () => {
  const env = setup();
  const mascot = env.mount();
  env.step(11);
  assert.equal(mascot.state(), 'awake');
  env.step(5);
  assert.equal(mascot.state(), 'sleepy');
  env.step(6);
  assert.equal(mascot.state(), 'sleeping');

  env.fire(env.window, 'pointermove', {clientX: 420, clientY: 390});
  env.step(0.8);
  assert.equal(mascot.state(), 'awake');

  env.step(22);
  env.fire(mascot.elements.svg, 'pointerdown', {target: mascot.elements['.body'], button: 0});
  env.step(0.8);
  assert.equal(mascot.state(), 'awake');
  env.fire(env.window, 'pointerup');
  env.step(22);
  env.fire(mascot.root, 'focusin');
  env.step(0.8);
  assert.equal(mascot.state(), 'awake');
  mascot.cleanup();
});

test('keeps the angry and heart easter eggs and circle gesture, then recovers automatically', () => {
  const env = setup();
  const mascot = env.mount();
  env.step(1);
  env.fire(mascot.particles[0], 'dblclick');
  env.step(0.7);
  assert.equal(mascot.elements['.angry-brows'].getAttribute('opacity'), '1.000');
  env.step(6);
  assert.equal(mascot.elements['.angry-brows'].getAttribute('opacity'), '0.000');

  for (let i = 0; i < 5; i++) {
    env.fire(mascot.elements['.body'], 'click');
    env.step(0.12);
  }
  env.step(0.8);
  assert.equal(mascot.elements['.heart-left'].getAttribute('opacity'), '1.000');
  env.step(7);
  for (let i = 0; i <= 160; i++) {
    const angle = i / 160 * Math.PI * 4;
    if (i % 40 === 0) env.fire(mascot.elements.svg, 'pointerleave');
    const surface = i % 40 > 25 ? env.window : mascot.elements.svg;
    env.fire(surface, 'pointermove', {clientX: 420 + 280 * Math.cos(angle), clientY: 390 + 280 * Math.sin(angle)});
    env.step(1 / 60);
  }
  env.step(0.7);
  assert.equal(mascot.elements['.dizzy-left'].getAttribute('opacity'), '1.000');
  env.step(7);
  assert.equal(mascot.elements['.dizzy-left'].getAttribute('opacity'), '0.000');
  mascot.cleanup();
});

test('instances stay independent and release frames and global listeners on unmount', () => {
  const env = setup();
  const first = env.mount();
  const second = env.mount();
  env.step(22);
  env.fire(first.root, 'focusin');
  env.step(0.8);
  assert.equal(first.state(), 'awake');
  assert.equal(second.state(), 'sleeping');

  first.cleanup();
  assert.equal(env.observers[0].disconnected, true);
  const frozen = JSON.stringify(first.elements['.body'].attributes);
  env.fire(env.window, 'pointermove', {clientX: 420, clientY: 390});
  env.step(1);
  assert.equal(JSON.stringify(first.elements['.body'].attributes), frozen);
  assert.equal(second.state(), 'awake');
  second.cleanup();
  assert.equal(env.frames.size, 0);
});

test('suspends outside the viewport, in hidden tabs and with reduced-motion preference', () => {
  const env = setup();
  const mascot = env.mount();
  env.observers[0].callback([{isIntersecting: false}]);
  assert.equal(env.frames.size, 0);
  env.observers[0].callback([{isIntersecting: true}]);
  assert.equal(env.frames.size, 1);
  env.document.hidden = true;
  env.fire(env.document, 'visibilitychange');
  assert.equal(env.frames.size, 0);
  env.document.hidden = false;
  env.fire(env.document, 'visibilitychange');
  assert.equal(env.frames.size, 1);
  env.media.matches = true;
  env.fire(env.media, 'change', {matches: true});
  assert.equal(env.frames.size, 0);
  mascot.cleanup();

  const reduced = setup(true);
  const still = reduced.mount();
  assert.equal(reduced.frames.size, 0);
  assert.equal(still.root.dataset.paused, 'true');
  still.cleanup();
});
