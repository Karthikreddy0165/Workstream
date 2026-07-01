import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Clean up existing tasks, projects, and users to ensure a clean state
    await prisma.comment.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});

    // 2. Create Users
    const manager = await prisma.user.create({
      data: {
        email: "john.manager@example.com",
        name: "John Carter",
        password: hashedPassword,
        role: "MANAGER",
      },
    });

    const developer1 = await prisma.user.create({
      data: {
        email: "dave.dev@example.com",
        name: "Dave Wilson",
        password: hashedPassword,
        role: "DEVELOPER",
      },
    });

    const developer2 = await prisma.user.create({
      data: {
        email: "emily.dev@example.com",
        name: "Emily Davis",
        password: hashedPassword,
        role: "DEVELOPER",
      },
    });

    const developer3 = await prisma.user.create({
      data: {
        email: "jack.dev@example.com",
        name: "Jack Thompson",
        password: hashedPassword,
        role: "DEVELOPER",
      },
    });

    // 3. Create Projects
    const project1 = await prisma.project.create({
      data: {
        name: "Project Omega",
        managerId: manager.id,
      },
    });

    const project2 = await prisma.project.create({
      data: {
        name: "Project Phoenix",
        managerId: manager.id,
      },
    });

    // 4. Create Tasks
    const task1 = await prisma.task.create({
      data: {
        title: "Backend Architecture Design",
        description: "Design the microservices architecture for Project Omega.",
        projectId: project1.id,
        status: "TODO",
        priority: "HIGH",
        taskType: "FEATURE",
        deadline: new Date("2024-10-15T00:00:00Z"),
        assignees: {
          connect: [{ id: developer1.id }, { id: developer2.id }],
        },
      },
    });

    const task2 = await prisma.task.create({
      data: {
        title: "Authentication Module",
        description: "Develop the authentication module for Project Omega.",
        projectId: project1.id,
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        taskType: "BUG",
        deadline: new Date("2024-10-05T00:00:00Z"),
        assignees: {
          connect: [{ id: developer3.id }],
        },
      },
    });

    const task3 = await prisma.task.create({
      data: {
        title: "Frontend Dashboard UI",
        description: "Create the frontend dashboard UI for Project Phoenix.",
        projectId: project2.id,
        status: "IN_PROGRESS",
        priority: "CRITICAL",
        taskType: "FEATURE",
        deadline: new Date("2024-09-30T00:00:00Z"),
        assignees: {
          connect: [{ id: developer1.id }],
        },
      },
    });

    const task4 = await prisma.task.create({
      data: {
        title: "API Error Handling",
        description: "Implement proper error handling for all API endpoints.",
        projectId: project2.id,
        status: "TODO",
        priority: "LOW",
        taskType: "ISSUE",
        deadline: new Date("2024-10-20T00:00:00Z"),
        assignees: {
          connect: [{ id: developer2.id }, { id: developer3.id }],
        },
      },
    });

    // 5. Create Comments
    await prisma.comment.createMany({
      data: [
        {
          content: "I am working on the initial layout design.",
          taskId: task1.id,
          userId: developer1.id,
          createdAt: new Date("2026-07-01T08:00:00Z"),
        },
        {
          content: "Looks good, let's ensure we focus on the scaling.",
          taskId: task1.id,
          userId: manager.id,
          createdAt: new Date("2026-07-01T08:15:00Z"),
        },
        {
          content: "Authentication APIs are 80% complete, working on JWT verification.",
          taskId: task2.id,
          userId: developer3.id,
          createdAt: new Date("2026-07-01T08:30:00Z"),
        },
        {
          content: "Initial mockups for the dashboard are uploaded. Please review.",
          taskId: task3.id,
          userId: developer1.id,
          createdAt: new Date("2026-07-01T08:45:00Z"),
        }
      ]
    });

    const credentials = [
      { role: "MANAGER", name: "John Carter", email: "john.manager@example.com", password: "password123" },
      { role: "DEVELOPER", name: "Dave Wilson", email: "dave.dev@example.com", password: "password123" },
      { role: "DEVELOPER", name: "Emily Davis", email: "emily.dev@example.com", password: "password123" },
      { role: "DEVELOPER", name: "Jack Thompson", email: "jack.dev@example.com", password: "password123" }
    ];

    return NextResponse.json({
      message: "Database seeded successfully!",
      credentials,
      seededDetails: {
        manager,
        developer1,
        developer2,
        developer3,
        project1,
        project2,
        task1,
        task2,
        task3,
        task4,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Seeding failed", details: error.message }, { status: 500 });
  }
}
