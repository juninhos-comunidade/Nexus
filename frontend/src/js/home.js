const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0");

        entry.target.classList.add(
          "animate-fade-right",
          "animate-duration-700",
          "animate-ease-out",
          "animate-once",
          "animate-fill-both"
        );

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => {
  observer.observe(element);
});