"use client";

import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  action: (id: string) => Promise<void>;
  id: string;
  confirmMessage?: string;
}

export default function DeleteButton({ action, id, confirmMessage = "Are you sure you want to delete this item?" }: DeleteButtonProps) {
  const handleDelete = async (formData: FormData) => {
    if (window.confirm(confirmMessage)) {
      await action(id);
    }
  };

  return (
    <form action={handleDelete}>
      <button 
        type="submit"
        className="text-muted" 
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
      >
        <Trash2 size={18} />
      </button>
    </form>
  );
}
