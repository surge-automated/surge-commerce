import { FC, useEffect, useState } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import CartItem from '../CartItem'
import s from './CartSidebarView.module.css'
import { Button } from '@components/ui'
import { UserNav } from '@components/common'
import { useUI } from '@components/ui/context'
import { Bag, Cross, Check } from '@components/icons'
import productSlug from '../../../products/productSlug.json'
import router from 'next/router'
import {
  ExclamationIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/solid'

const CartSidebarView = () => {
  const { closeSidebar } = useUI()
  const [loading, setLoading] = useState(false)
  const [disableCheckout, setDisableCheckout] = useState(true)
  const [id, setId] = useState(null)
  const [status, setStatus] = useState('')
  const handleClose = () => closeSidebar()
  const product = productSlug[router?.query?.slug]

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
            setDisableCheckout(false)
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
                  name: product?.name,
                  quantity: 1,
                  path: '1',
                  productId: '123',
                  variantId: '1',
                  discounts: [{ value: 0 }],
                  variant: {
                    price: product?.price?.value,
                    name: 'Test Product',
                    id: '1',
                    listPrice: 50,
                    requiresShipping: false,
                    sku: '123',
                    availableForSale: true,
                  },
                }}
                currencyCode={'$'}
                image={product?.images[0]?.url}
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
              {status === 'IN_PROGRESS' && (
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationIcon
                        className="h-5 w-5 text-yellow-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Age Verification in progress.
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              {status === 'COMPLETED' && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon
                        className="h-5 w-5 text-green"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green">
                        Age successfully verified. Proceed to checkout.
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              {['FAILED', 'CANCELED', 'EXPIRED'].includes(status) && (
                <div className="rounded-md bg-red-100 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Age verification failed.
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              {disableCheckout && (
                <Button onClick={mark}>
                  {loading ? '...Verifying Age' : 'Verify Age'}
                </Button>
              )}
            </div>
            {!disableCheckout && (
              <Button
                onClick={() => console.log('Checkout')}
                Component="a"
                width="100%"
                disabled={disableCheckout}
              >
                Proceed to Checkout
              </Button>
            )}
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
      `https://main.d3pf4vos3xyfng.amplifyapp.com/verify?transactionID=${id}`,
      'surge-vault',
      'resizeable=no,toolbar=no,scrollbar=no,menubar=no,status=no,directories=no,height=1000,width=800'
    )
    return id
  } catch (error) {
    console.log('error:', error)
  }
}

async function getStatus(id) {
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
