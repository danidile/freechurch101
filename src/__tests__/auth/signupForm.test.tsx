import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "@/app/[locale]/(auth-pages)/signup/[churchId]/signupForm";

jest.mock("@/i18n/navigation", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock(
  "@/app/[locale]/(auth-pages)/signup/[churchId]/signupAction",
  () => ({
    signupAction: jest.fn(),
  })
);

const mockChurchData = {
  id: "church-123",
  church_name: "Chiesa di Test",
  logo: null,
};

describe("SignupForm", () => {
  it("renders the church name in the heading", () => {
    render(<SignupForm churchData={mockChurchData} />);
    expect(screen.getByText(/Chiesa di Test/i)).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<SignupForm churchData={mockChurchData} />);
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cognome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data di nascita/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<SignupForm churchData={mockChurchData} />);
    expect(
      screen.getByRole("button", { name: /crea account/i })
    ).toBeInTheDocument();
  });

  it("does not render logo when churchData.logo is null", () => {
    render(<SignupForm churchData={mockChurchData} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders logo when churchData.logo is provided", () => {
    render(
      <SignupForm churchData={{ ...mockChurchData, logo: "logo.png" }} />
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    render(<SignupForm churchData={mockChurchData} />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(
      screen.getByRole("button", { name: /toggle password visibility/i })
    );
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("shows success state after successful signup", async () => {
    const { signupAction } = require(
      "@/app/[locale]/(auth-pages)/signup/[churchId]/signupAction"
    );
    signupAction.mockResolvedValueOnce({ success: true });

    render(<SignupForm churchData={mockChurchData} />);
    await userEvent.type(screen.getByLabelText(/^nome/i), "Mario");
    await userEvent.type(screen.getByLabelText(/cognome/i), "Rossi");
    await userEvent.type(screen.getByLabelText(/email/i), "mario@test.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.type(screen.getByLabelText(/telefono/i), "+39 333 1234567");
    await userEvent.type(screen.getByLabelText(/data di nascita/i), "1990-01-01");
    await userEvent.click(screen.getByRole("button", { name: /crea account/i }));

    await waitFor(() => {
      expect(screen.getByText(/registrazione completata/i)).toBeInTheDocument();
    });
  });

  it("shows error message when signup fails", async () => {
    const { signupAction } = require(
      "@/app/[locale]/(auth-pages)/signup/[churchId]/signupAction"
    );
    signupAction.mockResolvedValueOnce({
      success: false,
      error: "Email già in uso",
    });

    render(<SignupForm churchData={mockChurchData} />);
    await userEvent.type(screen.getByLabelText(/^nome/i), "Mario");
    await userEvent.type(screen.getByLabelText(/cognome/i), "Rossi");
    await userEvent.type(screen.getByLabelText(/email/i), "mario@test.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.type(screen.getByLabelText(/telefono/i), "+39 333 1234567");
    await userEvent.type(screen.getByLabelText(/data di nascita/i), "1990-01-01");
    await userEvent.click(screen.getByRole("button", { name: /crea account/i }));

    await waitFor(() => {
      expect(screen.getByText("Email già in uso")).toBeInTheDocument();
    });
  });
});
