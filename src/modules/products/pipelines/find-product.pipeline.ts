export function findProductPipeline(
  name: string,
  category: string,
  gunpla_grade: string,
  price: number,
) {
  console.log('price', typeof price)
  const filters = {}
  if (name) filters['name'] = new RegExp(name, 'i')
  if (category) filters['category'] = new RegExp(category, 'i')
  if (gunpla_grade) filters['gunpla_grade'] = new RegExp(gunpla_grade, 'i')

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
  if (price) {
    pipeline.push({
      $match: { 'store_products.actual_price': { $lte: Number(price) } },
    })
  }

  return pipeline
}
