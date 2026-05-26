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

// controle de sessão do usuário
document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('nexusToken');

  const botoesAuth = document.getElementById('botoesAuth');
  const botaoSair = document.getElementById('botaoSair');

  if (token) {
    if (botoesAuth) botoesAuth.classList.add('hidden');
    if (botaoSair) botaoSair.classList.remove('hidden');
  }

  if (botaoSair) {
    botaoSair.addEventListener('click', function () {
      localStorage.removeItem('nexusToken');
      window.location.reload();
    });
  }
});