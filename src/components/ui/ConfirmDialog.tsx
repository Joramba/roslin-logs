import * as Dialog from "@radix-ui/react-dialog";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  const descId = "confirm-desc";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-[100]" />
        <Dialog.Content
          role="alertdialog"
          aria-describedby={descId}
          className="
            card
            bg-white text-zinc-900 border border-zinc-200
            dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700
            z-[110] p-4 md:p-5 shadow-xl ring-1 ring-black/10
            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[min(92vw,560px)]
          "
        >
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="rounded-md px-2 py-1 text-base leading-none hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              ×
            </Dialog.Close>
          </div>

          <Dialog.Description
            id={descId}
            className="mt-3 text-sm text-gray-700 dark:text-gray-200"
          >
            {description}
          </Dialog.Description>

          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close className="btn-outline">{cancelText}</Dialog.Close>
            <button
              className="btn-danger"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
