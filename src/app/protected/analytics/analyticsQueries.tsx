import { createClient } from "@/utils/supabase/client";

type TimeRange = "1month" | "3months" | "6months" | "1year";
// This top-level await is likely the cause of your issue, but the prompt
// specifies not to change the existing code, so we will only add logs.

/**
 * Calculates the start date based on the selected time range.
 * @param {TimeRange} timeRange - The selected time range.
 * @returns {Date} The calculated start date.
 */
const getStartDate = (timeRange: TimeRange): Date => {
  const now = new Date();
  switch (timeRange) {
    case "1month":
      now.setMonth(now.getMonth() - 1);
      break;
    case "3months":
      now.setMonth(now.getMonth() - 3);
      break;
    case "6months":
      now.setMonth(now.getMonth() - 6);
      break;
    case "1year":
      now.setFullYear(now.getFullYear() - 1);
      break;
    default:
      now.setFullYear(now.getFullYear() - 1);
      break;
  }
  return now;
};

// --- Data Types for Dashboard Components ---
export type SummaryStats = {
  totalSongs: number | null;
  totalMembers: number | null;
  totalEvents: number | null;
  totalSetlists: number | null;
  avgSongsPerSetlist: string | number;
  activeTeams: number | null;
};

export type MostPlayedSong = {
  song_title: string;
  author: string | null;
  play_count: number;
};

export type TopServingMember = {
  name: string | null;
  lastname: string | null;
  team: string;
  service_count: number;
};

export type EventsOverTimeData = {
  month: string;
  events: number;
  setlists: number;
};

export type TeamDistributionData = {
  name: string | null;
  value: number | null;
  color: string;
};

export type UpcomingEvent = {
  title: string;
  date: string | null;
  start_hour: string | null;
  attendees: number;
};

// --- Supabase API Functions ---

/**
 * Fetches summary statistics for a specific church.
 */
