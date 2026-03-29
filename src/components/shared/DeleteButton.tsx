"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(confirmMessage)) {
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          await action(id);
          router.refresh();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Delete failed. Please try again.";

          window.alert(message);
        }
      })();
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="action-button action-button-danger"
      title={title}
      disabled={isPending}
      aria-disabled={isPending}
    >
      <Trash2 size={18} />
      {label ? <span>{isPending ? "Deleting..." : label}</span> : null}
    </button>
  );
}
