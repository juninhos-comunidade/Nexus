const notificationButton = document.getElementById("notificationButton");
const notificationBadge = document.getElementById("notificationBadge");
const notificationPanel = document.getElementById("notificationPanel");
const notificationList = document.getElementById("notificationList");
const notificationSubtitle = document.getElementById("notificationSubtitle");
const markAllReadButton = document.getElementById("markAllReadButton");
const clearNotificationsButton = document.getElementById("clearNotificationsButton");

const NOTIFICATIONS_KEY = "nexusNotifications";

function getStoredNotifications() {
  const notifications = localStorage.getItem(NOTIFICATIONS_KEY);

  if (!notifications) {
    return [];
  }

  try {
    return JSON.parse(notifications);
  } catch (error) {
    console.error("Erro ao carregar notificações:", error);
    localStorage.removeItem(NOTIFICATIONS_KEY);
    return [];
  }
}

function saveNotifications(notifications) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function createNotification({ title, message, type = "info" }) {
  if (!title || !message) return;

  const notifications = getStoredNotifications();

  const newNotification = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };

  notifications.unshift(newNotification);

  const limitedNotifications = notifications.slice(0, 20);

  saveNotifications(limitedNotifications);
  renderNotifications();
}

function getNotificationIcon(type) {
  if (type === "success") {
    return "ti ti-check";
  }

  if (type === "warning") {
    return "ti ti-alert-triangle";
  }

  if (type === "error") {
    return "ti ti-x";
  }

  if (type === "profile") {
    return "ti ti-user-check";
  }

  if (type === "purchase") {
    return "ti ti-shopping-cart-check";
  }

  if (type === "interest") {
    return "ti ti-target-arrow";
  }

  return "ti ti-bell";
}

function getNotificationColor(type) {
  if (type === "success") {
    return "bg-green-100 text-green-700";
  }

  if (type === "warning") {
    return "bg-amber-100 text-amber-700";
  }

  if (type === "error") {
    return "bg-red-100 text-red-700";
  }

  if (type === "profile") {
    return "bg-purple-100 text-purple-700";
  }

  if (type === "purchase") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (type === "interest") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-slate-100 text-slate-700";
}

function formatNotificationTime(dateString) {
  const createdDate = new Date(dateString);
  const now = new Date();

  const differenceInMinutes = Math.floor((now - createdDate) / 1000 / 60);

  if (differenceInMinutes < 1) {
    return "Agora";
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min atrás`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);

  if (differenceInHours < 24) {
    return `${differenceInHours}h atrás`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInDays < 7) {
    return `${differenceInDays}d atrás`;
  }

  return createdDate.toLocaleDateString("pt-BR");
}

function updateNotificationHeader(notifications) {
  const unreadNotifications = notifications.filter(notification => !notification.read);

  if (unreadNotifications.length > 0) {
    notificationBadge.textContent = unreadNotifications.length;
    notificationBadge.classList.remove("hidden");

    notificationSubtitle.textContent =
      unreadNotifications.length === 1
        ? "1 nova notificação"
        : `${unreadNotifications.length} novas notificações`;
  } else {
    notificationBadge.classList.add("hidden");
    notificationSubtitle.textContent = "Nenhuma nova notificação";
  }
}

function renderEmptyNotifications() {
  notificationList.innerHTML = `
    <div class="px-4 py-10 text-center">
      <div class="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-nexus-background text-nexus-muted">
        <i class="ti ti-bell-off text-xl"></i>
      </div>

      <h4 class="text-sm font-semibold text-nexus-dark">
        Sem notificações
      </h4>

      <p class="mt-1 text-xs leading-5 text-nexus-muted">
        Notificações de compras, interesses e alterações de perfil aparecerão aqui.
      </p>
    </div>
  `;
}

function renderNotificationItem(notification) {
  const item = document.createElement("button");

  item.type = "button";

  item.className = `
    w-full border-b border-nexus-border px-4 py-4 text-left transition-all duration-300 hover:bg-nexus-background
    ${notification.read ? "bg-white" : "bg-nexus-primary/5"}
  `;

  item.innerHTML = `
    <div class="flex gap-3">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getNotificationColor(notification.type)}">
        <i class="${getNotificationIcon(notification.type)} text-lg"></i>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <h4 class="text-sm font-semibold text-nexus-dark">
            ${notification.title}
          </h4>

          ${notification.read ? "" : `<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-nexus-primary"></span>`}
        </div>

        <p class="mt-1 text-xs leading-5 text-nexus-muted">
          ${notification.message}
        </p>

        <span class="mt-2 block text-[11px] font-medium text-nexus-muted">
          ${formatNotificationTime(notification.createdAt)}
        </span>
      </div>
    </div>
  `;

  item.addEventListener("click", () => {
    markNotificationAsRead(notification.id);
  });

  return item;
}

function renderNotifications() {
  if (!notificationList || !notificationBadge || !notificationSubtitle) return;

  const notifications = getStoredNotifications();

  notificationList.innerHTML = "";

  updateNotificationHeader(notifications);

  if (notifications.length === 0) {
    renderEmptyNotifications();
    return;
  }

  notifications.forEach(notification => {
    const item = renderNotificationItem(notification);
    notificationList.appendChild(item);
  });
}

function markNotificationAsRead(notificationId) {
  const notifications = getStoredNotifications();

  const updatedNotifications = notifications.map(notification => {
    if (notification.id === notificationId) {
      return {
        ...notification,
        read: true
      };
    }

    return notification;
  });

  saveNotifications(updatedNotifications);
  renderNotifications();
}

function markAllNotificationsAsRead() {
  const notifications = getStoredNotifications();

  const updatedNotifications = notifications.map(notification => {
    return {
      ...notification,
      read: true
    };
  });

  saveNotifications(updatedNotifications);
  renderNotifications();
}

function clearNotifications() {
  localStorage.removeItem(NOTIFICATIONS_KEY);
  renderNotifications();
}

function toggleNotificationPanel() {
  if (!notificationPanel) return;

  notificationPanel.classList.toggle("hidden");
}

function closeNotificationPanel() {
  if (!notificationPanel) return;

  notificationPanel.classList.add("hidden");
}

function removeOldWelcomeNotifications() {
  const notifications = getStoredNotifications();

  const filteredNotifications = notifications.filter(notification => {
    return notification.title !== "Bem-vindo ao Nexus" && notification.title !== "Meta próxima";
  });

  saveNotifications(filteredNotifications);
}

if (notificationButton && notificationPanel) {
  notificationButton.addEventListener("click", event => {
    event.stopPropagation();
    toggleNotificationPanel();
  });
}

if (notificationPanel) {
  notificationPanel.addEventListener("click", event => {
    event.stopPropagation();
  });
}

if (markAllReadButton) {
  markAllReadButton.addEventListener("click", markAllNotificationsAsRead);
}

if (clearNotificationsButton) {
  clearNotificationsButton.addEventListener("click", clearNotifications);
}

document.addEventListener("click", closeNotificationPanel);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeNotificationPanel();
  }
});

window.createNotification = createNotification;

removeOldWelcomeNotifications();
renderNotifications();