import { NextResponse } from "next/server";
export async function POST() {
    return NextResponse.json(
        { error: "Use o checkout do site para criar pedidos." },
        { status: 410 }
    );
}
