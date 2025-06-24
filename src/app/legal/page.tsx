"use client";

import { Button, Link } from "@heroui/react";
import { Accordion, AccordionItem } from "@heroui/react";
import PrivacyPolicy from "../privacy-policy/page";
import Terms from "../terms/page";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto my-9 p-6">
      <Accordion>
        <AccordionItem key="1" aria-label="Accordion 1" title="Privacy Policy">
          <PrivacyPolicy></PrivacyPolicy>
        </AccordionItem>

        <AccordionItem
          key="2"
          aria-label="Accordion 3"
          title="Termini e condizioni"
        >
          <Terms></Terms>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
