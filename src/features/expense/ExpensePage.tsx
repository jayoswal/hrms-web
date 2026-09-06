import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type FormEvent, useState } from "react";

import {
  type Category,
  type ExpenseReport,
  useAddExpenseLineMutation,
  useCreateExpenseReportMutation,
  useListCategoriesQuery,
  useListExpenseReportsQuery,
  useSubmitExpenseReportMutation,
  useUpdateExpenseReportMutation,
} from "../../api/expense";

function DraftExpenseEditor({
  report,
  categories,
}: {
  report: ExpenseReport;
  categories: Category[];
}) {
  const [title, setTitle] = useState(report.title);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(report.home_currency);
  const [spentOn, setSpentOn] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [updateReport, update] = useUpdateExpenseReportMutation();
  const [addLine, adding] = useAddExpenseLineMutation();
  const [submitReport, submit] = useSubmitExpenseReportMutation();

  const saveTitle = async (event: FormEvent) => {
    event.preventDefault();
    await updateReport({ id: report.id, body: { title } });
  };

  const add = async (event: FormEvent) => {
    event.preventDefault();
    const result = await addLine({
      id: report.id,
      body: {
        category_id: categoryId,
        amount_minor: Math.round(Number(amount) * 100),
        currency: currency.toUpperCase(),
        spent_on: spentOn,
        receipt_url: receiptUrl || null,
      },
    });
    if (!result.error) {
      setAmount("");
      setReceiptUrl("");
    }
  };

  return (
    <Stack spacing={2}>
      <Stack component="form" direction="row" onSubmit={saveTitle} spacing={1}>
        <TextField
          fullWidth
          label="Report title"
          onChange={(event) => setTitle(event.target.value)}
          value={title}
        />
        <Button disabled={update.isLoading} type="submit" variant="outlined">
          Save
        </Button>
      </Stack>
      <Stack component="form" onSubmit={add} spacing={2}>
        <Stack direction={{ sm: "row" }} spacing={2}>
          <TextField
            label="Category"
            onChange={(event) => setCategoryId(event.target.value)}
            required
            select
            value={categoryId}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            inputProps={{ min: 0.01, step: 0.01 }}
            label="Amount"
            onChange={(event) => setAmount(event.target.value)}
            required
            type="number"
            value={amount}
          />
          <TextField
            inputProps={{ maxLength: 3 }}
            label="Currency"
            onChange={(event) => setCurrency(event.target.value)}
            required
            value={currency}
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            label="Spent on"
            onChange={(event) => setSpentOn(event.target.value)}
            required
            type="date"
            value={spentOn}
          />
        </Stack>
        <TextField
          label="Receipt URL"
          onChange={(event) => setReceiptUrl(event.target.value)}
          type="url"
          value={receiptUrl}
        />
        <Button disabled={adding.isLoading || !categoryId} type="submit" variant="outlined">
          Add line
        </Button>
      </Stack>
      {update.error || adding.error || submit.error ? (
        <Alert severity="error">The report could not be updated or submitted.</Alert>
      ) : null}
      {report.lines.map((line) => (
        <Typography key={line.id}>
          {line.category_code}: {(line.amount_minor / 100).toFixed(2)} {line.currency}
        </Typography>
      ))}
      <Button
        disabled={submit.isLoading || report.lines.length === 0}
        onClick={() => void submitReport(report.id)}
        variant="contained"
      >
        Submit report
      </Button>
    </Stack>
  );
}

export function ExpensePage() {
  const { data, isLoading, error } = useListExpenseReportsQuery();
  const { data: categories = [] } = useListCategoriesQuery();
  const [title, setTitle] = useState("");
  const [createReport, create] = useCreateExpenseReportMutation();

  const createDraft = async (event: FormEvent) => {
    event.preventDefault();
    const result = await createReport({ title });
    if (!result.error) {
      setTitle("");
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography color="text.secondary" variant="overline">
          My work
        </Typography>
        <Typography component="h1" variant="h4">
          Expense reports
        </Typography>
      </Box>
      <Card variant="outlined">
        <CardContent>
          <Stack component="form" direction={{ sm: "row" }} onSubmit={createDraft} spacing={2}>
            <TextField
              fullWidth
              label="New report title"
              onChange={(event) => setTitle(event.target.value)}
              required
              value={title}
            />
            <Button disabled={create.isLoading} type="submit" variant="contained">
              Create draft
            </Button>
          </Stack>
          {create.error ? <Alert severity="error">Unable to create report.</Alert> : null}
        </CardContent>
      </Card>
      <Divider />
      {isLoading ? <CircularProgress aria-label="Loading expense reports" /> : null}
      {error ? <Alert severity="error">Unable to load expense reports.</Alert> : null}
      {data?.items.length === 0 ? (
        <Alert severity="info">No expense reports yet. Create a draft above.</Alert>
      ) : null}
      {data?.items.map((report) => (
        <Card key={report.id} variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Stack alignItems="center" direction="row" justifyContent="space-between">
                <Typography component="h2" variant="h6">
                  {report.title}
                </Typography>
                <Chip label={report.status.replace("_", " ")} size="small" />
              </Stack>
              <Typography color="text.secondary">
                {(report.total_home_minor / 100).toFixed(2)} {report.home_currency}
              </Typography>
              {report.status === "DRAFT" ? (
                <DraftExpenseEditor categories={categories} report={report} />
              ) : (
                <Typography>{report.lines.length} submitted lines</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
