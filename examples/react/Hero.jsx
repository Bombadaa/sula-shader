// Animated shader background in React or Next.js (App Router).
// npm i @studio-treo/sula
"use client";
import "@studio-treo/sula";
import look from "../look.json";

export function Hero() {
  return (
    <section style={{ position: "relative", height: "100vh", display: "grid", placeItems: "center" }}>
      {/* A JSON string works with and without server rendering */}
      <sula-shader look={JSON.stringify(look)} />
      <h1 style={{ position: "relative", color: "#fff" }}>Hello</h1>
    </section>
  );
}
