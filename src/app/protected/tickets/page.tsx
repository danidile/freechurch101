"use client";
import React, { useState, useEffect, useRef, FC } from "react";
import {
  createTicket,
  Message,
  messageService,
  supabase,
  Ticket,
  ticketService,
} from "./supabase";
import { useUserStore } from "@/store/useUserStore";
import { Toaster, toast } from "react-hot-toast";
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  UserCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// ============================================================================
// Main Page Component: TicketSystem
// Manages state and data fetching, composing the UI from smaller components.
// ============================================================================
export default function TicketSystem() {
  const { userData } = useUserStore();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock authentication and initial data load
  useEffect(() => {
    // In a real app, this would come from a proper auth context
    if (userData.email === "danidile94@gmail.com") {
      setIsAdmin(true);
    }
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, userData.email]);

  // Subscribe to real-time messages for the selected ticket
  useEffect(() => {
    if (!selectedTicket) return;

    const subscription = messageService.subscribeToMessages(
      selectedTicket.id,
      (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    );

    // Unsubscribe on component unmount or when selectedTicket changes
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedTicket]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = isAdmin
        ? await ticketService.getAllTickets()
        : await ticketService.getUserTickets(userData.email);
      setTickets(data || []);
    } catch (error) {
      toast.error("Failed to load tickets.");
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (ticketId: string) => {
    try {
      const data = await messageService.getTicketMessages(ticketId);
      setMessages(data || []);
    } catch (error) {
      toast.error("Failed to load messages.");
      console.error("Error loading messages:", error);
    }
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    loadMessages(ticket.id);
  };

  const handleCreateTicket = async (newTicketData: {
    title: string;
    description: string;
    priority: Ticket["priority"];
  }) => {
    try {
      const ticket = await createTicket({
        ...newTicketData,
        status: "open",
        user_email: userData.email,
        user_name: userData.name,
      });
      setTickets((prev) => [ticket, ...prev]);
      setShowCreateForm(false);
      toast.success("Ticket created successfully!");
    } catch (error) {
      toast.error("Failed to create ticket.");
      console.error("Error creating ticket:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedTicket) return;
    try {
      await messageService.sendMessage({
        ticket_id: selectedTicket.id,
        sender_name: userData.name,
        sender_email: userData.email,
        content,
        is_admin: isAdmin,
      });
    } catch (error) {
      toast.error("Failed to send message.");
      console.error("Error sending message:", error);
    }
  };

  const handleStatusUpdate = async (
    ticketId: string,
    status: Ticket["status"]
  ) => {
    if (!isAdmin) return;
    try {
      await ticketService.updateTicketStatus(ticketId, status);
      setTickets((prevTickets) =>
        prevTickets.map((t) => (t.id === ticketId ? { ...t, status } : t))
      );
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket((prev) => (prev ? { ...prev, status } : null));
      }
      toast.success("Ticket status updated!");
    } catch (error) {
      toast.error("Failed to update status.");
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex h-screen flex-col font-sans">
        <header className="p-4">
          <div className="mx-auto flex-wrap flex max-w-7xl items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isAdmin ? "Admin Dashboard" : "Support Center"}
              </h1>
              <p className="text-sm text-gray-500">
                Benvenuto, {userData.name}
              </p>
            </div>
            {!isAdmin && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex my-4 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusIcon className="h-5 w-5" />
                Crea Nuovo Ticket
              </button>
            )}
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 lg:grid-cols-3">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              <TicketList
                tickets={tickets}
                selectedTicket={selectedTicket}
                onSelectTicket={handleSelectTicket}
                isAdmin={isAdmin}
              />
              <TicketDetails
                ticket={selectedTicket}
                messages={messages}
                isAdmin={isAdmin}
                onSendMessage={handleSendMessage}
                onStatusUpdate={handleStatusUpdate}
                currentUserName={userData.name}
              />
            </>
          )}
        </main>
      </div>

      {showCreateForm && (
        <CreateTicketModal
          onClose={() => setShowCreateForm(false)}
          onCreate={handleCreateTicket}
        />
      )}
    </>
  );
}

// ============================================================================
// Component: TicketList & TicketListItem
// ============================================================================
interface TicketListProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket) => void;
  isAdmin: boolean;
}

const TicketList: FC<TicketListProps> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  isAdmin,
}) => (
  <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm lg:col-span-1">
    <div className="border-b bg-gray-50 p-4">
      <h2 className="text-lg font-semibold text-gray-800">
        {isAdmin ? "All Tickets" : "Your Tickets"} ({tickets.length})
      </h2>
    </div>
    <div className="flex-1 divide-y overflow-y-auto">
      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <TicketListItem
            key={ticket.id}
            ticket={ticket}
            isSelected={selectedTicket?.id === ticket.id}
            onSelect={() => onSelectTicket(ticket)}
          />
        ))
      ) : (
        <div className="p-6 text-center text-gray-500">No tickets found.</div>
      )}
    </div>
  </div>
);

interface TicketListItemProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: () => void;
}

