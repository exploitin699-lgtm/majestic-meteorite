export async function onRequest({ request }, next) {
  const url = new URL(request.url);

  // protect teacher upload page
  if (url.pathname.startsWith("/teacher/upload")) {
    // for now: block everyone (we add auth AFTER stability)
    return Response.redirect(new URL("/teacher/login", url));
  }

  return next();
}
