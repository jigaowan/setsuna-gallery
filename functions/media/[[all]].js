export async function onRequestGet(ctx) {
  const pathname = new URL(ctx.request.url).pathname;
  let path = pathname.replace(/^\/media\/?/, "");

  if (!path || path === "random") {
    const listed = await ctx.env.media.list({ prefix: "images/" });
    const candidates = listed.objects.filter((obj) =>
      /\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(obj.key),
    );
    if (!candidates.length) return new Response(null, { status: 404 });
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    path = picked.key;
  }

  const file = await ctx.env.media.get(path);
  if (!file) return new Response(null, { status: 404 });

  return new Response(file.body, {
    headers: {
      "Content-Type": file.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}
