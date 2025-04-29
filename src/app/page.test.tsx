import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "./page";
import React from "react"; // Add this line

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(2);
  });
});
