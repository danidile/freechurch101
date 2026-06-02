import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordForm from "@/app/[locale]/(auth-pages)/forgot-password/ForgotPasswordForm";

jest.mock("@/i18n/navigation", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock(
  "@/app/[locale]/(auth-pages)/forgot-password/forgotPasswordAction",
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);

jest.mock("@/app/[locale]/components/form-message", () => ({
  FormMessage: ({ message }: { message: { message: string } }) => (
    <p>{message.message}</p>
  ),
}));

const emptySearchParams = { message: "", error: "", success: "" };

describe("ForgotPasswordForm", () => {
  it("renders the Reset Password heading", () => {
    render(<ForgotPasswordForm searchParams={emptySearchParams} />);
    expect(screen.getByText(/reset password/i)).toBeInTheDocument();
  });

  it("renders the email input", () => {
    render(<ForgotPasswordForm searchParams={emptySearchParams} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<ForgotPasswordForm searchParams={emptySearchParams} />);
    expect(screen.getByRole("button", { name: /invia/i })).toBeInTheDocument();
  });

  it("renders back to login link", () => {
    render(<ForgotPasswordForm searchParams={emptySearchParams} />);
    expect(
      screen.getAllByText(/torna alla pagina di login/i).length
    ).toBeGreaterThan(0);
  });

  it("shows email sent confirmation after successful submission", async () => {
    const forgotPasswordAction = require(
      "@/app/[locale]/(auth-pages)/forgot-password/forgotPasswordAction"
    ).default;
    forgotPasswordAction.mockResolvedValueOnce({ success: true });

    render(<ForgotPasswordForm searchParams={emptySearchParams} />);
    await userEvent.type(
      screen.getByLabelText(/email/i),
      "mario@test.com"
    );
    await userEvent.click(screen.getByRole("button", { name: /invia/i }));

    await waitFor(() => {
      expect(screen.getByText(/email inviata/i)).toBeInTheDocument();
    });
  });

  it("shows error state when submission fails", async () => {
    const forgotPasswordAction = require(
      "@/app/[locale]/(auth-pages)/forgot-password/forgotPasswordAction"
    ).default;
    forgotPasswordAction.mockResolvedValueOnce({
      success: false,
      error: "Email non trovata",
    });

    render(<ForgotPasswordForm searchParams={emptySearchParams} />);
    await userEvent.type(
      screen.getByLabelText(/email/i),
      "nonexistent@test.com"
    );
    await userEvent.click(screen.getByRole("button", { name: /invia/i }));

    await waitFor(() => {
      expect(screen.getByText("Email non trovata")).toBeInTheDocument();
    });
  });
});
