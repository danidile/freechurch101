import Alert from '@mui/material/Alert';


export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {

  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">

    {"success" in message && (
      <Alert severity="error">{message.success}</Alert>      

    )}
    {"error" in message && (
        <Alert severity="error">{message.error}</Alert> 
    )}
    {"message" in message && (
      <Alert severity="error">{message.message}</Alert>     )}
  </div>
  );
}
