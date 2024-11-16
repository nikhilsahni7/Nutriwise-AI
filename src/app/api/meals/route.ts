// import { NextResponse } from "next/server";
// import { auth } from "../../../../auth";

// export default async function GET(request: Request)
// {
//     const session = await auth();
//   if (!session)
//   {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   }

//     const { id } = session.user;

//     const meals = await prisma.meal.findMany({
//         where: {
//             userId: id,
//         },
//         orderBy: {
//             createdAt: "desc",
//         },
//     });

//   return NextResponse.next();
// }
