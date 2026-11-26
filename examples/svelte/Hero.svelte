<!--
  Animated shader background in Svelte 5.
  npm i @studio-treo/sula
-->
<script>
  import "@studio-treo/sula";
  import look from "../look.json";
</script>

<section style="position: relative; height: 100vh; display: grid; place-items: center">
  <sula-shader {look}></sula-shader>
  <h1 style="position: relative; color: #fff">Hello</h1>
</section>
