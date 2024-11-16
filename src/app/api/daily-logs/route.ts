// // src/app/api/daily-logs/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import { auth } from "../../../../auth";
// import { z } from "zod";

// const dailyLogSchema = z.object({
//   date: z.string(),
//   exerciseStartTime: z.string().nullable(),
//   exerciseEndTime: z.string().nullable(),
//   sleepStartTime: z.string().nullable(),
//   sleepEndTime: z.string().nullable(),
//   exerciseIntensity: z
//     .enum(["MILD", "MODERATE", "INTENSE", "VERY_INTENSE"])
//     .nullable(),
// });

// export async function POST(req: Request) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const validated = dailyLogSchema.parse(body);

//     // Check for existing log for the date
//     const existingLog = await prisma.dailyLog.findFirst({
//       where: {
//         userId: session.user.id,
//         date: new Date(validated.date),
//       },
//     });

//     if (existingLog) {
//       const updated = await prisma.dailyLog.update({
//         where: { id: existingLog.id },
//         data: {
//           exerciseStartTime: validated.exerciseStartTime
//             ? new Date(validated.exerciseStartTime)
//             : null,
//           exerciseEndTime: validated.exerciseEndTime
//             ? new Date(validated.exerciseEndTime)
//             : null,
//           sleepStartTime: validated.sleepStartTime
//             ? new Date(validated.sleepStartTime)
//             : null,
//           sleepEndTime: validated.sleepEndTime
//             ? new Date(validated.sleepEndTime)
//             : null,
//           exerciseIntensity: validated.exerciseIntensity,
//         },
//         include: {
//           meals: {
//             include: {
//               nutrients: true,
//               dish: true,
//             },
//           },
//         },
//       });
//       return NextResponse.json(updated);
//     }

//     const dailyLog = await prisma.dailyLog.create({
//       data: {
//         userId: session.user.id,
//         date: new Date(validated.date),
//         exerciseStartTime: validated.exerciseStartTime
//           ? new Date(validated.exerciseStartTime)
//           : null,
//         exerciseEndTime: validated.exerciseEndTime
//           ? new Date(validated.exerciseEndTime)
//           : null,
//         sleepStartTime: validated.sleepStartTime
//           ? new Date(validated.sleepStartTime)
//           : null,
//         sleepEndTime: validated.sleepEndTime
//           ? new Date(validated.sleepEndTime)
//           : null,
//         exerciseIntensity: validated.exerciseIntensity,
//       },
//       include: {
//         meals: {
//           include: {
//             nutrients: true,
//             dish: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(dailyLog);
//   } catch (error) {
//     console.error(error);
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: error.errors }, { status: 400 });
//     }
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
