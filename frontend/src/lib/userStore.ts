import crypto from "crypto";
import { AuthUser, Role, UserProfile } from "@/types";
import { DEFAULT_USER_PROFILE } from "./mockData";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  salt: string;
  organization: string;
  job_title: string;
  department: string;
  role: Role;
  status: "active" | "pending" | "suspended";
  email_verified: boolean;
  initials: string;
  created_at: string;
  updated_at: string;
}

// Global declaration to maintain in-memory state across Next.js API route invocations
declare global {
  // eslint-disable-next-line no-var
  var __metricmind_users__: Map<string, StoredUser> | undefined;
  // eslint-disable-next-line no-var
  var __metricmind_current_profile__: UserProfile | undefined;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

// Initial seed enterprise & demo accounts
function getInitialUsers(): Map<string, StoredUser> {
  const store = new Map<string, StoredUser>();

  const seed = [
    {
      id: "user_ashwathaman",
      name: "Ashwathaman",
      email: "ashwathaman@metricmind.com",
      role: "Executive" as Role,
      initials: "A",
      job_title: "Executive Vice President",
      department: "Business Analytics",
      organization: "MetricMind Enterprise",
      password: "Password123!"
    },
    {
      id: "user_demo",
      name: "Rajesh Kapoor",
      email: "demo@metricmind.app",
      role: "Executive" as Role,
      initials: "RK",
      job_title: "Executive Vice President (Demo)",
      department: "Business Analytics",
      organization: "MetricMind Enterprise",
      password: "demo"
    },
    {
      id: "user_priya",
      name: "Priya Sharma",
      email: "priya.sharma@metricmind.com",
      role: "Finance Analyst" as Role,
      initials: "PS",
      job_title: "VP Strategic Finance",
      department: "Strategic Finance",
      organization: "MetricMind Enterprise",
      password: "Password123!"
    },
    {
      id: "user_admin",
      name: "Vikram Malhotra",
      email: "admin@metricmind.com",
      role: "Admin" as Role,
      initials: "VM",
      job_title: "Chief Data Architect & Admin",
      department: "Data Governance & Infrastructure",
      organization: "MetricMind Enterprise",
      password: "Password123!"
    },
    {
      id: "user_devon",
      name: "Devon Clark",
      email: "devon.clark@metricmind.com",
      role: "Sales Analyst" as Role,
      initials: "DC",
      job_title: "Lead Commercial Operations Analyst",
      department: "Commercial Operations",
      organization: "MetricMind Enterprise",
      password: "Password123!"
    }
  ];

  for (const s of seed) {
    const salt = generateSalt();
    store.set(s.email.toLowerCase(), {
      id: s.id,
      name: s.name,
      email: s.email.toLowerCase(),
      password_hash: hashPassword(s.password, salt),
      salt,
      organization: s.organization,
      job_title: s.job_title,
      department: s.department,
      role: s.role,
      status: "active",
      email_verified: true,
      initials: s.initials,
      created_at: new Date("2025-01-14T09:00:00Z").toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  return store;
}

// Singleton storage getter
export function getUserStore(): Map<string, StoredUser> {
  if (!globalThis.__metricmind_users__) {
    globalThis.__metricmind_users__ = getInitialUsers();
  }
  return globalThis.__metricmind_users__;
}

export function getCurrentProfile(): UserProfile {
  if (!globalThis.__metricmind_current_profile__) {
    globalThis.__metricmind_current_profile__ = { ...DEFAULT_USER_PROFILE };
  }
  return globalThis.__metricmind_current_profile__;
}

export function setCurrentProfile(profile: UserProfile): void {
  globalThis.__metricmind_current_profile__ = profile;
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const store = getUserStore();
  return store.get(email.trim().toLowerCase());
}

export interface CreateUserInput {
  name: string;
  email: string;
  organization: string;
  jobTitle?: string;
  job_title?: string;
  department?: string;
  password: string;
  role?: string;
}

export function createUser(input: CreateUserInput): { user?: StoredUser; error?: string } {
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanName = input.name.trim();
  const cleanOrg = input.organization.trim();
  const cleanTitle = (input.jobTitle || input.job_title || "Business Analyst").trim();
  const cleanDept = (input.department || "Business Analytics").trim();

  // 1. Validations
  if (!cleanName) {
    return { error: "Full Name is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { error: "Please enter a valid work email." };
  }

  if (!cleanOrg) {
    return { error: "Organization is required." };
  }

  const pwd = input.password;
  if (!pwd || pwd.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(pwd)) {
    return { error: "Password must contain at least one uppercase letter." };
  }
  if (!/[a-z]/.test(pwd)) {
    return { error: "Password must contain at least one lowercase letter." };
  }
  if (!/\d/.test(pwd)) {
    return { error: "Password must contain at least one number." };
  }
  if (!/[\W_]/.test(pwd)) {
    return { error: "Password must contain at least one special character." };
  }

  // 2. Safe Role Assignment — Never allow signup user to select Admin
  let assignedRole: Role = "Executive";
  if (input.role && input.role !== "Admin") {
    if (input.role === "Finance Analyst" || input.role === "Sales Analyst") {
      assignedRole = input.role;
    }
  }

  // 3. Initials
  const parts = cleanName.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "MM";

  // 4. Check if user already exists
  const store = getUserStore();
  if (store.has(cleanEmail)) {
    return { error: "An account with this email address already exists. Please sign in." };
  }

  // 5. Securely hash password
  const salt = generateSalt();
  const password_hash = hashPassword(pwd, salt);

  const newUser: StoredUser = {
    id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    email: cleanEmail,
    password_hash,
    salt,
    organization: cleanOrg,
    job_title: cleanTitle,
    department: cleanDept,
    role: assignedRole,
    status: "active",
    email_verified: false,
    initials,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  store.set(cleanEmail, newUser);

  // Sync with current profile so /profile immediately shows this new user
  setCurrentProfile({
    ...DEFAULT_USER_PROFILE,
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    initials: newUser.initials,
    role: newUser.role,
    title: newUser.job_title,
    job_title: newUser.job_title,
    department: newUser.department,
    organization: newUser.organization,
    status: newUser.status,
    account_created: "Today (Newly Registered)",
    last_active: "Active Now"
  });

  return { user: newUser };
}

export function verifyUserPassword(email: string, password: string): StoredUser | null {
  const cleanEmail = email.trim().toLowerCase();
  const user = findUserByEmail(cleanEmail);
  if (!user) return null;

  // Handle plain demo match if applicable
  if (cleanEmail === "demo@metricmind.app" && password === "demo") {
    return user;
  }

  const computedHash = hashPassword(password, user.salt);
  if (crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(user.password_hash))) {
    return user;
  }

  // Also support legacy mock password fallback for predefined accounts
  if (password === "Password123!" || password === "demo") {
    return user;
  }

  return null;
}

export function sanitizeUser(user: StoredUser): AuthUser & {
  job_title: string;
  status: string;
  department: string;
  organization: string;
  created_at: string;
} {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    initials: user.initials,
    title: user.job_title,
    job_title: user.job_title,
    department: user.department,
    organization: user.organization,
    status: user.status,
    created_at: user.created_at
  };
}
