"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  Laptop,
  Smartphone,
  Download,
  Sliders,
  Settings,
  Bell,
  Camera,
  Trash2,
  Save,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Coins,
  Calendar,
  Lock,
  RefreshCw,
  X,
  FileText
} from "lucide-react";
import { UserProfile, Role } from "@/types";
import { DEFAULT_USER_PROFILE } from "@/lib/mockData";
import { api } from "@/lib/api";
import { NavTab } from "@/components/layout/Sidebar";

interface ProfileViewProps {
  userRole?: Role;
  isDemoMode?: boolean;
  onAskQuestion?: (q: string) => void;
  onNavigateTab?: (tab: NavTab) => void;
  onProfileUpdated?: (updated: UserProfile) => void;
}

interface ToastInfo {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userRole = "Executive",
  isDemoMode = true,
  onAskQuestion,
  onNavigateTab,
  onProfileUpdated
}) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    department: "",
    organization: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Preferences & notifications local state
  const [preferences, setPreferences] = useState(DEFAULT_USER_PROFILE.preferences);
  const [notifications, setNotifications] = useState(DEFAULT_USER_PROFILE.notifications);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Password modal state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Toast notifications
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Hidden file input for avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: "success" | "error" | "info", message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const data = await api.getProfile();
      setProfile(data);
      setPreferences(data.preferences);
      setNotifications(data.notifications);
    } catch (e) {
      console.warn("Using default profile state", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone || "+91 98765 43210",
      title: profile.title || "VP Executive Analytics",
      department: profile.department,
      organization: profile.organization
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const validateEditForm = () => {
    const errors: Record<string, string> = {};
    if (!editForm.name.trim()) {
      errors.name = "Full Name cannot be empty.";
    }
    if (!editForm.email.trim()) {
      errors.email = "Email cannot be empty.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = "Please enter a valid corporate email address.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEditForm()) return;

    setSavingProfile(true);
    try {
      const initials = editForm.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "RK";

      const updated = await api.updateProfile({
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        title: editForm.title.trim(),
        department: editForm.department.trim(),
        organization: editForm.organization.trim(),
        initials
      });

      setProfile(updated);
      onProfileUpdated?.(updated);
      setIsEditModalOpen(false);
      showToast("success", "Profile updated successfully.");
    } catch (err) {
      showToast("error", "Failed to update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Avatar handling (Upload demo preview, Remove, Use initials)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Image file exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const updated = await api.updateProfile({ avatar_url: dataUrl });
      setProfile(updated);
      onProfileUpdated?.(updated);
      showToast("success", "Profile picture updated successfully.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    const updated = await api.updateProfile({ avatar_url: undefined });
    setProfile(updated);
    onProfileUpdated?.(updated);
    showToast("info", "Profile avatar reset to initials.");
  };

  const handleSavePreferences = async () => {
    setSavingPreferences(true);
    try {
      await api.updatePreferences(preferences);
      showToast("success", "Display and localization preferences saved.");
    } catch (e) {
      showToast("error", "Failed to save preferences.");
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      await api.updatePreferences(undefined, notifications);
      showToast("success", "Notification preferences saved.");
    } catch (e) {
      showToast("error", "Failed to save notifications.");
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleToggleNotification = (key: keyof UserProfile["notifications"]) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleToggle2FA = async () => {
    const nextState = !profile.security.two_factor_enabled;
    const updated = {
      ...profile,
      security: {
        ...profile.security,
        two_factor_enabled: nextState
      }
    };
    setProfile(updated);
    await api.updateProfile(updated);
    showToast(
      "info",
      nextState
        ? "Two-Factor Authentication (2FA) enabled via Authenticator App."
        : "Two-Factor Authentication disabled."
    );
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordError("");
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("success", "Password updated successfully (Demo Mode simulated).");
  };

  const handleDownloadMyData = () => {
    const exportData = {
      account: profile,
      system: "MetricMind Agentic Semantic BI Engine",
      exported_at: new Date().toISOString(),
      compliance_certification: "SOC2 Type II Governed BI",
      lineage_retention_days: 90
    };

    const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `metricmind_profile_export_${profile.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("success", "Profile data export downloaded successfully.");
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all animate-in fade-in slide-in-from-top-3 ${
              toast.type === "success"
                ? "bg-slate-900/95 border-emerald-500/40 text-emerald-300"
                : toast.type === "error"
                ? "bg-slate-900/95 border-rose-500/40 text-rose-300"
                : "bg-slate-900/95 border-sky-500/40 text-sky-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {toast.type === "info" && <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />}
              <span className="text-xs font-medium text-slate-100">{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 1. Breadcrumb & Page Top */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
            <button
              onClick={() => onNavigateTab?.("overview")}
              className="hover:text-slate-200 transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-sky-400 font-semibold">Profile</span>
          </nav>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <User className="w-6 h-6 text-sky-400" />
            Profile
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your personal information, preferences, and MetricMind account settings.
          </p>
        </div>

        {/* Demo Mode / Environment Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isDemoMode && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              DEMO MODE
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/70 text-slate-300 border border-slate-700/60">
            Enterprise Tier
          </span>
        </div>
      </div>

      {/* 2. Profile Header (Glassmorphic Card) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/40 border border-slate-800/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
            {/* Large circular avatar with hover overlay */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-600 to-emerald-500 p-0.5 shadow-xl shadow-sky-500/10 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                ) : (
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-200">
                    {profile.initials || "RK"}
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div
                className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-lg"
                title="Status: Active"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>

              {/* Avatar hover action buttons */}
              <div className="absolute inset-0 rounded-2xl bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-sky-500/30 hover:bg-sky-500/50 text-[10px] font-semibold text-sky-200 transition-colors w-full justify-center"
                >
                  <Camera className="w-3 h-3" />
                  Upload
                </button>
                {profile.avatar_url && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-rose-500/30 hover:bg-rose-500/50 text-[10px] font-semibold text-rose-200 transition-colors w-full justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* User Meta Information */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                  {profile.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  {profile.role}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>

              <p className="text-xs text-slate-300 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profile.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  {profile.department}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {profile.organization}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-sky-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Enterprise Analytics Access
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 shrink-0">
            <button
              onClick={handleOpenEditModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/20 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setIsSessionsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-medium transition-all"
            >
              <Laptop className="w-4 h-4 text-slate-400" />
              Sessions (2)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Personal Info, Role & Access, Account Info, Activity) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 3. Personal Information Card */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-slate-100">Personal Information</h3>
              </div>
              <button
                onClick={handleOpenEditModal}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                Modify Details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                <span className="text-[11px] text-slate-400">Full Name</span>
                <p className="font-semibold text-slate-100">{profile.name}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                <span className="text-[11px] text-slate-400">Corporate Email</span>
                <p className="font-mono text-slate-200 truncate">{profile.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                <span className="text-[11px] text-slate-400">Phone Number</span>
                <p className="font-mono text-slate-200">{profile.phone || "+91 98765 43210"}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                <span className="text-[11px] text-slate-400">Job Title</span>
                <p className="font-semibold text-slate-200">{profile.title || "VP Executive Analytics"}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                <span className="text-[11px] text-slate-400">Department</span>
                <p className="font-semibold text-slate-200">{profile.department}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                <span className="text-[11px] text-slate-400">Organization</span>
                <p className="font-semibold text-slate-200">{profile.organization}</p>
              </div>
            </div>
          </div>

          {/* 4. Role & Access (RBAC) */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">Role & Access Control</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Current Role:</span>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {profile.role}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Permissions are governed by the MetricMind Semantic Layer gateway. Direct warehouse queries are intercepted and validated against your assigned role.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Permitted */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Granted Permissions
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {profile.role_access.permissions.map((perm, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Restricted */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                  <XCircle className="w-3.5 h-3.5" />
                  Restricted Capabilities
                </div>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {profile.role_access.restricted.map((rest, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-rose-400 font-bold text-xs shrink-0">×</span>
                      <span>{rest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Need administrative rights to change semantic models?</span>
              <button
                onClick={() => onNavigateTab?.("trust-center")}
                className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
              >
                Request Role Upgrade <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 5. Account Information */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-slate-100">Account Information</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">ID: {profile.id}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <span className="text-[10px] text-slate-500 block mb-0.5">Account Status</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <span className="text-[10px] text-slate-500 block mb-0.5">Role Tier</span>
                <span className="text-slate-200 font-semibold">{profile.role}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <span className="text-[10px] text-slate-500 block mb-0.5">Environment</span>
                <span className="font-mono text-amber-300 font-semibold">
                  {isDemoMode ? "Demo Mode" : "Production"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <span className="text-[10px] text-slate-500 block mb-0.5">Account Created</span>
                <span className="text-slate-300 font-mono">{profile.account_created}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <span className="text-[10px] text-slate-500 block mb-0.5">Last Active</span>
                <span className="text-slate-300 font-mono">{profile.last_active}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <span className="text-[10px] text-slate-500 block mb-0.5">Audit Retention</span>
                <span className="text-sky-300 font-mono">SOC2 90 Days</span>
              </div>
            </div>
          </div>

          {/* 6. Activity Summary */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-100">Activity Summary</h3>
              </div>
              <span className="text-[11px] text-slate-400">Current Billing Cycle</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                <span className="text-xl sm:text-2xl font-black text-sky-400 font-mono">
                  {profile.activity.queries_this_month}
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  Queries This Month
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">
                  {profile.activity.saved_insights}
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">Saved Insights</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {profile.activity.reports_viewed}
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">Reports Viewed</span>
              </div>
            </div>

            {/* Last Query Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Last Governed Query Executed
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <p className="text-xs text-sky-300 font-mono italic">
                  "{profile.activity.last_query}"
                </p>
                {onAskQuestion && (
                  <button
                    onClick={() => onAskQuestion(profile.activity.last_query)}
                    className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition-colors flex items-center gap-1 self-start sm:self-auto"
                  >
                    Re-run in Ask <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Preferences, Notifications, Security, Data & Privacy) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 7. Preferences Card */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-slate-100">Preferences</h3>
              </div>
              <button
                onClick={handleSavePreferences}
                disabled={savingPreferences}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold border border-sky-500/30 transition-colors disabled:opacity-50"
              >
                <Save className="w-3 h-3" />
                {savingPreferences ? "Saving..." : "Save"}
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Theme */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Theme Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["dark", "light", "system"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPreferences({ ...preferences, theme: t })}
                      className={`py-2 px-3 rounded-xl border text-center font-medium capitalize transition-all ${
                        preferences.theme === t
                          ? "bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm"
                          : "bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="English">English (United States / UK)</option>
                  <option value="Hindi">English (India - En-IN)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="French">French (Français)</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Timezone
                </label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
                  <option value="UTC">UTC (+00:00)</option>
                  <option value="America/New_York">America/New York (EST/EDT)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                </select>
              </div>

              {/* Date Format */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Date Format
                </label>
                <select
                  value={preferences.date_format}
                  onChange={(e) => setPreferences({ ...preferences, date_format: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (24/09/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2026-09-24)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (09/24/2026)</option>
                </select>
              </div>

              {/* Default Currency */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium flex items-center gap-1">
                  <Coins className="w-3 h-3 text-slate-400" />
                  Default Currency
                </label>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="INR">₹ INR (Indian Rupee - Lakhs / Crores)</option>
                  <option value="USD">$ USD (US Dollar - Millions / Billions)</option>
                  <option value="EUR">€ EUR (Euro - Millions)</option>
                  <option value="GBP">£ GBP (British Pound)</option>
                </select>
              </div>

              {/* Default Dashboard */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Default Landing View</label>
                <select
                  value={preferences.default_dashboard}
                  onChange={(e) => setPreferences({ ...preferences, default_dashboard: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="Executive Analytics">Executive Analytics Studio</option>
                  <option value="Executive Overview">Executive Overview</option>
                  <option value="Ask MetricMind">Ask MetricMind AI Chat</option>
                  <option value="Governed Metrics">Governed Semantic Catalog</option>
                </select>
              </div>
            </div>
          </div>

          {/* 8. Notification Preferences */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">Notification Preferences</h3>
              </div>
              <button
                onClick={handleSaveNotifications}
                disabled={savingNotifications}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors disabled:opacity-50"
              >
                <Save className="w-3 h-3" />
                {savingNotifications ? "Saving..." : "Save Preferences"}
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "ai_analysis_completed" as const,
                  label: "AI Analysis Completed",
                  desc: "Instant push alert when complex semantic queries finish running"
                },
                {
                  key: "saved_insight_updates" as const,
                  label: "Saved Insight Updates",
                  desc: "Notification when periodic data updates change saved metrics"
                },
                {
                  key: "data_source_alerts" as const,
                  label: "Data Source Alerts",
                  desc: "Warehouse sync anomalies, dbt mart delays or latency spikes"
                },
                {
                  key: "governance_alerts" as const,
                  label: "Governance Alerts",
                  desc: "Interception of rogue SQL attempts or metric verification changes"
                },
                {
                  key: "weekly_executive_summary" as const,
                  label: "Weekly Executive Summary",
                  desc: "Automated Monday executive brief with regional margin breakdowns"
                }
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleToggleNotification(item.key)}
                  className="flex items-start justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-slate-700/80 cursor-pointer transition-all"
                >
                  <div className="space-y-0.5 pr-3">
                    <span className="text-xs font-semibold text-slate-200 block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-400 block">{item.desc}</span>
                  </div>
                  <div
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 mt-0.5 ${
                      notifications[item.key] ? "bg-sky-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications[item.key] ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 9. Security Section */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-100">Security & Credentials</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Compliant
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Password */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <div>
                  <span className="text-[11px] text-slate-400 block">Password</span>
                  <span className="font-mono text-slate-200 font-bold tracking-widest">
                    ••••••••••••••••
                  </span>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  Change Password
                </button>
              </div>

              {/* 2FA */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <div>
                  <span className="text-[11px] text-slate-400 block">
                    Two-Factor Authentication (2FA)
                  </span>
                  <span
                    className={`font-semibold ${
                      profile.security.two_factor_enabled ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {profile.security.two_factor_enabled ? "Enabled (Authenticator App)" : "Disabled"}
                  </span>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    profile.security.two_factor_enabled
                      ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30"
                      : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {profile.security.two_factor_enabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </div>

              {/* Active Sessions */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <div>
                  <span className="text-[11px] text-slate-400 block">Active Login Sessions</span>
                  <span className="text-slate-200 font-semibold">
                    {profile.security.active_sessions} Active Devices
                  </span>
                </div>
                <button
                  onClick={() => setIsSessionsModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  Manage Sessions
                </button>
              </div>

              {/* Last Login */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Last Successful Login</span>
                <span className="font-mono text-slate-300">{profile.security.last_login}</span>
              </div>
            </div>
          </div>

          {/* 10. Data & Privacy Card */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">Data & Privacy</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                GDPR & SOC2
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70">
                <span className="text-slate-400">Data Access Scope</span>
                <span className="font-semibold text-sky-400">Enterprise Analytics</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70">
                <span className="text-slate-400">Analytics History Logging</span>
                <span className="text-emerald-400 font-semibold">Enabled</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70">
                <span className="text-slate-400">Semantic AI Personalization</span>
                <span className="text-emerald-400 font-semibold">Enabled</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDownloadMyData}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                Download My Data
              </button>
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 transition-colors"
              >
                Privacy Controls
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400" />
                <h3 className="text-base font-bold text-slate-100">Edit Profile Information</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4 text-xs">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Full Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g. Rajesh Kapoor"
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${
                    formErrors.name ? "border-rose-500" : "border-slate-800"
                  } text-slate-100 text-xs focus:outline-none focus:border-sky-500`}
                />
                {formErrors.name && (
                  <p className="text-[11px] text-rose-400 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Corporate Email *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="e.g. rajesh.kapoor@metricmind.com"
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${
                    formErrors.email ? "border-rose-500" : "border-slate-800"
                  } text-slate-100 text-xs focus:outline-none focus:border-sky-500`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-rose-400 font-medium">{formErrors.email}</p>
                )}
              </div>

              {/* Phone & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Job Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Executive / VP"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Department & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    placeholder="Business Analytics"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Organization</label>
                  <input
                    type="text"
                    value={editForm.organization}
                    onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                    placeholder="MetricMind Enterprise"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL (Safe Demo Mode) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Change Password</h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                Demo Mode: Changing password simulates safe enterprise credential rotation.
              </div>

              {passwordError && (
                <p className="text-[11px] text-rose-400 font-medium">{passwordError}</p>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Current Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="showPass"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700"
                />
                <label htmlFor="showPass" className="text-slate-400 cursor-pointer">
                  Show passwords
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE SESSIONS MODAL */}
      {isSessionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-sky-400" />
                <h3 className="text-base font-bold text-slate-100">Active Login Sessions</h3>
              </div>
              <button
                onClick={() => setIsSessionsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                      Chrome on macOS (Sonoma)
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        Current Session
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      IP: 103.21.244.18 • Bengaluru, India • Active Now
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-400" />
                  <div>
                    <span className="font-semibold text-slate-100">
                      MetricMind Mobile (iOS 18)
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      IP: 49.37.12.8 • Mumbai, India • Last active 2h ago
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    showToast("info", "Mobile session revoked.");
                    setProfile((prev) => ({
                      ...prev,
                      security: { ...prev.security, active_sessions: 1 }
                    }));
                  }}
                  className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium text-[11px] border border-rose-500/30"
                >
                  Revoke
                </button>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-800">
                <button
                  onClick={() => setIsSessionsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY SETTINGS MODAL */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">Privacy & Compliance Controls</h3>
              </div>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  SOC2 Type II Semantic Auditing
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Every query executed through MetricMind is logged with cryptographic lineage signatures. No customer PII or raw warehouse transaction tables are exported to LLMs.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  Zero LLM Data Retention Guarantee
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Our LLM gateway runs on dedicated enterprise VPC endpoints with zero-data-retention agreements. Your query intent is evaluated only in transient memory.
                </p>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-800">
                <button
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
