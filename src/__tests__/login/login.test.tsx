// src/app/login/__tests__/login.test.tsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "@/app/(auth-pages)/login/page";

// Mock the Next.js Image component for the test environment
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

// Mock the LoginForm component to isolate our test to the LoginPage.
// We just want to confirm that LoginPage *renders* it.
jest.mock("@/app/(auth-pages)/login/page", () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form Component</div>;
  };
});

describe("Login Page", () => {
  beforeEach(() => {
    // Render the page before each test
    render(<LoginPage />);
  });

  it("should successfully render the login form", () => {
    // Check if our mocked LoginForm is on the page.
    // This confirms the main purpose of the page is fulfilled.
    const loginForm = screen.getByTestId("login-form");
    expect(loginForm).toBeInTheDocument();
  });

  it("should not display the welcome panel on small screens (default view)", () => {
    // The welcome message and logo have the "hidden" class by default and "lg:block".
    // In Jest's default environment, they should not be in the document.
    // We use `queryBy` because it returns `null` instead of throwing an error if the element is not found.
    const heading = screen.queryByRole("heading", { name: /Benvenuto su ChurchLab/i });
    const logo = screen.queryByAltText("Logo ChurchLab");

    expect(heading).not.toBeInTheDocument();
    expect(logo).not.toBeInTheDocument();
  });
});