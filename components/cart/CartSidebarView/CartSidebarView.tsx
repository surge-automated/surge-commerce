import { FC, useEffect, useState } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import CartItem from '../CartItem'
import s from './CartSidebarView.module.css'
import { Button } from '@components/ui'
import { UserNav } from '@components/common'
import { useUI } from '@components/ui/context'
import { Bag, Cross, Check } from '@components/icons'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'

const CartSidebarView: FC = () => {
  const { closeSidebar } = useUI()
  // const { data, isLoading, isEmpty } = useCart()
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const handleClose = () => closeSidebar()

  function mark() {
    setLoading(true)
    makeTransactionCall()
      .then((id) => setId(id))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!id) return
    const dateNow = new Date()

    let interval = setInterval(() => {
      if (new Date().getTime() > dateNow.getTime() + 150000) {
        clearInterval(interval)
      }
      getStatus(id)
        .then(({ status }) => {
          setStatus(status)
          if (status === 'COMPLETED') {
            clearInterval(interval)
          }
        })
        .catch(console.log)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [id])

  const error = null
  const success = null

  return (
    <div
      className={cn(s.root, {
        [s.empty]: error || success || false || false,
      })}
    >
      <header className="px-4 pt-6 pb-4 sm:px-6">
        <div className="flex items-start justify-between space-x-3">
          <div className="h-7 flex items-center">
            <button
              onClick={handleClose}
              aria-label="Close panel"
              className="hover:text-gray-500 transition ease-in-out duration-150"
            >
              <Cross className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-1">
            <UserNav />
          </div>
        </div>
      </header>

      {false || false ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-dashed border-primary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-secondary text-secondary">
            <Bag className="absolute" />
          </span>
          <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
            Your cart is empty
          </h2>
          <p className="text-accents-3 px-10 text-center pt-2">
            Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
          </p>
        </div>
      ) : error ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
            <Cross width={24} height={24} />
          </span>
          <h2 className="pt-6 text-xl font-light text-center">
            We couldn’t process the purchase. Please check your card information
            and try again.
          </h2>
        </div>
      ) : success ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
            <Check />
          </span>
          <h2 className="pt-6 text-xl font-light text-center">
            Thank you for your order.
          </h2>
        </div>
      ) : (
        <>
          <div className="px-4 sm:px-6 flex-1">
            <Link href="/cart">
              <h2
                className="pt-1 pb-4 text-2xl leading-7 font-bold text-base tracking-wide cursor-pointer inline-block"
                onClick={handleClose}
              >
                My Cart
              </h2>
            </Link>
            <ul className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-accents-3 border-t border-accents-3">
              {/* {data!.lineItems.map((item: any) => ( */}
              <CartItem
                key={'1'}
                item={{
                  id: '1',
                  name: 'Test Product',
                  quantity: 1,
                  path: '1',
                  productId: '123',
                  variantId: '1',
                  discounts: [{ value: 0 }],
                  variant: {
                    price: 109,
                    name: 'Test Product',
                    id: '1',
                    listPrice: 50,
                    requiresShipping: false,
                    sku: '123',
                    availableForSale: true,
                  },
                }}
                currencyCode={'$'}
              />
              {/* ))} */}
            </ul>
          </div>
          <div className="flex-shrink-0 px-4  py-5 sm:px-6">
            <div className="border-t border-accents-3">
              <ul className="py-3">
                <li className="flex justify-between py-1">
                  <span>Subtotal</span>
                  <span className="font-bold">FREE</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Estimated Shipping</span>
                  <span className="font-bold tracking-wide">FREE</span>
                </li>
              </ul>
              <div className="flex justify-between border-t border-accents-3 py-3 font-bold mb-10">
                <span>Total</span>
                <span>FREE</span>
              </div>
            </div>
            <div className="flex bg-redOpac64 justify-center pb-5 flex-col">
              <div>
                <span>{status}</span>
              </div>
              <Button onClick={mark}>
                {loading ? '...Verifying Age' : 'Verify Age'}
              </Button>
            </div>
            <Button href="/checkout" Component="a" width="100%" disabled>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

const tUrl =
  'https://bvbdkefyvnfjpkob3hqn6yvnji.appsync-api.us-east-2.amazonaws.com/graphql'

async function makeTransactionCall() {
  const requestData = {
    query:
      'mutation Mine { createOneTransactions(data: {status: CREATED, location: {connect: {id: 1}}}){ id }}',
    variables: {},
  }

  try {
    const data = await fetch(tUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'da2-srmwvuvcc5dmzbwmxtrpa3l53y',
      },
      body: JSON.stringify(requestData),
    })
    const d = await data.json()
    const {
      data: {
        createOneTransactions: { id },
      },
    } = d
    window.open(
      `http://localhost:3000/verify?transactionID=${id}`,
      'surge-vault',
      'resizeable=no,toolbar=no,scrollbar=no,menubar=no,status=no,directories=no,height=200,width=200'
    )
    return id
  } catch (error) {
    console.log('error:', error)
  }
}

async function getStatus(id: string) {
  const requestData = {
    query: `query Temp { getTransactionStatus(transaction_id: "${id}") { created_at  isOver18   isOver21    updated_at    location {     active     address    company_id     created_at    location_type     id     display_name      primary_location    updated_at     url    }  status }}`,
    variables: {},
  }

  try {
    const data = await fetch(tUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'da2-srmwvuvcc5dmzbwmxtrpa3l53y',
      },
      body: JSON.stringify(requestData),
    })
    const d = await data.json()
    const {
      data: {
        getTransactionStatus: { ...datum },
      },
    } = d

    return datum
  } catch (error) {
    console.log('error:', error)
  }
}

export default CartSidebarView
