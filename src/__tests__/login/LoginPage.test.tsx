// __tests__/login/LoginPage.test.tsx
import LoginPage from "@/app/(auth-pages)/login/page";
import { render, screen } from "@testing-library/react";

// Mock the LoginForm component
jest.mock("@/app/(auth-pages)/login/loginForm", () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form</div>;
  };
});

// Mock GetParamsMessage component
jest.mock("@/app/components/getParams", () => {
  return function MockGetParamsMessage() {
    return <div data-testid="params-message">Params Message</div>;
  };
});

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({ alt, ...props }: any) {
    return <img alt={alt} {...props} />;
  };
});


describe("LoginPage", () => {
  it("renders welcome section and login form", () => {
    render(<LoginPage />);

    expect(screen.getByText("Benvenuto su")).toBeInTheDocument();
    expect(screen.getByText("ChurchLab")).toBeInTheDocument();
    expect(
      screen.getByText(/La Tua Chiesa, Sempre Organizzata/)
    ).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders logo image", () => {
    render(<LoginPage />);

    const logo = screen.getByAltText("Logo ChurchLab");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("width", "140");
    expect(logo).toHaveAttribute("height", "80");
  });

  it("has correct layout structure", () => {
    render(<LoginPage />);

    const mainContainer = screen.getByText("Benvenuto su").closest("div");
    expect(mainContainer).toHaveClass("flex", "flex-row");
  });
});
