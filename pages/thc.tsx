import { Layout } from '@components/common'
import { Grid, Marquee, Hero } from '@components/ui'
import { ProductCard } from '@components/product'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import thc from '../products/thc.json'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const products = thc
  return {
    props: {
      products,
    },
    revalidate: 14400,
  }
}
export default function Thc({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Grid>
        {products.slice(0, 3).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid>
      <Marquee variant="secondary">
        {products.slice(0, 3).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="slim"
            imgProps={{
              width: 320,
              height: 320,
            }}
          />
        ))}
      </Marquee>
    </>
  )
}

Thc.Layout = Layout
