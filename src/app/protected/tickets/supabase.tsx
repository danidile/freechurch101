// lib/supabase.ts
import { createClient } from "@/utils/supabase/client";

export const supabase = await createClient();

// Types
export interface Ticket {
  id?: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  user_email: string;
  user_name: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  ticket_id: string;
  sender_name: string;
  sender_email: string;
  content: string;
  is_admin: boolean;
  created_at: string;
}

export const createTicket = async (ticket: any) => {
  const { data, error } = await supabase
    .from("tickets")
    .insert([ticket])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Database functions
export const ticketService = {
  // Get all tickets for a user
  async getUserTickets(userEmail: string) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all tickets (admin only)
  async getAllTickets() {
    console.log("getAllTickets");
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    } else {
      console.log("data", data);
    }
    return data;
  },

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: Ticket["status"]) {
    const { data, error } = await supabase
      .from("tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", ticketId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get single ticket
  async getTicket(ticketId: string) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", ticketId)
      .single();

    if (error) throw error;
    return data;
  },
};

export const messageService = {
  // Send a message
  async sendMessage(message: Omit<Message, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("ticket_messages")
      .insert([message])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get messages for a ticket
  async getTicketMessages(ticketId: string) {
    const { data, error } = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Subscribe to new messages for a ticket
  subscribeToMessages(ticketId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`ticket_messages:${ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ticket_messages",
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();
  },
};