export const fetchSummaryStats = async (
  churchId: string
): Promise<SummaryStats | null> => {
  console.log("fetchSummaryStats started for churchId:", churchId);
  const supabase = await createClient();
  try {
    const { count: totalSongs, error: songsError } = await supabase
      .from("songs")
      .select("*", { count: "exact", head: true })
      .eq("church", churchId);
    if (songsError) {
      console.error("Error fetching total songs:", songsError);
      throw songsError;
    }
    console.log("Fetched total songs:", totalSongs);

    const { count: totalMembers, error: membersError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("church", churchId);
    if (membersError) {
      console.error("Error fetching total members:", membersError);
      throw membersError;
    }
    console.log("Fetched total members:", totalMembers);

    const { count: totalEvents, error: eventsError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("church_id", churchId);
    if (eventsError) {
      console.error("Error fetching total events:", eventsError);
      throw eventsError;
    }
    console.log("Fetched total events:", totalEvents);

    const { count: totalSetlists, error: setlistsError } = await supabase
      .from("setlist")
      .select("*", { count: "exact", head: true })
      .eq("church", churchId);
    if (setlistsError) {
      console.error("Error fetching total setlists:", setlistsError);
      throw setlistsError;
    }
    console.log("Fetched total setlists:", totalSetlists);

    const { data: setlistIdsData, error: setlistIdsError } = await supabase
      .from("setlist")
      .select("id")
      .eq("church", churchId);
    if (setlistIdsError) {
      console.error("Error fetching setlist IDs:", setlistIdsError);
      throw setlistIdsError;
    }
    console.log("Fetched setlist IDs:", setlistIdsData?.length);

    const setlistIds = setlistIdsData?.map((s) => s.id) || [];
    const { data: setlistSongs, error: setlistSongsError } = await supabase
      .from("setlist-songs")
      .select("id, setlist_id")
      .in("setlist_id", setlistIds);
    if (setlistSongsError) {
      console.error("Error fetching setlist songs:", setlistSongsError);
      throw setlistSongsError;
    }
    console.log("Fetched setlist songs:", setlistSongs?.length);

    const { count: activeTeams, error: teamsError } = await supabase
      .from("church-teams")
      .select("*", { count: "exact", head: true })
      .eq("church", churchId);
    if (teamsError) {
      console.error("Error fetching active teams:", teamsError);
      throw teamsError;
    }
    console.log("Fetched active teams:", activeTeams);

    // Consolidated error check
    if (
      songsError ||
      membersError ||
      eventsError ||
      setlistsError ||
      teamsError ||
      setlistSongsError
    ) {
      throw (
        songsError ||
        membersError ||
        eventsError ||
        setlistsError ||
        teamsError ||
        setlistSongsError
      );
    }

    const avgSongsPerSetlist =
      totalSetlists && setlistSongs
        ? (setlistSongs.length / totalSetlists).toFixed(1)
        : 0;

    console.log("fetchSummaryStats finished successfully.");
    return {
      totalSongs,
      totalMembers,
      totalEvents,
      totalSetlists,
      avgSongsPerSetlist,
      activeTeams,
    };
  } catch (error) {
    console.error("Caught error in fetchSummaryStats:", error);
    return null;
  }
};

/**
 * Fetches the most played songs for a specific church within a time range.
 */
type SetlistSongWithDetails = {
  song: string;
  songs: {
    song_title: string;
    author: string | null;
  } | null;
};
export const fetchMostPlayedSongs = async (
  churchId: string,
  timeRange: TimeRange
): Promise<MostPlayedSong[]> => {
  console.log(
    "fetchMostPlayedSongs started for churchId:",
    churchId,
    "with timeRange:",
    timeRange
  );
  const startDate = getStartDate(timeRange);
  const supabase = await createClient();

  try {
    const { data: setlists, error: setlistsError } = await supabase
      .from("setlist")
      .select("id")
      .eq("church", churchId)
      .gte("created_at", startDate.toISOString());
    if (setlistsError) {
      console.error("Error fetching setlist IDs for songs:", setlistsError);
      throw setlistsError;
    }
    console.log("Fetched setlist IDs for songs:", setlists?.length);
    if (!setlists) return [];

    const setlistIds = setlists.map((s) => s.id);

    // Cast the data to the new, specific type to ensure type safety
    const { data, error } = (await supabase
      .from("setlist-songs")
      .select("song, songs(song_title, author)")
      .in("setlist_id", setlistIds)) as unknown as {
      data: SetlistSongWithDetails[] | null;
      error: any;
    };
    if (error) {
      console.error("Error fetching setlist songs for most played:", error);
      throw error;
    }
    console.log("Fetched song data for most played songs:", data?.length);
    if (!data) return [];

    const songPlayCounts = data.reduce<Record<string, MostPlayedSong>>(
      (acc, current) => {
        const song = current.songs;
        if (!song) {
          console.warn("Skipping a song with no details.");
          return acc;
        }
        const key = `${song.song_title}-${song.author}`;
        if (!acc[key]) {
          acc[key] = {
            song_title: song.song_title,
            author: song.author,
            play_count: 0,
          };
        }
        acc[key].play_count += 1;
        return acc;
      },
      {}
    );

    console.log("fetchMostPlayedSongs finished successfully.");
    return Object.values(songPlayCounts)
      .sort((a, b) => b.play_count - a.play_count)
      .slice(0, 8);
  } catch (error) {
    console.error("Caught error in fetchMostPlayedSongs:", error);
    return [];
  }
};

/**
 * Fetches the top serving members for a specific church within a time range.
 */
type EventTeamWithDetails = {
  member: string | null;
  profiles: {
    name: string | null;
    lastname: string | null;
  } | null;
  team: string | null;
  "church-teams": {
    team_name: string | null;
  } | null;
};

/**
 * Fetches the top serving members for a specific church within a time range.
 */
export const fetchTopServingMembers = async (
  churchId: string,
  timeRange: TimeRange
): Promise<TopServingMember[]> => {
  console.log(
    "fetchTopServingMembers started for churchId:",
    churchId,
    "with timeRange:",
    timeRange
  );
  const startDate = getStartDate(timeRange);
  const supabase = await createClient();

  try {
    const { data: setlists, error: setlistsError } = await supabase
      .from("setlist")
      .select("id")
      .eq("church", churchId)
      .gte("created_at", startDate.toISOString());
    if (setlistsError) {
      console.error("Error fetching setlist IDs for members:", setlistsError);
      throw setlistsError;
    }
    console.log("Fetched setlist IDs for members:", setlists?.length);
    if (!setlists) return [];

    const setlistIds = setlists.map((s) => s.id);

    // Tipizza il risultato della query per risolvere il problema di 'profiles'
    const { data, error } = (await supabase
      .from("event-team")
      .select("member, profiles(name, lastname), team, church-teams(team_name)")
      .in("setlist", setlistIds)
      .not("member", "is", null)
      .limit(8)) as unknown as {
      data: EventTeamWithDetails[] | null;
      error: any;
    };
    if (error) {
      console.error("Error fetching event-team data:", error);
      throw error;
    }
    console.log("Fetched event-team data:", data?.length);
    if (!data) return [];

    // Tipizza l'accumulatore per risolvere il problema del 'reduce'
    const memberServiceCounts = data.reduce<Record<string, TopServingMember>>(
      (acc, current) => {
        const profile = current.profiles;
        const team = current["church-teams"];
        if (!profile) {
          console.warn("Skipping a member with no profile details.");
          return acc;
        }

        const key = `${profile.name}-${profile.lastname}`;
        if (!acc[key]) {
          acc[key] = {
            name: profile.name,
            lastname: profile.lastname,
            team: team ? team.team_name : "N/A",
            service_count: 0,
          };
        }
        acc[key].service_count += 1;
        return acc;
      },
      {}
    );

    console.log("fetchTopServingMembers finished successfully.");
    return Object.values(memberServiceCounts)
      .sort((a, b) => b.service_count - a.service_count)
      .slice(0, 8);
  } catch (error) {
    console.error("Caught error in fetchTopServingMembers:", error);
    return [];
  }
};
/**
 * Fetches events over time for a specific church within a time range.
 */
export const fetchEventsOverTime = async (
  churchId: string,
  timeRange: TimeRange
): Promise<EventsOverTimeData[]> => {
  console.log(
    "fetchEventsOverTime started for churchId:",
    churchId,
    "with timeRange:",
    timeRange
  );
  const startDate = getStartDate(timeRange);
  const supabase = await createClient();

  try {
    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("created_at")
      .eq("church_id", churchId)
      .gte("created_at", startDate.toISOString());
    if (eventsError) {
      console.error("Error fetching events data:", eventsError);
      throw eventsError;
    }
    console.log("Fetched events data:", eventsData?.length);

    const { data: setlistsData, error: setlistsError } = await supabase
      .from("setlist")
      .select("created_at")
      .eq("church", churchId)
      .gte("created_at", startDate.toISOString());
    if (setlistsError) {
      console.error("Error fetching setlists data:", setlistsError);
      throw setlistsError;
    }
    console.log("Fetched setlists data:", setlistsData?.length);

    if (eventsError || setlistsError) throw eventsError || setlistsError;
    if (!eventsData || !setlistsData) return [];

    const monthlyCounts: Record<string, EventsOverTimeData> = {};
    const currentDate = new Date(startDate);
    const now = new Date();

    while (currentDate <= now) {
      const monthKey = currentDate.toLocaleString("it-IT", { month: "short" });
      monthlyCounts[monthKey] = { month: monthKey, events: 0, setlists: 0 };
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    eventsData.forEach((item) => {
      const date = new Date(item.created_at);
      const monthKey = date.toLocaleString("it-IT", { month: "short" });
      if (monthlyCounts[monthKey]) {
        monthlyCounts[monthKey].events += 1;
      }
    });

    setlistsData.forEach((item) => {
      const date = new Date(item.created_at);
      const monthKey = date.toLocaleString("it-IT", { month: "short" });
      if (monthlyCounts[monthKey]) {
        monthlyCounts[monthKey].setlists += 1;
      }
    });

    console.log("fetchEventsOverTime finished successfully.");
    return Object.values(monthlyCounts);
  } catch (error) {
    console.error("Caught error in fetchEventsOverTime:", error);
    return [];
  }
};

/**
 * Fetches team distribution for a specific church.
 */
export const fetchTeamDistribution = async (
  churchId: string
): Promise<TeamDistributionData[]> => {
  console.log("fetchTeamDistribution started for churchId:", churchId);

  const supabase = await createClient();

  try {
    const { data: teams, error } = await supabase
      .from("church-teams")
      .select("id, team_name")
      .eq("church", churchId);
    if (error) {
      console.error("Error fetching teams for distribution:", error);
      throw error;
    }
    console.log("Fetched teams for distribution:", teams?.length);
    if (!teams) return [];

    const teamCounts = await Promise.all(
      teams.map(async (team) => {
        const { count: membersCount, error: countError } = await supabase
          .from("event-team")
          .select("*", { count: "exact", head: true })
          .eq("team", team.id);
        if (countError) {
          console.error(
            `Error counting members for team ${team.team_name}:`,
            countError
          );
          throw countError;
        }
        console.log(
          `Members counted for team ${team.team_name}:`,
          membersCount
        );

        return {
          name: team.team_name,
          value: membersCount,
          color: "#4F46E5",
        };
      })
    );

    console.log("fetchTeamDistribution finished successfully.");
    return teamCounts;
  } catch (error) {
    console.error("Caught error in fetchTeamDistribution:", error);
    return [];
  }
};

/**
 * Fetches upcoming events for a specific church.
 */
export const fetchUpcomingEvents = async (
  churchId: string
): Promise<UpcomingEvent[]> => {
  console.log("fetchUpcomingEvents started for churchId:", churchId);
  const now = new Date().toISOString();
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("events")
      .select("title, date, start_hour")
      .eq("church_id", churchId)
      .gte("date", now)
      .order("date", { ascending: true })
      .limit(3);
    if (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
    console.log("Fetched upcoming events:", data?.length);
    if (!data) return [];

    console.log("fetchUpcomingEvents finished successfully.");
    return data.map((event) => ({
      ...event,
      attendees: 0,
    }));
  } catch (error) {
    console.error("Caught error in fetchUpcomingEvents:", error);
    return [];
  }
};
