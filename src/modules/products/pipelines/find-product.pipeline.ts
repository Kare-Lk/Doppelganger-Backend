export function findProductPipeline(
  name?: string,
  name_product_store?: string,
  category?: string,
  gunpla_grade?: string,
  max_price?: number,
) {
  const filters = {}
  const store_filters = {}
  if (name) filters['name'] = new RegExp(name, 'i')
  if (category) filters['category'] = new RegExp(category, 'i')
  if (gunpla_grade) filters['gunpla_grade'] = new RegExp(gunpla_grade, 'i')

  if (name_product_store)
    store_filters['name'] = new RegExp(name_product_store, 'i')
  if (max_price) store_filters['actual_price'] = { $lte: Number(max_price) }

  const pipeline = [
    {
      $match: filters,
    },
    {
      $lookup: {
        from: 'storeproducts',
        localField: '_id',
        foreignField: 'product_id',
        as: 'store_products',
      },
    },
  ]
  if (max_price) {
    pipeline.push({
      $match: store_filters,
    })
  }

  return pipeline
}
