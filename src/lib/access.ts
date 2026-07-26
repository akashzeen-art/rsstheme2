export interface UserAccess {
  phone: string;
  plan: "weekly" | "monthly";
  unlocked: boolean;
  memberSince: string;
}

const STORAGE_KEY = "cinematx_access";

const PLAN_PRICES = { weekly: "₹79", monthly: "₹179" } as const;

export function loadAccess(): UserAccess | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<UserAccess>;
    if (!data.phone || !data.plan) return null;
    return {
      phone: data.phone,
      plan: data.plan,
      unlocked: data.unlocked ?? true,
      memberSince: data.memberSince ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveAccess(phone: string, plan: "weekly" | "monthly"): UserAccess {
  const access: UserAccess = {
    phone,
    plan,
    unlocked: true,
    memberSince: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(access));
  return access;
}

export function clearAccess() {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return `+91 ${digits}`;
}

export function formatPlan(plan: "weekly" | "monthly") {
  const label = plan === "weekly" ? "Weekly" : "Monthly";
  return `${label} — ${PLAN_PRICES[plan]}`;
}

export function formatMemberSince(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
