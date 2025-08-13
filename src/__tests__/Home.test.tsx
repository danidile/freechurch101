// src/__tests__/Home.test.tsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";

// Mock Next.js components and functions (necessary for rendering)
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock the PWAInstallButton component
jest.mock("@/app/components/PWAInstallButton", () => {
  return function MockPWAInstallButton() {
    return <button>Installa App</button>;
  };
});

// We don't need to mock the HeroUI library if we focus on the content
// rendered inside them rather than the components themselves.

describe("Home Page", () => {
  // Render the component before each test
  beforeEach(() => {
    render(<Home />);
  });

  it("should render the main headline and introduction", () => {
    // Check for the main H1 heading
    expect(
      screen.getByRole("heading", {
        name: /La Tua Chiesa, Sempre Organizzata/i,
      })
    ).toBeInTheDocument();

    // Check for the introductory paragraph
    expect(
      screen.getByText(/Una piattaforma completa per pianificare servizi/i)
    ).toBeInTheDocument();
  });

  it("should display the key sections of the page", () => {
    // Check for the "Artists" section heading
    expect(
      screen.getByRole("heading", { name: /Artisti Italiani/i })
    ).toBeInTheDocument();

    // Check for the "Teams" section heading
    expect(
      screen.getByRole("heading", {
        name: /Uno spazio unico per tutti i team/i,
      })
    ).toBeInTheDocument();
  });

  it("should render all artist names", () => {
    const artistNames = [
      /SDV Worship/i,
      /Mirko & Giorgia/i,
      /Sounds Music Italia/i,
      /Nico Battaglia/i,
      /True Devotion/i,
    ];

    artistNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("should render all primary calls-to-action with correct links", () => {
    // Check for the PWA install button (doesn't need a link)
    expect(
      screen.getByRole("button", { name: /Installa App/i })
    ).toBeInTheDocument();

    // Check the main "Prova Gratis" button
    expect(screen.getByRole("link", { name: /Prova Gratis/i })).toHaveAttribute(
      "href",
      "/login"
    );

    // Check that there are 5 links to the artist pages
    const artistLinks = screen.getAllByRole("link", {
      name: /Testi e Accordi/i,
    });
    expect(artistLinks).toHaveLength(5);
    expect(artistLinks[0]).toHaveAttribute("href", "/artists/sdvworship");
  });

  it("should display the main promotional images", () => {
    // Check for the iPhone and Teams images by their alt text
    const images = screen.getAllByAltText(/Illustrazione Organizzazione/i);
    expect(images.length).toBeGreaterThanOrEqual(3);
  });
});
