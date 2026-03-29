"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="btn btn-outline"
      style={{ 
        padding: '0.5rem 1rem', 
        gap: '0.5rem',
        color: '#ef4444',
        borderColor: 'rgba(239, 68, 68, 0.2)'
      }}
    >
      <LogOut size={16} /> Log Out
    </button>
  );
}
