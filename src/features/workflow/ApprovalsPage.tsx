import {
  Alert,
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
  type Approval,
  useDecideApprovalMutation,
  useListApprovalsQuery,
} from "../../api/workflow";
import { PageHeader } from "../../components/PageHeader";

const STATUS_COLOR: Record<string, "default" | "success" | "error"> = {
  PENDING: "default",
  APPROVED: "success",
  REJECTED: "error",
};

function DecisionForm({ approval }: { approval: Approval }) {
  const [comment, setComment] = useState("");
  const [decideApproval, decide] = useDecideApprovalMutation();

  const decide_ = async (event: FormEvent, decision: "APPROVE" | "REJECT") => {
    event.preventDefault();
    await decideApproval({
      id: approval.id,
      body: { decision, comment: comment || null },
    });
  };

  return (
    <Stack component="form" spacing={2}>
      <TextField
        label="Comment (optional)"
        multiline
        onChange={(event) => setComment(event.target.value)}
        value={comment}
      />
      {decide.error ? (
        <Alert severity="error">The decision could not be recorded.</Alert>
      ) : null}
      <Stack direction="row" spacing={1}>
        <Button
          color="success"
          disabled={decide.isLoading}
          onClick={(event) => void decide_(event, "APPROVE")}
          type="button"
          variant="contained"
        >
          Approve
        </Button>
        <Button
          color="error"
          disabled={decide.isLoading}
          onClick={(event) => void decide_(event, "REJECT")}
          type="button"
          variant="outlined"
        >
          Reject
        </Button>
      </Stack>
    </Stack>
  );
}

export function ApprovalsPage() {
  const { data, isLoading, error } = useListApprovalsQuery({ status: "PENDING" });

  return (
    <Stack spacing={3}>
      <PageHeader eyebrow="My queue" title="Approvals" />
      <Divider />
      {isLoading ? <CircularProgress aria-label="Loading approvals" /> : null}
      {error ? <Alert severity="error">Unable to load approvals.</Alert> : null}
      {data?.items.length === 0 ? (
        <Alert severity="info">No pending approvals. You&apos;re all caught up.</Alert>
      ) : null}
      {data?.items.map((approval) => (
        <Card key={approval.id} variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Stack alignItems="center" direction="row" justifyContent="space-between">
                <Typography component="h2" variant="h6">
                  {approval.subject_type} · {approval.subject_id}
                </Typography>
                <Chip
                  color={STATUS_COLOR[approval.status] ?? "default"}
                  label={approval.status}
                  size="small"
                />
              </Stack>
              {approval.policy_flags.length > 0 ? (
                <Stack spacing={1}>
                  {approval.policy_flags.map((flag, index) => (
                    <Alert key={index} severity="warning">
                      {flag.message}
                    </Alert>
                  ))}
                </Stack>
              ) : null}
              {approval.status === "PENDING" ? (
                <DecisionForm approval={approval} />
              ) : (
                <Typography color="text.secondary">
                  Decided {approval.decided_at ? new Date(approval.decided_at).toLocaleString() : ""}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
