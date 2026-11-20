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

// Hero carousel: fade between slides with arrows, dots and a slow autoplay.
document.querySelectorAll("[data-hero-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll("[data-hero-slide]")];
  const dots = [...carousel.querySelectorAll("[data-hero-dot]")];
  let index = 0;
  let timer;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, n) => {
      slide.classList.toggle("is-active", n === index);
      slide.setAttribute("aria-hidden", n === index ? "false" : "true");
    });
    dots.forEach((dot, n) => dot.setAttribute("aria-current", n === index ? "true" : "false"));
  };

  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), 7000);
  };

  carousel.querySelector("[data-hero-prev]")?.addEventListener("click", () => { show(index - 1); restart(); });
  carousel.querySelector("[data-hero-next]")?.addEventListener("click", () => { show(index + 1); restart(); });
  dots.forEach((dot, n) => dot.addEventListener("click", () => { show(n); restart(); }));

  show(0);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) restart();
});

// Tabs: <button data-tab="group:key"> shows every [data-tab-panel="group:key"]
// and hides the other panels of the same group.
document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const [group, key] = button.dataset.tab.split(":");
    document.querySelectorAll(`[data-tab^="${group}:"]`).forEach((b) => {
      b.setAttribute("aria-selected", b.dataset.tab === `${group}:${key}` ? "true" : "false");
    });
    document.querySelectorAll(`[data-tab-panel^="${group}:"]`).forEach((panel) => {
      panel.hidden = panel.dataset.tabPanel !== `${group}:${key}`;
    });
  });
});

// Background videos: load and play only while on screen.
const autoplayVideos = document.querySelectorAll("video[data-autoplay]");
if (autoplayVideos.length && "IntersectionObserver" in window &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    });
  }, { threshold: 0.25 });
  autoplayVideos.forEach((video) => observer.observe(video));
}
