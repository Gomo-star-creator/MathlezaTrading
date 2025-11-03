type SectionKey = "home" | "about" | "services" | "projects";

type HomeContent = {
  badge?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
};

type AboutContent = {
  heading?: string;
  subheading?: string;
  description?: string;
  badge?: string;
  ctaLabel?: string;
};

type ServicesContent = {
  heading?: string;
  subheading?: string;
  intro?: string;
};

type ProjectsContent = {
  heading?: string;
  subheading?: string;
  intro?: string;
};

export type ContentBySection = {
  home?: HomeContent;
  about?: AboutContent;
  services?: ServicesContent;
  projects?: ProjectsContent;
};

const STORAGE_KEY = "siteContentOverrides";

export function getContent<T extends keyof ContentBySection>(section: T): NonNullable<ContentBySection[T]> | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const data = JSON.parse(raw) as ContentBySection;
    return data[section] as NonNullable<ContentBySection[T]> | undefined;
  } catch {
    return undefined;
  }
}

export function setContent<T extends keyof ContentBySection>(section: T, value: NonNullable<ContentBySection[T]>): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as ContentBySection) : {};
    data[section] = value as any;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export type RentalRequest = {
  id: string;
  items: { machine: string; quantity: number }[];
  fullName: string;
  phone: string;
  email: string;
  startDate: string;
  days: number;
  createdAt: string;
  status?: "pending" | "approved" | "denied";
  adminNote?: string;
};

const RENTAL_KEY = "rentalRequests";

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function saveRentalRequest(request: Omit<RentalRequest, "id"> & Partial<Pick<RentalRequest, "status" | "adminNote">>): void {
  try {
    const raw = localStorage.getItem(RENTAL_KEY);
    const list = raw ? (JSON.parse(raw) as RentalRequest[]) : [];
    const withId: RentalRequest = {
      id: generateId(),
      status: request.status ?? "pending",
      adminNote: request.adminNote ?? "",
      items: request.items,
      fullName: request.fullName,
      phone: request.phone,
      email: request.email,
      startDate: request.startDate,
      days: request.days,
      createdAt: request.createdAt,
    };
    list.push(withId);
    localStorage.setItem(RENTAL_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function getRentalRequests(): RentalRequest[] {
  try {
    const raw = localStorage.getItem(RENTAL_KEY);
    const list = raw ? (JSON.parse(raw) as RentalRequest[]) : [];
    // ensure legacy entries have ids
    return list.map((r) => ({
      id: (r as any).id || generateId(),
      status: r.status ?? "pending",
      adminNote: r.adminNote ?? "",
      items: r.items,
      fullName: r.fullName,
      phone: r.phone,
      email: r.email,
      startDate: r.startDate,
      days: r.days,
      createdAt: r.createdAt,
    }));
  } catch {
    return [];
  }
}

export function updateRentalRequestById(id: string, updates: Partial<RentalRequest>): void {
  try {
    const raw = localStorage.getItem(RENTAL_KEY);
    const list = raw ? (JSON.parse(raw) as RentalRequest[]) : [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return;
    list[idx] = { ...list[idx], ...updates, id: list[idx].id };
    localStorage.setItem(RENTAL_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function updateRentalRequestAt(index: number, updates: Partial<RentalRequest>): void {
  try {
    const raw = localStorage.getItem(RENTAL_KEY);
    const list = raw ? (JSON.parse(raw) as RentalRequest[]) : [];
    if (index < 0 || index >= list.length) return;
    const current = list[index];
    list[index] = { ...current, ...updates, id: current.id || generateId() };
    localStorage.setItem(RENTAL_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function deleteRentalRequestById(id: string): void {
  try {
    const raw = localStorage.getItem(RENTAL_KEY);
    const list = raw ? (JSON.parse(raw) as RentalRequest[]) : [];
    const filtered = list.filter((r) => r.id !== id);
    localStorage.setItem(RENTAL_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

export function deleteRentalRequestAt(index: number): void {
  try {
    const raw = localStorage.getItem(RENTAL_KEY);
    const list = raw ? (JSON.parse(raw) as RentalRequest[]) : [];
    if (index < 0 || index >= list.length) return;
    list.splice(index, 1);
    localStorage.setItem(RENTAL_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

// Admin accounts store (for demo purposes only; do not use plaintext in production)
export type AdminAccount = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};
const ADMIN_KEY = "adminAccounts";

export function getAdmins(): AdminAccount[] {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? (JSON.parse(raw) as AdminAccount[]) : [];
  } catch {
    return [];
  }
}

export function addAdmin(admin: AdminAccount): void {
  try {
    const admins = getAdmins();
    // prevent duplicates by username
    if (admins.some(a => a.username === admin.username)) {
      // replace existing
      const idx = admins.findIndex(a => a.username === admin.username);
      admins[idx] = admin;
    } else {
      admins.push(admin);
    }
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admins));
  } catch {
    // ignore
  }
}

export function removeAdmin(username: string): void {
  try {
    const admins = getAdmins().filter(a => a.username !== username);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admins));
  } catch {
    // ignore
  }
}

export function updateAdmin(username: string, updates: Partial<AdminAccount>): void {
  try {
    const admins = getAdmins();
    const idx = admins.findIndex(a => a.username === username);
    if (idx === -1) return;
    admins[idx] = { ...admins[idx], ...updates, username: admins[idx].username };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admins));
  } catch {
    // ignore
  }
}