const TicketListItem: FC<TicketListItemProps> = ({
  ticket,
  isSelected,
  onSelect,
}) => {
  const getPriorityClass = (p: Ticket["priority"]): string =>
    ({
      urgent: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    })[p] || "bg-gray-100 text-gray-800";

  const getStatusClass = (s: Ticket["status"]): string =>
    ({
      open: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      closed: "bg-gray-100 text-gray-500",
    })[s] || "bg-gray-100 text-gray-800";

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${isSelected ? "border-l-4 border-blue-600 bg-blue-50" : ""}`}
    >
      <div className="flex items-start justify-between">
        <h6 className="pr-2 font-semibold text-gray-900">{ticket.title}</h6>
        <span
          className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getPriorityClass(ticket.priority)}`}
        >
          {ticket.priority}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
        {ticket.description}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span
          className={`rounded-full px-2.5 py-0.5 font-medium capitalize ${getStatusClass(ticket.status)}`}
        >
          {ticket.status.replace("_", " ")}
        </span>
        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

// ============================================================================
// Component: TicketDetails
// ============================================================================
interface TicketDetailsProps {
  ticket: Ticket | null;
  messages: Message[];
  isAdmin: boolean;
  onSendMessage: (content: string) => void;
  onStatusUpdate: (ticketId: string, status: Ticket["status"]) => void;
  currentUserName: string;
}

const TicketDetails: FC<TicketDetailsProps> = ({
  ticket,
  messages,
  isAdmin,
  onSendMessage,
  onStatusUpdate,
  currentUserName,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    onSendMessage(newMessage);
    setNewMessage("");
  };

  if (!ticket) return <EmptyState />;

  return (
    <div className="lg:col-span-2 flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="border-b bg-gray-50 p-4">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {ticket.title}
            </h3>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <UserCircleIcon className="h-4 w-4" /> {ticket.user_name}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" /> Opened:{" "}
                {new Date(ticket.created_at).toLocaleString()}
              </span>
            </div>
          </div>
          {isAdmin && (
            <select
              value={ticket.status}
              onChange={(e) =>
                onStatusUpdate(ticket.id, e.target.value as Ticket["status"])
              }
              className="aselect rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwnMessage={msg.sender_name === currentUserName}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {ticket.status !== "closed" && (
        <div className="border-t bg-white p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewMessage(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              placeholder="Type your message..."
              className=" ainput flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              aria-label="Send message" // This is the key addition
              className="rounded-full p-2 ..."
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Component: MessageBubble
// ============================================================================
interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageBubble: FC<MessageBubbleProps> = ({ message, isOwnMessage }) => (
  <div
    className={`flex items-end my-1 gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`w-fit max-w-lg rounded-xl px-4 py-2 ${isOwnMessage ? "rounded-br-none bg-blue-50 text-white" : "rounded-bl-none bg-gray-50 text-gray-800"}`}
    >
      {!isOwnMessage && (
        <p className="text-xs font-bold text-gray-600 mb-1">
          {message.sender_name}
          {message.is_admin && (
            <span className="ml-2 text-xs font-semibold text-red-600">
              (Admin)
            </span>
          )}
        </p>
      )}
      <p className="sm:text-sm ">{message.content}</p>
      <p
        className={`text-xs mt-1 ${isOwnMessage ? "text-blue-900" : "text-gray-500"} text-right`}
      >
        {new Date(message.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  </div>
);

// ============================================================================
// Component: CreateTicketModal
// ============================================================================
interface CreateTicketModalProps {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description: string;
    priority: Ticket["priority"];
  }) => void;
}

interface NewTicketState {
  title: string;
  description: string;
  priority: Ticket["priority"];
}

const CreateTicketModal: FC<CreateTicketModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [ticketData, setTicketData] = useState<NewTicketState>({
    title: "",
    description: "",
    priority: "medium",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({
      ...prev,
      [name]: value as Ticket["priority"] | string,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ticketData.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    onCreate(ticketData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create New Ticket</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              name="title"
              value={ticketData.title}
              onChange={handleChange}
              className="ainput w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={ticketData.description}
              onChange={handleChange}
              rows={4}
              className=" ainput w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              value={ticketData.priority}
              onChange={handleChange}
              className="aselect w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// UI Helper Components
// ============================================================================
const EmptyState: FC = () => (
  <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-white p-8 text-center text-gray-500">
    <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300" />
    <h3 className="mt-4 text-lg font-semibold text-gray-800">
      Select a Ticket
    </h3>
    <p className="mt-1 text-sm">
      Choose a ticket from the list to view the conversation and details.
    </p>
  </div>
);

const SkeletonLoader: FC = () => (
  <>
    <div className="lg:col-span-1 space-y-2 rounded-lg border bg-white p-4 shadow-sm animate-pulse">
      <div className="h-8 w-3/4 rounded bg-gray-200"></div>
      <div className="h-16 rounded bg-gray-200"></div>
      <div className="h-16 rounded bg-gray-200"></div>
      <div className="h-16 rounded bg-gray-200"></div>
    </div>
    <div className="lg:col-span-2 flex flex-col rounded-lg border bg-white p-4 shadow-sm animate-pulse">
      <div className="h-8 w-1/2 rounded bg-gray-200 mb-4"></div>
      <div className="flex-1 space-y-4">
        <div className="h-12 w-3/5 rounded bg-gray-200"></div>
        <div className="h-12 w-4/5 rounded bg-gray-200 ml-auto"></div>
        <div className="h-12 w-2/5 rounded bg-gray-200"></div>
      </div>
    </div>
  </>
);
