import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import productSlug from '../../products/productSlug.json'

export default function Slug() {
  const router = useRouter()
  const product = productSlug[router?.query?.slug]
  return <ProductView product={product} />
}

Slug.Layout = Layout
