import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import "@testing-library/jest-dom";
import LoginForm from "@/app/(auth-pages)/login/loginForm";
import { loginAction } from "@/app/(auth-pages)/login/loginAction";

// Mock dependencies
jest.mock("next/navigation");
jest.mock("src/store/useUserStore");
jest.mock("@/app/(auth-pages)/login/loginAction");

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
};

const mockUserStore = {
  userData: { loggedIn: false, fetched: false },
  loading: false,
  fetchUser: jest.fn(),
};

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue("/login");
    (useUserStore as unknown as jest.Mock).mockReturnValue(mockUserStore);
    (loginAction as jest.Mock).mockResolvedValue({ success: true });
  });

  it("renders login form elements", () => {
    render(<LoginForm />);

    expect(screen.getByText("Accedi")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accedi" })).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText("Password");
    const toggleButton = screen.getByLabelText("toggle password visibility");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Accedi" }));

    await waitFor(() => {
      expect(loginAction).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("handles successful login", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Accedi" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/protected/dashboard/account");
      expect(mockUserStore.fetchUser).toHaveBeenCalled();
    });
  });

  it("displays error message on login failure", async () => {
    const user = userEvent.setup();
    (loginAction as jest.Mock).mockResolvedValue({
      success: false,
      error: "Invalid credentials",
    });

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Accedi" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("redirects logged in user", () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      ...mockUserStore,
      userData: { loggedIn: true, fetched: true },
      loading: false,
    });

    render(<LoginForm />);

    expect(mockPush).toHaveBeenCalledWith("/protected/dashboard/account");
  });

  it("handles form submission with Enter key", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");

    fireEvent.keyDown(screen.getByLabelText("Password"), {
      key: "Enter",
      code: "Enter",
    });

    await waitFor(() => {
      expect(loginAction).toHaveBeenCalled();
    });
  });

  it("disables submit button while submitting", async () => {
    const user = userEvent.setup();
    (loginAction as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 1000)
        )
    );

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");

    const submitButton = screen.getByRole("button", { name: "Accedi" });
    await user.click(submitButton);

    expect(
      screen.getByRole("button", { name: "Caricamento..." })
    ).toBeDisabled();
  });
});
