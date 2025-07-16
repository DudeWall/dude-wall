<script>
  function toggle(el) {
    el.classList.toggle("active");
    const nested = el.nextElementSibling;
    if (nested) {
      nested.style.display = nested.style.display === "block" ? "none" : "block";
    }
  }
</script>
