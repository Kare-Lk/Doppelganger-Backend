export function generateStore() {
  return [
    {
      name: 'Mirax',
      link: 'https://www.mirax.cl/buscadorx.php?texto=gundam&fabrica=BANDAI&c=1&ordenx=4',
      scraping_utils: {
        next_page_selector: 'li.prev-page > a.fa-angle-right',
        product_selector: '.cuerpo-footer',
        product_title_selector:
          '.footer .footer-producto .descripcion-producto a',
        product_price_selector: '.text-center .precio a',
        product_link_selector:
          '.footer .footer-producto .descripcion-producto a',
      },
    },
    {
      name: 'Blaster Chile',
      link: 'https://www.blasterchile.cl/collections/model-kit/Gundam',
      scraping_utils: {
        next_page_selector: 'span.next a',
        product_selector: '.product-block',
        product_title_selector:
          '.product-block__title .product-block__title-link',
        product_price_selector: '.product-price .theme-money .money',
        product_link_selector:
          '.product-block__title .product-block__title-link',
      },
    },
    {
      name: 'Irion',
      link: 'https://irion.cl/marcas/gundam/page/1/?orderby=price-desc&stock=instock',
      scraping_utils: {
        next_page_selector: '.next.page-numbers',
        product_selector: 'li.product',
        product_title_selector: 'h2.woocommerce-loop-product__title',
        product_price_selector: '.woocommerce-Price-amount.amount bdi',
        product_link_selector:
          'div.product-loop-header a.woocommerce-LoopProduct-link',
      },
    },
    {
      name: 'Hangar019',
      link: 'https://www.hangar019.cl/8-gunpla?marca=bandai&en-stock=1&orderby=price&orderway=desc',
      scraping_utils: {
        next_page_selector: 'li.pagination_next a',
        product_selector: '.right-block',
        product_title_selector: '.product-name-container a.product-name',
        product_price_selector: '.content_price .price',
        product_link_selector: '.product-name-container a.product-name',
      },
    },
  ]
}
