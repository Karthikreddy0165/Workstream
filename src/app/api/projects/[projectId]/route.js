import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function GET(request, {params}) {
    const {projectId} = params;
    if(!projectId){return NextResponse.json({error: "projectId not given"}, {status:400})}
    try{
        const projectDetails = await prisma.project.findUnique({
            select : {
                name: true,
                managerId: true
            },
            where : {id: projectId }
        })
        return NextResponse.json({data: projectDetails}, {status: 200})
    }
    catch(error){
        return NextResponse.json({error}, {status:500})
    }
}