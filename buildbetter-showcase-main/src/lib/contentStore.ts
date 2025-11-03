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
  items: { machine: string; quantity: number }[];
  fullName: string;
  phone: string;
  email: string;
  startDate: string;
  days: number;
  createdAt: string;
};

const RENTAL_KEY = "rentalRequests";

export function saveRentalRequest(request: RentalRequest): void {
  try {
    const raw = localStorage.getItem(RENTAL_KEY);
    const list = raw ? (JSON.parse(raw) as RentalRequest[]) : [];
    list.push(request);
    localStorage.setItem(RENTAL_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function getRentalRequests(): RentalRequest[] {
  try {
    const raw = localStorage.getItem(RENTAL_KEY);
    return raw ? (JSON.parse(raw) as RentalRequest[]) : [];
  } catch {
    return [];
  }
}


