import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  selectFilteredLogs,
  setSearch,
  setType,
  setStartFrom,
  setStartTo,
} from "../model/filtersSlice";
import { deleteLog } from "../model/logsSlice";
import { useState } from "react";
import { useToast } from "@/shared/ui/Toaster";
import { FILTER_TYPE_OPTIONS } from "@/shared/constants/serviceTypes";
import Ellipsis from "@/shared/ui/Ellipsis";
import { ColGroup } from "../lib/tableLayout";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import Select from "@/shared/ui/form/Select";
import DateFilterInput from "@/shared/ui/form/DateFilterInput";
import EditLogDialog from "./EditLogDialog";
import TypeBadge from "./TypeBadge";

export default function LogsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const logs = useSelector(selectFilteredLogs);
  const f = useSelector((s: RootState) => s.filters);
  const [editId, setEditId] = useState<string | null>(null);

  // state for delete confirmation
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const askDelete = (id: string) => setPendingDeleteId(id);
  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    dispatch(deleteLog(pendingDeleteId));
    toast({ variant: "success", title: "Service log deleted" });
    setPendingDeleteId(null);
  };

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="card p-3 grid md:grid-cols-4 gap-2">
        <input
          className="input"
          placeholder="Search…"
          value={f.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
        <Select
          options={FILTER_TYPE_OPTIONS as any}
          value={f.type}
          onChange={(v) => dispatch(setType(v as any))}
        />
        <DateFilterInput
          value={f.startFrom ?? null}
          onChange={(v) => dispatch(setStartFrom(v))}
          placeholder="Start date"
        />
        <DateFilterInput
          value={f.startTo ?? null}
          onChange={(v) => dispatch(setStartTo(v))}
          placeholder="End date"
        />
      </div>

      {/* Table */}
      <div className="card overflow-auto">
        <table className="table w-full" style={{ tableLayout: "fixed" }}>
          <ColGroup />
          <thead className="bg-gray-50 dark:bg-gray-800/60 dark:text-gray-300">
            <tr>
              <th className="th">Provider</th>
              <th className="th">Order</th>
              <th className="th">Car</th>
              <th className="th">Odometer</th>
              <th className="th">Engine h.</th>
              <th className="th">Start</th>
              <th className="th">End</th>
              <th className="th">Type</th>
              <th className="th">Description</th>
              <th className="th"></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="tr">
                <td className="td overflow-hidden">
                  <Ellipsis text={l.providerId} lines={2} />
                </td>
                <td className="td overflow-hidden">
                  <Ellipsis text={l.serviceOrder} lines={1} />
                </td>
                <td className="td overflow-hidden">
                  <Ellipsis text={l.carId} lines={1} />
                </td>
                <td className="td overflow-hidden">
                  <Ellipsis text={String(l.odometer)} lines={1} />
                </td>
                <td className="td overflow-hidden">
                  <Ellipsis text={String(l.engineHours)} lines={1} />
                </td>
                <td className="td overflow-hidden">
                  <Ellipsis text={l.startDate} lines={1} />
                </td>
                <td className="td overflow-hidden">
                  <Ellipsis text={l.endDate} lines={1} />
                </td>
                <td className="td">
                  <TypeBadge type={l.type} />
                </td>
                <td className="td overflow-hidden">
                  <Ellipsis text={l.serviceDescription} lines={2} />
                </td>
                <td className="td">
                  <div className="flex gap-2">
                    <button className="btn-xs" onClick={() => setEditId(l.id)}>
                      Edit
                    </button>
                    <button
                      className="btn-xs-danger"
                      onClick={() => askDelete(l.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td className="td text-center text-gray-500 py-8" colSpan={10}>
                  No records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditLogDialog
        id={editId}
        onOpenChange={(open) => !open && setEditId(null)}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        onOpenChange={(o) => !o && setPendingDeleteId(null)}
        title="Delete service log?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
