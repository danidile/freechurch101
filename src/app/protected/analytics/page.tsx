// components/ChurchAnalyticsDashboard.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  fetchSummaryStats,
  fetchMostPlayedSongs,
  fetchTopServingMembers,
  fetchEventsOverTime,
  fetchTeamDistribution,
  fetchUpcomingEvents,
  SummaryStats,
  MostPlayedSong,
  TopServingMember,
  EventsOverTimeData,
  TeamDistributionData,
  UpcomingEvent,
} from "./analyticsQueries"; // Adjust this import path to your API file
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

interface StatCardProps {
  title: string;
  value: string | number | null | undefined;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      <p className="text-4xl font-bold text-gray-900 mt-2">{value || 0}</p>
    </div>
  );
};
interface MostPlayedSongsListProps {
  songs: MostPlayedSong[];
}

const MostPlayedSongsList: React.FC<MostPlayedSongsListProps> = ({ songs }) => {
  if (!songs || songs.length === 0) {
    return (
      <p className="text-gray-500">
        Nessuna canzone trovata nel periodo selezionato.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {songs.map((song, index) => (
        <li key={index} className="py-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-lg">{song.song_title}</p>
            <p className="text-sm text-gray-500">{song.author}</p>
          </div>
          <span className="text-blue-600 font-bold text-xl">
            {song.play_count}
          </span>
        </li>
      ))}
    </ul>
  );
};
interface UpcomingEventsListProps {
  events: UpcomingEvent[];
}

const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return <p className="text-gray-500">Nessun evento futuro trovato.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {events.map((event, index) => (
        <li key={index} className="py-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">{event.title}</h4>
            <span className="text-sm text-gray-500">
              {new Date(event.date || "").toLocaleDateString("it-IT", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
          <p className="text-gray-600">
            Orario:{" "}
            {event.start_hour ? event.start_hour.substring(0, 5) : "N/A"}
          </p>
        </li>
      ))}
    </ul>
  );
};

interface TopServingMembersListProps {
  members: TopServingMember[];
}

const TopServingMembersList: React.FC<TopServingMembersListProps> = ({
  members,
}) => {
  if (!members || members.length === 0) {
    return (
      <p className="text-gray-500">
        Nessun membro trovato nel periodo selezionato.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {members.map((member, index) => (
        <li key={index} className="py-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-lg">
              {member.name} {member.lastname}
            </p>
            <p className="text-sm text-gray-500">Team: {member.team}</p>
          </div>
          <span className="text-blue-600 font-bold text-xl">
            {member.service_count}
          </span>
        </li>
      ))}
    </ul>
  );
};

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useUserStore } from "@/store/useUserStore";

interface TeamDistributionChartProps {
  data: TeamDistributionData[];
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
];

const TeamDistributionChart: React.FC<TeamDistributionChartProps> = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        Nessun dato sulla distribuzione dei team.
      </p>
    );
  }

  // Filter out teams with a value of 0 to avoid a cluttered chart
  const chartData = data.filter((item) => (item.value || 0) > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface EventsChartProps {
  data: EventsOverTimeData[];
}

const EventsChart: React.FC<EventsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        Nessun dato sugli eventi trovato nel periodo selezionato.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="events"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          name="Eventi"
        />
        <Line
          type="monotone"
          dataKey="setlists"
          stroke="#82ca9d"
          name="Scalette"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

type TimeRange = "1month" | "3months" | "6months" | "1year";

export default function page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRange>("6months");
  const { userData } = useUserStore();
  const churchId = userData.church_id;

  // States to hold the fetched data
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [mostPlayedSongs, setMostPlayedSongs] = useState<MostPlayedSong[]>([]);
  const [topServingMembers, setTopServingMembers] = useState<
    TopServingMember[]
  >([]);
  const [eventsOverTime, setEventsOverTime] = useState<EventsOverTimeData[]>(
    []
  );
  const [teamDistribution, setTeamDistribution] = useState<
    TeamDistributionData[]
  >([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Starting fetch");
        const [stats, songs, members, events, teams, upcoming] =
          await Promise.all([
            fetchSummaryStats(churchId),
            fetchMostPlayedSongs(churchId, selectedTimeRange),
            fetchTopServingMembers(churchId, selectedTimeRange),
            fetchEventsOverTime(churchId, selectedTimeRange),
            fetchTeamDistribution(churchId),
            fetchUpcomingEvents(churchId),
          ]);

        setSummaryStats(stats);
        setMostPlayedSongs(songs);
        setTopServingMembers(members);
        setEventsOverTime(events);
        setTeamDistribution(teams);
        setUpcomingEvents(upcoming);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          "Impossibile caricare i dati della dashboard. Riprova più tardi."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedTimeRange]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Caricamento dati...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Church Dashboard</h1>

      {/* Time Range Selector */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setSelectedTimeRange("1month")}
          className={`px-4 py-2 rounded ${selectedTimeRange === "1month" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          1 Mese
        </button>
        <button
          onClick={() => setSelectedTimeRange("3months")}
          className={`px-4 py-2 rounded ${selectedTimeRange === "3months" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          3 Mesi
        </button>
        <button
          onClick={() => setSelectedTimeRange("6months")}
          className={`px-4 py-2 rounded ${selectedTimeRange === "6months" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          6 Mesi
        </button>
        <button
          onClick={() => setSelectedTimeRange("1year")}
          className={`px-4 py-2 rounded ${selectedTimeRange === "1year" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          1 Anno
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Songs" value={summaryStats?.totalSongs} />
        <StatCard title="Total Members" value={summaryStats?.totalMembers} />
        <StatCard title="Total Events" value={summaryStats?.totalEvents} />
        <StatCard title="Total Setlists" value={summaryStats?.totalSetlists} />
        <StatCard
          title="Avg. Songs per Setlist"
          value={summaryStats?.avgSongsPerSetlist}
        />
        <StatCard title="Active Teams" value={summaryStats?.activeTeams} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Most Played Songs */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Canzoni Più Suonate</h2>
          <MostPlayedSongsList songs={mostPlayedSongs} />
        </div>

        {/* Top Serving Members */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Membri Più Attivi</h2>
          <TopServingMembersList members={topServingMembers} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Events Over Time Chart */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Eventi e Scalette nel Tempo
          </h2>
          <EventsChart data={eventsOverTime} />
        </div>

        {/* Team Distribution Chart */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Distribuzione per Team</h2>
          <TeamDistributionChart data={teamDistribution} />
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Eventi Futuri</h2>
        <UpcomingEventsList events={upcomingEvents} />
      </div>
    </div>
  );
}
