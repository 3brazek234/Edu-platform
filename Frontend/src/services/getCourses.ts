const WP = "http://gos-test.local";

export async function getCourses() {
  const url = `${WP}/wp-json/wp/v2/course?_embed&_fields=id,title,content,meta,_embedded.wp:featuredmedia`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}
