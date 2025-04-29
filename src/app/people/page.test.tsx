import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import PeopleDrawerList from "./peopleDrawerList";
import React from "react"; // Add this line

test("renders a heading", async () => {
  await act(async () => {
    render(
      <PeopleDrawerList
        profile={{
          map: undefined,
          id: "",
          username: "",
          email: "",
          name: "Mario",
          lastname: "Rossi",
          role: 0,
          isTemp: false,
        }}
        userData={{
          loggedIn: true,
          id: "",
          email: "",
          name: "",
          role: "admin",
          lastname: "",
          church_id: "",
          church_name: "",
          pending_church_confirmation: false,
        }}
      />
    );
  });

  expect(screen.getByText(/Mario Rossi/)).toBeInTheDocument();

});


import App from "./page";



jest.mock("@/utils/supabase/getUserData", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve([
    {
      loggedIn: true,
      id: "123",
      email: "test@example.com",
      name: "Test",
      // lastname, church_id, church_name are missing
      role: "admin",
      pending_church_confirmation: false,
    },
  ])),
}));


jest.mock("@/hooks/GET/getProfilesByChurch", () => ({
  __esModule: true,
  getProfilesByChurch: jest.fn().mockResolvedValue([
    {
      id: "1",
      username: "mario123",
      email: "mario@example.com",
      name: "Mario",
      lastname: "Rossi",
      role: 0,
      isTemp: false,
    },
  ]),
}));



describe("App", () => {
  it("should render even if some user fields are missing", async () => {
    await act(async () => {
      render(<App />);
    });

    expect(await screen.findByText(/People/i)).toBeInTheDocument();
  });
});