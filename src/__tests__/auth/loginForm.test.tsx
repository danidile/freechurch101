import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/app/[locale]/(auth-pages)/login/loginForm";

// Mock i18n navigation
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/login",
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock Zustand user store
jest.mock("@/store/useUserStore", () => ({
  useUserStore: () => ({
    userData: { loggedIn: false, fetched: true },
    loading: false,
    fetchUser: jest.fn(),
  }),
}));

// Mock login server action
jest.mock(
  "@/app/[locale]/(auth-pages)/login/loginAction",
  () => ({
    loginAction: jest.fn(),
  })
);

describe("LoginForm", () => {
  it("renders the form heading", () => {
    render(<LoginForm />);
    expect(screen.getByText("Accedi")).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: /accedi/i })).toBeInTheDocument();
  });

  it("renders forgot password link", () => {
    render(<LoginForm />);
    expect(screen.getByText(/password dimenticata/i)).toBeInTheDocument();
  });

  it("toggles password visibility when eye icon is clicked", async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button", {
      name: /toggle password visibility/i,
    });
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("shows error message when login fails", async () => {
    const { loginAction } = require(
      "@/app/[locale]/(auth-pages)/login/loginAction"
    );
    loginAction.mockResolvedValueOnce({
      success: false,
      error: "Credenziali non valide",
    });

    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /accedi/i }));

    await waitFor(() => {
      expect(screen.getByText("Credenziali non valide")).toBeInTheDocument();
    });
  });

  it("does not show error message initially", () => {
    render(<LoginForm />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
