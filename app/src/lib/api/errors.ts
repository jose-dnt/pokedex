export function handleApiError(error: unknown) {
  if (error instanceof Error && "status" in error) {
    return Response.json(
      { error: error.message || "Unauthorized" },
      { status: (error as any).status }
    );
  }

  console.error(error);

  return Response.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
