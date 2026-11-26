<!--
  Animated shader background in Vue 3.
  npm i @studio-treo/sula
  vite.config: vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === "sula-shader" } } })
-->
<script setup>
import "@studio-treo/sula";
import look from "../look.json";
</script>

<template>
  <section style="position: relative; height: 100vh; display: grid; place-items: center">
    <sula-shader :look="look" />
    <h1 style="position: relative; color: #fff">Hello</h1>
  </section>
</template>
