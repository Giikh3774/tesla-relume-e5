// Card sliders: arrow buttons scroll the track by one card.
document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector("[data-slider-track]");
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  if (!track) return;

  const step = () => {
    const card = track.firstElementChild;
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  prev?.addEventListener("click", () => track.scrollBy({ left: -step() }));
  next?.addEventListener("click", () => track.scrollBy({ left: step() }));
});

// Sign-up form (updates.html): validate in the browser and show a thank-you
// message. There is no backend, so nothing is sent anywhere.
document.querySelectorAll("[data-signup-form]").forEach((form) => {
  const error = form.querySelector("[data-form-error]");
  const success = form.parentElement.querySelector("[data-form-success]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      error.hidden = false;
      form.querySelector(":invalid")?.focus();
      return;
    }
    error.hidden = true;
    form.hidden = true;
    success.hidden = false;
  });
});
