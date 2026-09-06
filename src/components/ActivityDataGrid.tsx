import { DataGrid, GridToolbar, type GridColDef } from "@mui/x-data-grid";
import { Card, CardContent, Chip, Typography } from "@mui/material";

export type ActivityRow = {
  id: string;
  actor: string;
  action: string;
  kind: "Approval" | "Expense" | "Time" | "Employee";
  timestamp: string;
};

const KIND_COLOR: Record<ActivityRow["kind"], "success" | "warning" | "info" | "default"> = {
  Approval: "success",
  Expense: "warning",
  Time: "info",
  Employee: "default",
};

const columns: GridColDef<ActivityRow>[] = [
  { field: "actor", headerName: "Actor", flex: 1, minWidth: 140 },
  { field: "action", headerName: "Activity", flex: 2, minWidth: 240 },
  {
    field: "kind",
    headerName: "Type",
    width: 130,
    renderCell: (params) => (
      <Chip color={KIND_COLOR[params.value as ActivityRow["kind"]]} label={params.value} size="small" />
    ),
  },
  { field: "timestamp", headerName: "When", width: 160 },
];

/**
 * A read-only activity table built on the free/Community edition of MUI X
 * Data Grid (sorting, filtering, quick search, column visibility, density
 * switcher, and CSV export are all included in Community — no Pro features
 * used). Rows are static, illustrative sample data for the dashboard "show"
 * content only; they are not wired to any live API and this table does not
 * replace the real Time/Expense/Approvals pages.
 */
export function ActivityDataGrid({ title, rows }: { title: string; rows: ActivityRow[] }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="subtitle1">
          {title}
        </Typography>
        <DataGrid
          autoHeight
          columns={columns}
          density="comfortable"
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          pageSizeOptions={[5, 10]}
          rows={rows}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          slots={{ toolbar: GridToolbar }}
          sx={{ border: 0, mt: 1 }}
        />
      </CardContent>
    </Card>
  );
}
