import type { Product, ProductCategory } from '@/models/product/product'

// Catégories présentes dans le catalogue, dans l'ordre d'apparition
// (= ordre canonique garanti par le back). Les produits sans catégorie sont ignorés.
export function deriveCategories(products: Product[]): ProductCategory[] {
  const seen = new Set<string>()
  const out: ProductCategory[] = []
  for (const p of products) {
    if (p.category && !seen.has(p.category.key)) {
      seen.add(p.category.key)
      out.push(p.category)
    }
  }
  return out
}
