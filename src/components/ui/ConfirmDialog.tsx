import * as Dialog from "@radix-ui/react-dialog";
import { useId } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  danger?: boolean;
};

/** Confirmation dialog built with Radix Dialog and accessible Description. */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  danger = false,
}: Props) {
  const descId = useId();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-[120]" />
        <Dialog.Content
          aria-describedby={description ? descId : undefined}
          className="
            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[min(92vw,520px)] card p-5 shadow-xl ring-1 ring-black/10 z-[130]
          "
        >
          <div className="flex items-start justify-between">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="rounded-lg p-2 text-xl leading-none hover:bg-black/5 cursor-pointer"
            >
              ×
            </Dialog.Close>
          </div>

          {description && (
            <Dialog.Description
              id={descId}
              className="mt-2 text-sm text-gray-600"
            >
              {description}
            </Dialog.Description>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="btn-outline">{cancelText}</button>
            </Dialog.Close>
            <button
              className={danger ? "btn-danger" : "btn"}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
