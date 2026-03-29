"use client";

import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  action: (id: string) => Promise<void>;
  id: string;
  confirmMessage?: string;
  label?: string;
  title?: string;
}

export default function DeleteButton({
  action,
  id,
  confirmMessage = "Are you sure you want to delete this item?",
  label,
  title = "Delete",
}: DeleteButtonProps) {
  const handleDelete = async () => {
    if (window.confirm(confirmMessage)) {
      await action(id);
    }
  };

  return (
    <form action={handleDelete}>
      <button 
        type="submit"
        className="action-button action-button-danger"
        title={title}
      >
        <Trash2 size={18} />
        {label ? <span>{label}</span> : null}
      </button>
    </form>
  );
}
