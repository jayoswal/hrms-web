import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type FormEvent, useState } from "react";

import { type EmployeeCreate, useCreateEmployeeMutation } from "../../api/identity";
import { useGetExpenseProfileQuery } from "../../api/expense";
import { useGetTimeProfileQuery } from "../../api/time";

const ROLE_OPTIONS: EmployeeCreate["roles"] = ["EMPLOYEE", "MANAGER", "FINANCE", "HR_ADMIN"];

const emptyForm = {
  email: "",
  full_name: "",
  grade: "",
  cost_center: "",
  manager_id: "",
  home_currency: "USD",
  roles: ["EMPLOYEE"] as EmployeeCreate["roles"],
};

function ProvisioningStatusPanel({ employeeId }: { employeeId: string }) {
  const [timeReady, setTimeReady] = useState(false);
  const [expenseReady, setExpenseReady] = useState(false);

  const timeProfile = useGetTimeProfileQuery(employeeId, {
    pollingInterval: timeReady ? 0 : 1500,
  });
  const expenseProfile = useGetExpenseProfileQuery(employeeId, {
    pollingInterval: expenseReady ? 0 : 1500,
  });

  if (timeProfile.data && !timeReady) {
    setTimeReady(true);
  }
  if (expenseProfile.data && !expenseReady) {
    setExpenseReady(true);
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="subtitle1">
          Provisioning status
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            color={timeReady ? "success" : "default"}
            icon={timeReady ? undefined : <CircularProgress size={14} />}
            label={timeReady ? "Time profile ready" : "Time profile provisioning…"}
          />
          <Chip
            color={expenseReady ? "success" : "default"}
            icon={expenseReady ? undefined : <CircularProgress size={14} />}
            label={expenseReady ? "Expense profile ready" : "Expense profile provisioning…"}
          />
        </Stack>
        {timeReady && expenseReady ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Employee fully provisioned across Time and Expense.
          </Alert>
        ) : (
          <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
            Waiting for the employee.created event to be consumed by downstream services.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export function CreateEmployeePage() {
  const [form, setForm] = useState(emptyForm);
  const [createEmployee, create] = useCreateEmployeeMutation();
  const [createdId, setCreatedId] = useState<string | null>(null);

  const toggleRole = (role: EmployeeCreate["roles"][number]) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((value) => value !== role)
        : [...prev.roles, role],
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await createEmployee({
      email: form.email,
      full_name: form.full_name,
      grade: form.grade,
      cost_center: form.cost_center,
      manager_id: form.manager_id || null,
      home_currency: form.home_currency,
      roles: form.roles,
    }).unwrap();
    setCreatedId(result.id);
    setForm(emptyForm);
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 640 }}>
      <Typography component="h1" variant="h4">
        Create employee
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Stack component="form" onSubmit={(event) => void submit(event)} spacing={2}>
            <TextField
              label="Email"
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              type="email"
              value={form.email}
            />
            <TextField
              label="Full name"
              onChange={(event) => setForm({ ...form, full_name: event.target.value })}
              required
              value={form.full_name}
            />
            <TextField
              label="Grade"
              onChange={(event) => setForm({ ...form, grade: event.target.value })}
              required
              value={form.grade}
            />
            <TextField
              label="Cost center"
              onChange={(event) => setForm({ ...form, cost_center: event.target.value })}
              required
              value={form.cost_center}
            />
            <TextField
              helperText="Optional; UUID of an existing employee"
              label="Manager ID"
              onChange={(event) => setForm({ ...form, manager_id: event.target.value })}
              value={form.manager_id}
            />
            <TextField
              label="Home currency"
              onChange={(event) => setForm({ ...form, home_currency: event.target.value })}
              required
              value={form.home_currency}
            />
            <Box>
              <Typography gutterBottom variant="subtitle2">
                Roles
              </Typography>
              <FormGroup row>
                {ROLE_OPTIONS.map((role) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.roles.includes(role)}
                        onChange={() => toggleRole(role)}
                      />
                    }
                    key={role}
                    label={role}
                  />
                ))}
              </FormGroup>
            </Box>
            {create.error ? (
              <Alert severity="error">The employee could not be created.</Alert>
            ) : null}
            <Button
              disabled={create.isLoading || form.roles.length === 0}
              type="submit"
              variant="contained"
            >
              Create employee
            </Button>
          </Stack>
        </CardContent>
      </Card>
      {createdId ? <ProvisioningStatusPanel employeeId={createdId} /> : null}
    </Stack>
  );
}
