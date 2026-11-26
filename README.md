# @studio-treo/sula: animated shader backgrounds for React, Vue, Svelte and HTML

`@studio-treo/sula` is an npm package for animated WebGL shader backgrounds in React, Next.js, Vue, Svelte and plain HTML. One web component, `<sula-shader>`, draws animated gradients, mesh gradients, light and liquid effects live on the GPU, with no dependencies and 27 kB gzipped. You pick and tune the look in [Sula Designer](https://sula.ink/designer), the free browser editor with 33 shaders and their presets.

```bash
npm i @studio-treo/sula
```

```jsx
"use client";
import "@studio-treo/sula";
import look from "./look.json"; // exported from Sula Designer

export function Hero() {
  return (
    <section style={{ position: "relative", height: "100vh" }}>
      <sula-shader look={JSON.stringify(look)} />
      <h1 style={{ position: "relative" }}>Hello</h1>
    </section>
  );
}
```

- Drawn in real time, so it stays sharp at any screen size, and a look is a few kilobytes of JSON instead of a video file.
- Pauses while off-screen, shows a still frame with `prefers-reduced-motion`, and is safe with server rendering.
- Webflow, Framer or a page without a build step: use the [embed snippet](#without-npm).
- Examples for React, Next.js, Vue, Svelte and HTML: [github.com/Bombadaa/sula-shader](https://github.com/Bombadaa/sula-shader)
- Sula for Mac: the same looks as a live wallpaper and screensaver, [sula.ink](https://sula.ink)

## 1. Get a look

Design a background in [Sula Designer](https://sula.ink/designer), open **Export → Web** and download the look (`<name>.json`). A look is the shader code plus its settings:

```json
{ "v": 1, "name": "Neon Flux", "frag": "…GLSL…", "settings": { "speed": 1, "uniforms": {}, "post": {}, "interaction": {} } }
```

The look is self-contained: later changes to Sula's shader library never change it, while engine fixes still apply.

## 2. Install

```bash
npm i @studio-treo/sula
```

## 3. Render

Importing `@studio-treo/sula` defines the `<sula-shader>` element. It takes the look as

- the `look` property (an object or a JSON string),
- the `look` attribute (a JSON string), or
- a child `<script type="application/json">`.

The element fills its parent, so the parent needs `position: relative` (or another positioned layout). It is not clickable. Content in the same parent needs `position: relative` (or a `z-index`) to appear above the shader, as in the examples below.

### Any bundler (Vite, webpack, …)

```html
<section style="position: relative; height: 100vh">
  <sula-shader id="bg"></sula-shader>
  <h1 style="position: relative">Hello</h1>
</section>
<script type="module">
  import "@studio-treo/sula";
  import look from "./neon-flux.json";
  document.getElementById("bg").look = look;
</script>
```

### React and Next.js

```jsx
"use client";
import "@studio-treo/sula";
import look from "./neon-flux.json";

export function Hero() {
  return (
    <section style={{ position: "relative", height: "100vh" }}>
      <sula-shader look={JSON.stringify(look)} />
      <h1 style={{ position: "relative" }}>Hello</h1>
    </section>
  );
}
```

Pass the look as a JSON string: React writes it into the server HTML and sets it as a property in the browser, so it works with and without server rendering (and in React 18). An object (`look={look}`) only works when the component renders in the browser alone, because React leaves object props out of the server HTML and does not set them during hydration.

TypeScript:

```ts
import type { SulaLook, SulaShader } from "@studio-treo/sula";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "sula-shader": React.DetailedHTMLProps<React.HTMLAttributes<SulaShader>, SulaShader> & { look?: SulaLook | string };
    }
  }
}
```

### Vue 3

Tell Vue the tag is a custom element (`vite.config`):

```js
vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === "sula-shader" } } })
```

```vue
<script setup>
import "@studio-treo/sula";
import look from "./neon-flux.json";
</script>

<template>
  <section style="position: relative; height: 100vh">
    <sula-shader :look="look" />
  </section>
</template>
```

### Svelte 5

```svelte
<script>
  import "@studio-treo/sula";
  import look from "./neon-flux.json";
</script>

<section style="position: relative; height: 100vh">
  <sula-shader {look}></sula-shader>
</section>
```

### Server rendering in general

Frameworks that render on the server (Next.js, Nuxt, SvelteKit, Astro) can import `@studio-treo/sula` there: it defines nothing outside the browser. Passing the look as a JSON string puts it into the server HTML, so the shader starts before hydration.

### Without npm

Sula's **Export → Web → Embed** gives you a ready snippet for Webflow, Framer or any HTML page:

```html
<script src="https://sula.ink/embed/v1/sula.js" defer></script>
<sula-shader>
<script type="application/json">{ …the look… }</script>
</sula-shader>
```

With a Content Security Policy, allow `https://sula.ink` in `script-src` (and in `img-src` for image shaders that use Sula's sample images).

## Styling

The element's own style is `display: block; position: absolute; inset: 0; overflow: hidden; pointer-events: none`. Any rule of yours wins, for example:

```css
sula-shader { position: static; height: 400px; border-radius: 16px; }
```

## Images

Image shaders use the image stored in the look. To use another image (for example from a CMS), put an `<img>` inside the element; its source replaces the look's image. Images from another domain need CORS headers (WebGL loads them with `crossOrigin="anonymous"`).

## Behavior

- Pauses while off-screen and shows a still frame with `prefers-reduced-motion: reduce`.
- Setting a new `look` re-renders; removing the element releases its WebGL resources.
- Invalid looks and WebGL errors are logged with `console.warn("[Sula] …")`; nothing throws.
- The first render on a page logs one line with a link to Sula (`console.info`).
- Markup of the single-file widget that Sula exported before this package (`<sula-shader shader="…">`) does not render; the element logs a warning. Export the look again.

## API

```ts
import { SulaShader, parseLook, buildLook, lookJson, LOOK_VERSION, type SulaLook } from "@studio-treo/sula";
```

- `SulaShader`: the element class, `look: SulaLook | string | null`.
- `parseLook(value)`: checks a look (object or JSON string), returns `{ look }` or `{ error }`.
- `buildLook({ name?, frag, settings })`: a v1 look from your own GLSL.
- `lookJson(look)`: the look as JSON that is safe inside a `<script>` element.

## License

The engine is MIT, see [LICENSE](./LICENSE).

The looks you export from Sula Designer (its shaders and presets) are under the [Sula Look License](https://sula.ink/look-license.txt): free in websites and apps, commercial ones included, but not as wallpapers or screen savers, in packs or in tools that compete with Sula. Shaders you write yourself are yours.
