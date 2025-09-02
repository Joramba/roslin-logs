import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  selectFilteredLogs,
  setSearch,
  setType,
  setStartFrom,
  setStartTo,
} from "./filtersSlice";
import EditLogDialog from "./EditLogDialog";
import { deleteLog } from "./logsSlice";
import { useState } from "react";
import { useToast } from "@/components/ui/Toaster";
import DateFilterInput from "@/components/form/DateFilterInput";
import Select from "@/components/form/Select";
import { FILTER_TYPE_OPTIONS } from "@/constants/serviceTypes";
import Ellipsis from "@/components/ui/Ellipsis";
import TypeBadge from "./TypeBadge";
import { ColGroup } from "./tableLayout";

export default function LogsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const logs = useSelector(selectFilteredLogs);
  const f = useSelector((s: RootState) => s.filters);
  const [editId, setEditId] = useState<string | null>(null);

  const onDelete = (id: string) => {
    dispatch(deleteLog(id));
    toast({ variant: "success", title: "Service log deleted" });
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

          <thead className="bg-gray-50">
            <tr>
              <th className="th whitespace-nowrap">Provider</th>
              <th className="th whitespace-nowrap">Order</th>
              <th className="th whitespace-nowrap">Car</th>
              <th className="th whitespace-nowrap">Odometer</th>
              <th className="th whitespace-nowrap">Engine h.</th>
              <th className="th whitespace-nowrap">Start</th>
              <th className="th whitespace-nowrap">End</th>
              <th className="th whitespace-nowrap">Type</th>
              <th className="th whitespace-nowrap">Description</th>
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
                      onClick={() => onDelete(l.id)}
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
    </div>
  );
}
