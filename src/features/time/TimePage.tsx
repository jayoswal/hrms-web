import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type FormEvent, useState } from "react";

import {
  type TimeEntryInput,
  type Timesheet,
  useCreateTimesheetMutation,
  useListTimesheetsQuery,
  usePtoBalanceQuery,
  useSubmitTimesheetMutation,
  useUpdateTimesheetMutation,
} from "../../api/time";

function initialEntries(timesheet: Timesheet): TimeEntryInput[] {
  if (timesheet.entries.length > 0) {
    return timesheet.entries.map(({ work_date, hours, project_code, note }) => ({
      work_date,
      hours,
      project_code,
      note,
    }));
  }
  return [
    {
      work_date: timesheet.period_start,
      hours: 8,
      project_code: "ATLAS",
      note: null,
    },
  ];
}

function DraftEditor({ timesheet }: { timesheet: Timesheet }) {
  const [entries, setEntries] = useState<TimeEntryInput[]>(() =>
    initialEntries(timesheet),
  );
  const [updateTimesheet, update] = useUpdateTimesheetMutation();
  const [submitTimesheet, submit] = useSubmitTimesheetMutation();

  const updateEntry = (
    index: number,
    field: keyof TimeEntryInput,
    value: string | number | null,
  ) => {
    setEntries((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    await updateTimesheet({
      id: timesheet.id,
      body: { entries },
    });
  };

  const saveAndSubmit = async () => {
    try {
      await updateTimesheet({
        id: timesheet.id,
        body: { entries },
      }).unwrap();
      await submitTimesheet(timesheet.id).unwrap();
    } catch {
      // RTK Query exposes the request error through the mutation state below.
    }
  };

  return (
    <Stack component="form" onSubmit={save} spacing={2}>
      {entries.map((entry, index) => (
        <Stack direction={{ sm: "row" }} key={`${entry.work_date}-${index}`} spacing={2}>
          <TextField
            InputLabelProps={{ shrink: true }}
            label="Work date"
            onChange={(event) => updateEntry(index, "work_date", event.target.value)}
            required
            type="date"
            value={entry.work_date}
          />
          <TextField
            inputProps={{ max: 24, min: 0.25, step: 0.25 }}
            label="Hours"
            onChange={(event) => updateEntry(index, "hours", Number(event.target.value))}
            required
            type="number"
            value={entry.hours}
          />
          <TextField
            label="Project code"
            onChange={(event) => updateEntry(index, "project_code", event.target.value)}
            required
            value={entry.project_code}
          />
          <TextField
            label="Note"
            onChange={(event) => updateEntry(index, "note", event.target.value || null)}
            value={entry.note ?? ""}
          />
          <Button
            disabled={entries.length === 1}
            onClick={() =>
              setEntries((current) =>
                current.filter((_, entryIndex) => entryIndex !== index),
              )
            }
          >
            Remove
          </Button>
        </Stack>
      ))}
      {update.error || submit.error ? (
        <Alert severity="error">The draft could not be saved or submitted.</Alert>
      ) : null}
      <Stack direction="row" spacing={1}>
        <Button
          disabled={entries.length >= 7}
          onClick={() =>
            setEntries((current) => [
              ...current,
              {
                work_date: timesheet.period_start,
                hours: 8,
                project_code: "ATLAS",
                note: null,
              },
            ])
          }
          variant="text"
        >
          Add entry
        </Button>
        <Button disabled={update.isLoading} type="submit" variant="outlined">
          Save entries
        </Button>
        <Button
          disabled={update.isLoading || submit.isLoading || entries.length === 0}
          onClick={() => void saveAndSubmit()}
          type="button"
          variant="contained"
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
}

export function TimePage() {
  const { data, isLoading, error } = useListTimesheetsQuery();
  const { data: balance } = usePtoBalanceQuery();
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [createTimesheet, create] = useCreateTimesheetMutation();

  const createDraft = async (event: FormEvent) => {
    event.preventDefault();
    const result = await createTimesheet({
      period_start: periodStart,
      period_end: periodEnd,
      entries: [],
    });
    if (!result.error) {
      setPeriodStart("");
      setPeriodEnd("");
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography color="text.secondary" variant="overline">
          My work
        </Typography>
        <Typography component="h1" variant="h4">
          Timesheets
        </Typography>
      </Box>
      {balance ? (
        <Card variant="outlined">
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              PTO balance
            </Typography>
            <Typography variant="h5">{balance.balance_days} days</Typography>
          </CardContent>
        </Card>
      ) : null}
      <Card variant="outlined">
        <CardContent>
          <Stack component="form" onSubmit={createDraft} spacing={2}>
            <Typography component="h2" variant="h6">
              New timesheet
            </Typography>
            <Stack direction={{ sm: "row" }} spacing={2}>
              <TextField
                InputLabelProps={{ shrink: true }}
                label="Period start"
                onChange={(event) => setPeriodStart(event.target.value)}
                required
                type="date"
                value={periodStart}
              />
              <TextField
                InputLabelProps={{ shrink: true }}
                label="Period end"
                onChange={(event) => setPeriodEnd(event.target.value)}
                required
                type="date"
                value={periodEnd}
              />
              <Button disabled={create.isLoading} type="submit" variant="contained">
                Create draft
              </Button>
            </Stack>
            {create.error ? <Alert severity="error">Unable to create timesheet.</Alert> : null}
          </Stack>
        </CardContent>
      </Card>
      <Divider />
      {isLoading ? <CircularProgress aria-label="Loading timesheets" /> : null}
      {error ? <Alert severity="error">Unable to load timesheets.</Alert> : null}
      {data?.items.length === 0 ? (
        <Alert severity="info">No timesheets yet. Create your first draft above.</Alert>
      ) : null}
      {data?.items.map((timesheet) => (
        <Card key={timesheet.id} variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Stack alignItems="center" direction="row" justifyContent="space-between">
                <Typography component="h2" variant="h6">
                  {timesheet.period_start} – {timesheet.period_end}
                </Typography>
                <Chip label={timesheet.status.replace("_", " ")} size="small" />
              </Stack>
              <Typography color="text.secondary">
                {timesheet.total_hours} hours · {timesheet.overtime_hours} overtime
              </Typography>
              {timesheet.status === "DRAFT" ? (
                <DraftEditor timesheet={timesheet} />
              ) : (
                <Typography>{timesheet.entries.length} submitted entries</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
