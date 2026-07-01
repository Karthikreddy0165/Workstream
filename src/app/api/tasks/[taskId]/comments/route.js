import prisma from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET /api/tasks/[taskId]/comments - Fetch all comments for a task
export async function GET(request, { params }) {
  const { taskId } = params;

  try {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ data: comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments", details: error.message }, { status: 500 });
  }
}

// POST /api/tasks/[taskId]/comments - Add a new comment to a task
export async function POST(request, { params }) {
  const { taskId } = params;

  try {
    const body = await request.json();
    const { content, userId } = body;

    if (!content || !userId) {
      return NextResponse.json({ error: "Content and userId are required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment", details: error.message }, { status: 500 });
  }
}
