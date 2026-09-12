import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  getUserWatchlist,
} from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemSlug } = await req.json();
    if (!itemSlug) {
      return Response.json({ error: "Missing itemSlug" }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    const item = await addToWatchlist(userId, itemSlug);

    return Response.json(item);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
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
    const itemSlug = searchParams.get("itemSlug");

    const userId = parseInt(session.user.id);

    if (itemSlug) {
      const inWatchlist = await isInWatchlist(userId, itemSlug);
      return Response.json({ inWatchlist });
    }

    const watchlist = await getUserWatchlist(userId);
    return Response.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemSlug } = await req.json();
    if (!itemSlug) {
      return Response.json({ error: "Missing itemSlug" }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    await removeFromWatchlist(userId, itemSlug);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
