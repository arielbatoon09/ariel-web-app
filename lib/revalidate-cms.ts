import { revalidatePath } from "next/cache";

export function revalidateServicesPaths(slug?: string) {
  revalidatePath("/services");
  if (slug) {
    revalidatePath(`/service/${slug}`);
    revalidatePath(`/services/${slug}`);
  }
}

export function revalidateWorksPaths(slug?: string) {
  revalidatePath("/works");
  if (slug) {
    revalidatePath(`/work/${slug}`);
  }
}

export function revalidateArticlesPaths(slug?: string) {
  revalidatePath("/articles");
  if (slug) {
    revalidatePath(`/article/${slug}`);
  }
}
