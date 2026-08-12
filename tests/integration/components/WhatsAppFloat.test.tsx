import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import WhatsAppFloat from "@/components/WhatsAppFloat";

describe("WhatsAppFloat", () => {
  it("opens the chat panel on click and links to wa.me", async () => {
    render(<WhatsAppFloat />);

    expect(screen.queryByText("Start Chat")).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText("Open WhatsApp chat"));

    const link = screen.getByRole("link", { name: /start chat/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("https://wa.me/9779857043288?text="));

    await userEvent.click(screen.getAllByLabelText("Close WhatsApp chat")[0]);
    expect(screen.queryByText("Start Chat")).not.toBeInTheDocument();
  });
});
