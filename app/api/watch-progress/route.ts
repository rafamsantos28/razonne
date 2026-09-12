import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  saveWatchProgress,
  getWatchProgress,
  getUserWatchProgress,
  deleteWatchProgress,
  getContinueWatching,
} from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemSlug, currentTime, duration, episodeKey } = await req.json();

    if (!itemSlug || currentTime === undefined || duration === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    const progress = await saveWatchProgress(
      userId,
      itemSlug,
      currentTime,
      duration,
      episodeKey
    );

    return Response.json(progress);
  } catch (error) {
    console.error("Error saving watch progress:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "single", "all", "continue"
    const itemSlug = searchParams.get("itemSlug");
    const episodeKey = searchParams.get("episodeKey");

    const userId = parseInt(session.user.id);

    if (type === "single" && itemSlug) {
      const progress = await getWatchProgress(userId, itemSlug, episodeKey ?? undefined);
      return Response.json(progress);
    }

    if (type === "continue") {
      const items = await getContinueWatching(userId);
      return Response.json(items);
    }

    const all = await getUserWatchProgress(userId);
    return Response.json(all);
  } catch (error) {
    console.error("Error fetching watch progress:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemSlug, episodeKey } = await req.json();
    if (!itemSlug) {
      return Response.json({ error: "Missing itemSlug" }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    await deleteWatchProgress(userId, itemSlug, episodeKey);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting watch progress:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
